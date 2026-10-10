// backend/controllers/chatbotController.js
// Handles AI Learning Assistant conversational messages, history retrieval,
// and history clearing with rate limiting and user ownership enforcement.

const ChatbotMessage = require("../models/ChatbotMessage");
const chatbotService = require("../services/chatbotService");

// ── In-Memory Per-User Rate Limiter (approx. 20 req/min) ───────────
const chatbotRateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 20;

const checkChatbotRateLimit = (userId) => {
  const now = Date.now();
  const record = chatbotRateLimitMap.get(userId) || {
    count: 0,
    resetTime: now + RATE_LIMIT_WINDOW_MS,
  };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    chatbotRateLimitMap.set(userId, record);
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  record.count += 1;
  chatbotRateLimitMap.set(userId, record);
  return true;
};

// Periodic map cleanup every 5 minutes
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [userId, record] of chatbotRateLimitMap.entries()) {
    if (now > record.resetTime) {
      chatbotRateLimitMap.delete(userId);
    }
  }
}, 5 * 60 * 1000);
if (cleanupInterval.unref) cleanupInterval.unref();

// ── Controller Handlers ─────────────────────────────────────────────

/**
 * @route   POST /api/chatbot/message
 * @desc    Send a message to the AI Assistant with RAG context and persist turn
 * @access  Private (JWT auth required)
 */
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Input validation
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ msg: "Message is required and cannot be empty." });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 2000) {
      return res.status(400).json({
        msg: "Message exceeds maximum allowed length of 2000 characters.",
      });
    }

    // 2. Per-user rate limiting
    if (!checkChatbotRateLimit(req.user.id)) {
      return res.status(429).json({
        msg: "Too many chatbot requests. Please wait a moment before sending another message.",
      });
    }

    // 3. Persist the user's incoming message
    const userMessageDoc = new ChatbotMessage({
      user: req.user.id,
      role: "user",
      content: trimmedMessage,
    });
    await userMessageDoc.save();

    // 4. Generate AI response with RAG context
    let aiResult;
    try {
      aiResult = await chatbotService.generateChatResponse(
        req.user.id,
        trimmedMessage
      );
    } catch (aiErr) {
      // If AI fails, return 500 error
      return res.status(500).json({
        msg: aiErr.message || "Failed to generate AI response. Please try again.",
      });
    }

    // 5. Persist the model's response with source attribution
    const modelMessageDoc = new ChatbotMessage({
      user: req.user.id,
      role: "model",
      content: aiResult.reply,
      sources: aiResult.sources || [],
    });
    await modelMessageDoc.save();

    // 6. Return response
    return res.status(200).json({
      reply: aiResult.reply,
      sources: aiResult.sources || [],
      contextUsed: Boolean(aiResult.contextUsed),
      messageId: modelMessageDoc._id,
    });
  } catch (err) {
    console.error("Error in chatbot sendMessage:", err);
    return res.status(500).json({ msg: "Server error processing chat message." });
  }
};

/**
 * @route   GET /api/chatbot/history
 * @desc    Retrieve authenticated user's chat history in chronological order
 * @access  Private (JWT auth required)
 */
const getHistory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

    const history = await ChatbotMessage.find({ user: req.user.id })
      .sort({ createdAt: 1 })
      .limit(limit)
      .select("-__v")
      .lean();

    return res.status(200).json(history);
  } catch (err) {
    console.error("Error in chatbot getHistory:", err);
    return res.status(500).json({ msg: "Server error fetching chat history." });
  }
};

/**
 * @route   DELETE /api/chatbot/history
 * @desc    Clear all chatbot messages belonging to the authenticated user
 * @access  Private (JWT auth required)
 */
const clearHistory = async (req, res) => {
  try {
    const result = await ChatbotMessage.deleteMany({ user: req.user.id });

    return res.status(200).json({
      msg: "Chat history cleared successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Error in chatbot clearHistory:", err);
    return res.status(500).json({ msg: "Server error clearing chat history." });
  }
};

module.exports = {
  sendMessage,
  getHistory,
  clearHistory,
  checkChatbotRateLimit,
  chatbotRateLimitMap,
  MAX_REQUESTS_PER_MINUTE,
};

