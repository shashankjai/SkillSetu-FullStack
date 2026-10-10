// backend/routes/chatbotRoutes.js
// Express routes for the SkillSetu AI Learning Assistant.
// All endpoints are protected with JWT authentication (verifyToken).

const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const {
  sendMessage,
  getHistory,
  clearHistory,
} = require("../controllers/chatbotController");

// @route   POST /api/chatbot/message
// @desc    Send message to AI Assistant
// @access  Private
router.post("/message", verifyToken, sendMessage);

// @route   GET /api/chatbot/history
// @desc    Get user's chat history
// @access  Private
router.get("/history", verifyToken, getHistory);

// @route   DELETE /api/chatbot/history
// @desc    Clear user's chat history
// @access  Private
router.delete("/history", verifyToken, clearHistory);

module.exports = router;

