require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  console.log({ body: req.body });
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!email) {
        //!user  or !email
        throw new Error("Validation Error");
      }
      if (user) {
        //!name or user
        throw new Error("Email already exists!");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => {
          res.status(200).send({ email: user.email, name: user.name });
        })
        .catch((err) => {
          console.error(err);
          if (err.name === "ValidationError") {
            next(new BadRequestError("Invalid data!"));
          }
          next(err);
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Email already exists!") {
        next(new ConflictError("Email already exists!"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  console.log({ login: req.body });
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      console.error(err);
      next(new UnauthorizedError("Invalid Credentials!"));
    });
};

const getCurrentUser = (req, res, next) => {
  const currentUser = req.user._id;
  User.findById(currentUser)
    .orFail(() => {
      throw new Error("User ID not found");
    })
    .then((result) => res.status(200).send({ data: result }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data!"));
      }
      if (err.message === "User ID not found") {
        next(new NotFoundError("User ID not found!"));
      }

      next(err);
    });
};

module.exports = { createUser, login, getCurrentUser };
