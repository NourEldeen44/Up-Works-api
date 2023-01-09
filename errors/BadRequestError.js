const { StatusCodes } = require("http-status-codes");
const ApiError = require("./ApiError");

class BadRequestError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
module.exports = BadRequestError;
