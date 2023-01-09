const express = require("express");
const {
  getChatMessages,
  createChat,
  sendMessage,
  deleteChat,
  deleteMessage,
  getUserChatRooms,
} = require("../controllers/chat");
const router = express.Router();
//get user chats
router.get("/", getUserChatRooms);
//get chat messages
router.get("/:chat_id", getChatMessages);
//create chat with message
router.post("/", createChat);
//post message
router.post("/:chat_id", sendMessage);
//delete chat
router.delete("/:chat_id", deleteChat);
//delete message
router.delete("/:chat_id/:id", deleteMessage);

module.exports = router;
