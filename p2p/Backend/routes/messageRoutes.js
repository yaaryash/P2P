const express = require("express");
const Message = require("../models/Friends");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:id", async (req, res) => {
  try {
    const friend = await Message.findById(req.params.id);
    friend.messages.push(req.body);
    friend.lastMessage = req.body.text;
    friend.timestamp = new Date();
    await friend.save();
    res.json(friend);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:receiver", authMiddleware, async (req, res) => {
  const sender = req.user.userId;
  const { receiver } = req.params;

  const messages = await Message.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  }).sort("timestamp");

  res.json(messages);
});

module.exports = router;
