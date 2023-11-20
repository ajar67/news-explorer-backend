const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const jwtSecret =
  process.env.JWT_SECRET || "4buguiueirgrgkgkfjndffnfbhewwygurgfdhrghfv";

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!email) {
        throw new Error("Validation Error");
      }
      if (user) {
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
        .then((res) => {
          res.status(200).send({ email: res.email, name: res.name });
        })
        .catch((err) => {
          console.error(err);
          if (err.message === "Email already exists!") {
            next(new ConflictError("Email already exists!"));
          }
          if (err.name === "ValidationError") {
            next(new BadRequestError("Invalid data!"));
          }

          next(err);
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      console.error(err);
      next(new UnauthorizedError("Invalid Credentials!"));
    });
};

const getCurrentUser = (req, res, next) => {
  const currentUser = req.user._id; //have to look may need to be just id
  User.findById(currentUser)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NO_DATA_WITH_ID_ERROR;
      throw error;
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
