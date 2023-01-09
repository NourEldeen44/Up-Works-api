const { Schema, Types, model } = require("mongoose");
const ChatRoomSchema = new Schema(
  {
    users_ids: {
      type: [Types.ObjectId],
      required: true,
      // unique: true, need way to check unique for all elements together
    },
  },
  { timestamps: true }
);
const ChatRoom = model("ChatRoom", ChatRoomSchema, "upworks-chatrooms");
module.exports = ChatRoom;
