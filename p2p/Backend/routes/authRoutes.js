const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Email or phone already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, phone, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: email }, { phone: phone }],
  });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token, user });
});

module.exports = router;
