const { NotFoundError, ApiError } = require("../errors");
const ioErrorHandler = require("../middleware/ioErrorHandler");
const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");

class IO {
  constructor(io) {
    //server io connection
    io.on("connection", (socket) => {
      console.log("connection happend socketID: " + socket.id);
      socket.on("user connected", async (user_id) => {
        try {
          const user = await User.findByIdAndUpdate(
            user_id,
            { connected: true },
            { new: true }
          );
          console.log("switched user state to connected ");
          socket.emit("connectionStateChange", { connected: true });
        } catch (error) {
          ioErrorHandler(error, socket);
        }
        socket.on("disconnect", async () => {
          console.log("disconnect statred");
          try {
            const user = await User.findByIdAndUpdate(
              user_id,
              { connected: false },
              { new: true }
            );
            console.log(
              "socket disconnected and user connection is " + user.connected
            );
          } catch (error) {
            ioErrorHandler(error, socket);
            console.log(error);
          }
        });
      });
      // socket.on("chat connected", async (user_id) => {
      //   try {
      //     const user = await User.findByIdAndUpdate(
      //       user_id,
      //       { inChatRoom: true },
      //       { new: true }
      //     );
      //     console.log("switched user state to connected ");
      //     socket.emit("connectionStateChange", { connected: true });
      //   } catch (error) {
      //     ioErrorHandler(error, socket);
      //   }
      //   socket.on("disconnect", async () => {
      //     console.log("disconnect statred");
      //     try {
      //       const user = await User.findByIdAndUpdate(
      //         user_id,
      //         { inChatRoom: false },
      //         { new: true }
      //       );
      //       console.log(
      //         "socket disconnected and user chatRoom is " + user.inChatRoom
      //       );
      //     } catch (error) {
      //       ioErrorHandler(error, socket);
      //       console.log(error);
      //     }
      //   });
      // });
      //on join room
      socket.on("join", (chatRoom_id, user_id) => {
        this.joinChatRoom(chatRoom_id, user_id, socket);
        console.log("joined!");
        socket.on("disconnect", async () => {
          console.log("disconnect statred");
          try {
            const user = await User.findByIdAndUpdate(
              user_id,
              { inChatRoom: false },
              { new: true }
            );
            console.log(
              "socket disconnected and user chatRoom is " + user.inChatRoom
            );
          } catch (error) {
            ioErrorHandler(error, socket);
            console.log(error);
          }
        });
        console.log(socket.rooms);
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
        console.log("new message sent " + message);
        socket.broadcast.to(chatRoom_id).emit("new message", `${message}`);
      });
    } catch (error) {
      ioErrorHandler(error, socket);
      console.log(error);
    }
  }
  sendSocketMessage() {}
}
module.exports = IO;
