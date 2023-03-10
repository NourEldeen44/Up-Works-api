const { StatusCodes } = require("http-status-codes");
const ApiError = require("./ApiError");

class UnAuthorizedError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
module.exports = UnAuthorizedError;
