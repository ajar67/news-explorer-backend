const rateLimiter = require("express-rate-limiter");

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = limiter;
