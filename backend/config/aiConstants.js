// backend/config/aiConstants.js
// Shared AI configuration constants to prevent circular dependencies.
// Does not modify or replace existing aiService.js.

const EMBEDDING_DIMENSIONS = 3072;
const EMBEDDING_MODEL = "gemini-embedding-001";
const LLM_MODEL = "gemini-3.1-flash-lite";
const LLM_FALLBACK_MODEL = "gemini-3.8-flash";

module.exports = {
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
  LLM_MODEL,
  LLM_FALLBACK_MODEL,
};

