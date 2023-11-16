const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret =
  process.env.JWT_SECRET || "4buguiueirgrgkgkfjndffnfbhewwygurgfdhrghfv";

const createUser = (req, res, next) => {
  const { email, password, name } = req.body; //route for signup POST, should declare route in app.js
  User.findOne({ email })
    .then((user) => {
      if (!email) {
        throw new Error("Validation");
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
          console.log(err); //gonna need all errors here******************
          //look into next(err)
          //it will take next middleware from app.js
        });
    });
};

const login = (req, res, next) => {
  //route should be /signin in app.js POST
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: "7d" }),
      });
    })
    .catch(() => {
      next(new UnauthorizedError("Invalid Credentials!"));
    });
};

const getCurrentUser = (req, res, next) => {
  //returns information about logged-in user GET /users/me
  const currentUser = req.user._id; //have to look may need to be just id
  User.findById(currentUser)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NO_DATA_WITH_ID_ERROR;
      throw error;
    })
    .then((result) => res.status(200).send({ data: result }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data!"));
      }
      if (err.message === "User ID not found") {
        next(new NotFoundError("User ID not found!"));
      }

      next(err);
    });
};
