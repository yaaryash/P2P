const User = require("../models/Friends");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email lastMessage timestamp messages isActive")
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, lastMessage, isActive, messages } = req.body;
    const user = await User.create({
      name,
      email,
      lastMessage,
      timestamp: new Date(),
      isActive,
      messages,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
