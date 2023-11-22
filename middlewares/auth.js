const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");
require("dotenv").config();

const jwtSecret =
  process.env.JWT_SECRET || "4buguiueirgrgkgkfjndffnfbhewwygurgfdhrghfv";

const handleAuthError = (err, next) => {
  const errorMessage = err ? err.message : "Authorization Error";
  console.error("Authorization Error:", errorMessage);
  return next(new UnauthorizedError(errorMessage));
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

const authorize = (req, res, next) => {
  console.log({ authorize: req.headers });
  const { authorization } = req.headers;
  console.log({ authorization });
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    return handleAuthError(res, err);
  }

  req.user = payload;

  return next();
};

module.exports = { authorize };
