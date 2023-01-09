const { StatusCodes } = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
  // mongoose duplicate err handler
  if (err.code && err.code == 11000) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Duplicated Value For ${Object.keys(err.keyValue)}` });
  }
  //mongoose validation err handler
  if (err.name == "ValidationError") {
    const errValues = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Validation Error: ${errValues}` });
  }
  //mongoose Cast err handler
  if (err.name == "CastError") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `No item Found with id ${err.value} ` });
  }
  // default and custom err handler
  res
    .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: err.message || "something went wrong..." });
};
module.exports = errorHandler;
