const { Schema, model } = require("mongoose");
const bcrybt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please Provide Email"],
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Provide Password"],
      minLength: [6, "Too Short Password"],
    },
    username: {
      type: String,
      required: [true, "Please Provide username"],
      trim: true,
      minLength: 2,
      maxLength: 20,
    },
    status: {
      type: String,
      required: [true, "Please Provide Status"],
      enum: ["client", "freelancer"],
    },
    skills: {
      type: [String],
      validate: {
        validator: function (v) {
          if (1 <= v.length <= 5) {
            return true;
          } else {
            return false;
          }
        },
        message: "too much skills 5 skills max",
      },
      trim: true,
    },
    connected: {
      type: Boolean,
      default: false,
    },
    notifications: {
      type: [String],
      default: [],
    },
    inChatRoom: {
      type: Boolean,
      default: false,
    },
  },
  {}
);
userSchema.pre("save", async function () {
  const salt = await bcrybt.genSalt(10);
  this.password = await bcrybt.hash(this.password, salt);
});
userSchema.methods.createJWT = async function () {
  const token = jwt.sign(
    { id: this._id, username: this.username, status: this.status },
    process.env.JWT_SECRET,
    { expiresIn: process.env.LIFE_TIME }
  );
  return token;
};
userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrybt.compare(password, this.password);
  return isMatch;
};
const User = model("User", userSchema, "upworks-users");
module.exports = User;
