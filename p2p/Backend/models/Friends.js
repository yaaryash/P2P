const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: false
  },
  lastMessage: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      text: String,
      sender: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
});

module.exports = mongoose.model("Friend", FriendSchema);