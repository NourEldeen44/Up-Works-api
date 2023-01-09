const { Schema, Types, model } = require("mongoose");
const ChatMessageSchema = new Schema(
  {
    chatRoom_id: {
      type: Types.ObjectId,
      required: true,
    },
    user_id: {
      type: Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: [true, "Please Provide Message"],
      minLength: 1,
      maxLength: 200,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
const ChatMessage = model(
  "ChatMessage",
  ChatMessageSchema,
  "upworks-chatmessages"
);
module.exports = ChatMessage;
