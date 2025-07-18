const express = require("express");
const router = express.Router();

// In-memory storage for demonstration
const messages = [];
const users = [];

// Get all messages
router.get("/messages", (req, res) => {
  res.json(messages);
});

// Get all users
router.get("/users", (req, res) => {
  res.json(users);
});

module.exports = router;
