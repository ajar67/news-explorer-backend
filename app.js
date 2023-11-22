const express = require("express");
const helmet = require('helmet');
const limiter = require("./rateLimiter");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errorHandler } = require("./middlewares/error-handler");
const { NotFoundError } = require("./utils/errors");
const {
  createUserValidation,
  createLoginAuthenticationValidation,
} = require("./middlewares/validation");

const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");
const { createUser, login } = require("./controllers/users");

const { PORT = 3002 } = process.env;
const server = express();
server.use(helmet());
server.use(cookieParser());
mongoose.connect("mongodb://127.0.0.1:27017/final_project");
server.use(express.json());
server.use(cors());
server.use(requestLogger);

server.use("/users", limiter, userRoutes);
server.use("/articles", limiter, articleRoutes);
server.post("/signup", createUserValidation, createUser);
server.post("/signin", createLoginAuthenticationValidation, login);

server.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.url} not found!`));
});

server.use(errorLogger);
server.use(errors());
server.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
