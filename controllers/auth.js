const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnAuthorizedError } = require("../errors");

const User = require("../models/User");
const register = async (req, res) => {
  const { username, email, password, status, skills } = req.body;
  if (!username || !email || !password || !status) {
    throw new BadRequestError(
      "please provide all values as followed {username, email, password, status}"
    );
  }
  let userData = { username, email, password, status };
  if (status == "freelancer") {
    if (!skills) {
      throw new BadRequestError("Please Provide Freelancer Skills");
    }
    userData.skills = skills.split(",");
  }
  const user = await User.create(userData);

  const token = await user.createJWT();
  res.status(StatusCodes.CREATED).json({
    msg: `user created succesfully`,
    success: true,
    user: {
      username: user.username,
      email: user.email,
      id: user._id,
      status: user.status,
    },
    token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAuthorizedError(`Unvalid Credentials`);
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthorizedError(`Unvalid Credentials`);
  }
  const token = await user.createJWT();
  res.status(StatusCodes.OK).json({
    msg: `user logged succesfully`,
    success: true,
    user: {
      username: user.username,
      email: user.email,
      id: user._id,
      status: user.status,
    },
    token,
  });
};
module.exports = { register, login };
