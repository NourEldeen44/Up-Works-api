const { NotFoundError, ApiError } = require("../errors");
const ioErrorHandler = require("../middleware/ioErrorHandler");
const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");

class IO {
  constructor(io) {
    //server io connection
    io.on("connection", (socket) => {
      socket.on("user connected", async (user_id) => {
        try {
          const user = await User.findByIdAndUpdate(
            user_id,
            { connected: true },
            { new: true }
          );
          socket.emit("connectionStateChange", { connected: true });
          // console.log("connection happend socketID: " + socket.id);
        } catch (error) {
          ioErrorHandler(error, socket);
        }
      });
      //on join room
      socket.on("join", (chatRoom_id, user_id) => {
        this.joinChatRoom(chatRoom_id, user_id, socket);
      });
      socket.on("disconnect", async () => {
        try {
          const user = await User.findByIdAndUpdate(
            user_id,
            { connected: false },
            { new: true }
          );
        } catch (error) {
          ioErrorHandler(error, socket);
        }
      });
    });
  }
  async joinChatRoom(chatRoom_id, user_id, socket) {
    try {
      const chatRoom = await ChatRoom.findById(chatRoom_id);
      if (!chatRoom) {
        socket.emit("error", "NO Chat Room found with this id");
        // throw new NotFoundError("NO Chat Room found with this id");
      }
      if (!chatRoom.users_ids.includes(user_id)) {
        socket.emit("error", "Un authorized to enter this chat room");
      }
      socket.join(chatRoom_id);
      // console.log(socket.rooms);
      // console.log(`connected to chat Room: ${chatRoom_id}`);
      //on message
      socket.on("message", (message) => {
        //send to the other user
        socket.broadcast.to(chatRoom_id).emit("new message", `${message}`);
        // console.log("new message sent " + message);
      });
    } catch (error) {
      ioErrorHandler(error, socket);
    }
  }
  sendSocketMessage() {}
}
module.exports = IO;
