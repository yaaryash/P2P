const express = require("express");
const router = express.Router();
const { getAllUsers, createUser } = require("../controllers/Users");

router.get("/users", getAllUsers);
router.post("/users", createUser);

module.exports = router;
