const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errorHandler } = require("./middlewares/error-handler");

const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");
const { createUser, login } = require("./controllers/users");

const { PORT = 3001 } = process.env;
const server = express();
server.use(cookieParser());
mongoose.connect("mongodb://127.0.0.1:27017/final_project");
server.use(express.json());
server.use(cors());
server.use(requestLogger);


server.use("/users", userRoutes);
server.use("/articles", articleRoutes);
server.post("/signup", createUser);
server.post("/signin", login);

server.use(errorLogger);
server.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
