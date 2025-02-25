const express = require("express");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

router.get("/messages", authenticate, async (req, res) => {
  const messages = await Message.find({ receiver: req.user.userId }).populate(
    "sender",
    "email"
  );
  res.json(messages);
});

router.post("/send", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const newMessage = new Message({ text });
    await newMessage.save();

    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
