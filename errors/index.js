const ApiError = require("./ApiError");
const BadRequestError = require("./BadRequestError");
const UnAuthorizedError = require("./UnAuthorizedError");
const NotFoundError = require("./NotFoundError");
module.exports = {
  ApiError,
  UnAuthorizedError,
  BadRequestError,
  NotFoundError,
};
