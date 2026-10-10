// backend/services/ragService.js
// Retrieval-Augmented Generation (RAG) service for SkillSetu.
// Performs semantic retrieval over public, verified knowledge chunks.

const KnowledgeChunk = require("../models/KnowledgeChunk");
const aiService = require("./aiService");
const { EMBEDDING_DIMENSIONS } = require("../config/aiConstants");

const DEFAULT_TOP_K = 3;
const DEFAULT_SIMILARITY_THRESHOLD = 0.65;
const MAX_CANDIDATE_CHUNKS = 150;

/**
 * Compute cosine similarity between two numeric vectors.
 * Clamped between 0 and 1.
 *
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
const cosineSimilarity = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;

  return Math.max(0, Math.min(1, dot / denom));
};

/**
 * Retrieves the most semantically relevant public knowledge chunks for a query.
 * Strictly scopes retrieval to public documents (isPublic: true, owner: null).
 *
 * @param {string} queryText User's input question
 * @param {object} [options]
 * @param {number} [options.topK=3] Number of chunks to retrieve
 * @param {number} [options.threshold=0.65] Minimum similarity threshold
 * @param {string} [options.category] Optional category filter
 * @returns {Promise<Array<object>>} Ranked qualifying chunks with similarity scores
 */
const retrieveRelevantChunks = async (queryText, options = {}) => {
  if (!queryText || typeof queryText !== "string" || !queryText.trim()) {
    return [];
  }

  const topK = typeof options.topK === "number" && options.topK > 0 ? options.topK : DEFAULT_TOP_K;
  const threshold =
    typeof options.threshold === "number" && options.threshold >= 0
      ? options.threshold
      : DEFAULT_SIMILARITY_THRESHOLD;

  // 1. Generate query embedding using existing AI service
  const queryEmbedding = await aiService.generateEmbedding(queryText.trim());

  if (
    !Array.isArray(queryEmbedding) ||
    queryEmbedding.length !== EMBEDDING_DIMENSIONS ||
    !queryEmbedding.every((n) => typeof n === "number" && Number.isFinite(n))
  ) {
    throw new Error(
      `Generated query embedding is invalid or does not match ${EMBEDDING_DIMENSIONS} dimensions.`
    );
  }

  // 2. Query candidate public chunks from MongoDB (bounded to MAX_CANDIDATE_CHUNKS)
  const filter = {
    isPublic: true,
    owner: null,
  };

  if (options.category) {
    filter.category = options.category;
  }

  const candidateChunks = await KnowledgeChunk.find(filter)
    .select("documentTitle documentSource category content embedding")
    .limit(MAX_CANDIDATE_CHUNKS)
    .lean();

  if (!candidateChunks || candidateChunks.length === 0) {
    return [];
  }

  // 3. Compute cosine similarity for each chunk
  const scoredChunks = [];

  for (const chunk of candidateChunks) {
    if (!Array.isArray(chunk.embedding) || chunk.embedding.length !== EMBEDDING_DIMENSIONS) {
      continue;
    }

    const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);

    if (similarity >= threshold) {
      scoredChunks.push({
        documentTitle: chunk.documentTitle,
        documentSource: chunk.documentSource,
        category: chunk.category,
        content: chunk.content,
        similarity,
      });
    }
  }

  // 4. Sort descending by similarity score and take top-K
  scoredChunks.sort((a, b) => b.similarity - a.similarity);

  return scoredChunks.slice(0, topK);
};

/**
 * Builds a formatted reference context block for inclusion in the LLM prompt.
 *
 * @param {Array<object>} chunks
 * @returns {string} Formatted context block or empty string
 */
const buildContextBlock = (chunks) => {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    return "";
  }

  const formatted = chunks.map((chunk, idx) => {
    return (
      `[Reference Document ${idx + 1}: "${chunk.documentTitle}" (Source: ${chunk.documentSource})]\n` +
      `${chunk.content}`
    );
  });

  return (
    "RELEVANT PLATFORM REFERENCE MATERIAL:\n" +
    "--------------------------------------------------\n" +
    formatted.join("\n\n") +
    "\n--------------------------------------------------"
  );
};

module.exports = {
  cosineSimilarity,
  retrieveRelevantChunks,
  buildContextBlock,
  DEFAULT_TOP_K,
  DEFAULT_SIMILARITY_THRESHOLD,
  MAX_CANDIDATE_CHUNKS,
};
