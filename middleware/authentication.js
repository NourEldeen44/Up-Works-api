const { UnAuthorizedError } = require("../errors");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnAuthorizedError("Not Authorized!");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = { ...payload };
    // console.log(req.user);
  } catch (error) {
    throw new UnAuthorizedError("Unvalid or Expired Token please login again");
  }
  next();
};
module.exports = auth;
