const { UnAuthorizedError } = require("../errors");
const User = require("../models/User");

const clientAuth = async (req, res, next) => {
  //   const id = req.user.id;
  //   const user = await User.findById(id);
  if (req.user.status != "client") {
    throw new UnAuthorizedError("Not Authorized to Perform This Action");
  }
  next();
};
module.exports = clientAuth;
