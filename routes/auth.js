const express = require("express");
const {
  register,
  login,
  getUserInfo,
  updateUserNotifications,
} = require("../controllers/auth");
const auth = require("../middleware/authentication");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/users/:id", auth, getUserInfo);
router.patch("/users/:id", auth, updateUserNotifications);
module.exports = router;
