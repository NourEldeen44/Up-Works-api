const { StatusCodes } = require("http-status-codes");

const notFound = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).send("404| Not Found!");
};
module.exports = notFound;
