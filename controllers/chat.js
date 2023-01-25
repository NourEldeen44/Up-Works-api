const { StatusCodes } = require("http-status-codes");
const ChatRoom = require("../models/ChatRoom");
const ChatMessage = require("../models/ChatMessage");
const { BadRequestError, NotFoundError } = require("../errors");
const User = require("../models/User");
const getUserChatRooms = async (req, res) => {
  const user_id = req.user.id;
  //continue
  const result = ChatRoom.find({
    users_ids: { $in: user_id },
  }).sort("-updatedAt");
  //pagination
  const page = Number(req.query.page) || 1;
  const pageLimit = Number(req.query.limit) || 25;
  const pageSkip = pageLimit * (page - 1);
  result.skip(pageSkip).limit(pageLimit);
  //
  const chatRooms = await result;
  res.status(StatusCodes.OK).json({ chatRooms });
};
const getChatMessages = async (req, res) => {
  const { chat_id } = req.params;
  const { id: user_id } = req.user;
  const limit = Number(req.query.limit) || 50;
  const chatRoom = await ChatRoom.findById(chat_id);
  if (!chatRoom) {
    throw new NotFoundError(`No Chat Found with id ${chat_id}`);
  }
  if (!chatRoom.users_ids.includes(user_id)) {
    throw new NotFoundError(`No Chat Found For this user with id ${chat_id}`);
  }
  const chatMessages = await ChatMessage.find({ chatRoom_id: chat_id })
    .sort("-createdAt")
    .limit(limit);
  res
    .status(StatusCodes.OK)
    .json({ chatMessages, count: chatMessages.length, chatRoom });
};
//
const createChat = async (req, res) => {
  const user_id = req.user.id;
  const { message, otherUser_id } = req.body;
  if (!message || !otherUser_id) {
    throw new BadRequestError("Please Provide messgae and otherUser_id");
  }
  const chatRoomExists = await ChatRoom.findOne({
    users_ids: { $all: [user_id, otherUser_id] },
  });
  if (chatRoomExists) {
    throw new Error(
      `This Chat Room already exists and id is ${chatRoomExists._id}`
    );
  }
  const otherUser = await User.findById(otherUser_id);
  if (!otherUser) {
    throw new BadRequestError(`Unvalid or Deleted User id ${otherUser_id}`);
  }
  const chatRoom = await ChatRoom.create({
    users_ids: [user_id, otherUser_id],
  });
  const chatMessage = await ChatMessage.create({
    chatRoom_id: chatRoom._id,
    user_id,
    message,
  });
  res.status(StatusCodes.CREATED).json({
    msg: `Chat Created Successfuly and Message was Sent`,
    success: true,
    chatRoom,
    chatMessage,
  });
};
//
const sendMessage = async (req, res) => {
  const { chat_id } = req.params;
  const user_id = req.user.id;
  const { message } = req.body;
  if (!message) {
    throw new BadRequestError("Please Provide message and otherUser_id");
  }

  const chatMessage = await ChatMessage.create({
    chatRoom_id: chat_id,
    user_id,
    message,
  });
  const chatRoom = await ChatRoom.findByIdAndUpdate(chat_id, {
    updatedAt: chatMessage.createdAt,
  });
  res.status(StatusCodes.CREATED).json({
    msg: `Message Sent successfuly`,
    success: true,
    chatMessage,
  });
};
const deleteChat = async (req, res) => {
  const { chat_id } = req.params;
  const deletedChatMessages = await ChatMessage.deleteMany({
    chatRoom_id: chat_id,
  });
  const deletedChatRoom = await ChatRoom.findByIdAndDelete(chat_id);
  if (!deletedChatRoom) {
    throw new NotFoundError(`No Chat Found with id ${chat_id}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Chat Deleted Successfuly", success: true });
};
const deleteMessage = async (req, res) => {
  const { id } = req.params;
  const deletedMessage = await ChatMessage.findByIdAndDelete(id);
  if (!deletedMessage) {
    throw new NotFoundError(`No Message Found with id ${id}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Message Deleted Successfuly", success: true });
};
module.exports = {
  getUserChatRooms,
  getChatMessages,
  createChat,
  sendMessage,
  deleteChat,
  deleteMessage,
};
