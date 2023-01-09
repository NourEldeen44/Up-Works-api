const mongoose = require("mongoose");
const connectDB = async (url) => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(url);
};
module.exports = connectDB;
