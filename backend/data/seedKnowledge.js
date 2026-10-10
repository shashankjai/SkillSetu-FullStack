// backend/data/seedKnowledge.js
// Curated starter knowledge documents for SkillSetu RAG.
// Contains verified platform operational guides and fundamental educational notes.
// Idempotent: Uses document-scoped hashChunk upserts to prevent duplicate records.

const KnowledgeChunk = require("../models/KnowledgeChunk");
const { EMBEDDING_DIMENSIONS } = require("../config/aiConstants");

const starterKnowledgeDocuments = [
  // ── Verified SkillSetu Platform Documentation ─────────────────────
  // (Directly grounded in User.js, Session.js, Report.js, and matchController.js)
  {
    documentTitle: "SkillSetu Peer Exchange Mechanics",
    documentSource: "SkillSetu Verified Platform Documentation",
    category: "platform_guide",
    tags: ["platform", "skill swap", "peer learning", "sessions"],
    content:
      "SkillSetu is a peer-to-peer skill exchange platform where users trade skills directly without monetary fees. Each user profile defines skillsToTeach and skillsToLearn. Learners and mentors connect to schedule learning sessions with a date, time, and target skill. Upon completion of a session, both participants can submit mutual ratings from 1 to 5 stars along with written feedback.",
  },
  {
    documentTitle: "Skill Matching Compatibility & Scoring",
    documentSource: "SkillSetu Verified Platform Documentation",
    category: "platform_guide",
    tags: ["matching", "algorithm", "compatibility", "mentors"],
    content:
      "SkillSetu matches users by evaluating compatibility between what a learner wants to study and what candidates can teach. The platform computes cosine similarity over vector embeddings with a threshold of 0.70 to identify compatible peers, ranking candidates by highest score. If the AI service is unavailable, the application automatically falls back to deterministic exact matching based on normalized skill names.",
  },
  {
    documentTitle: "Community Safety, Feedback & Reporting",
    documentSource: "SkillSetu Verified Platform Documentation",
    category: "platform_guide",
    tags: ["sessions", "safety", "etiquette", "reporting"],
    content:
      "SkillSetu includes a reporting system allowing users to report disputes or inappropriate conduct related to a specific user or session. Reports capture the reporter, target user, optional session reference, reason, description, and review status ('open', 'pending', 'under review', 'resolved', 'rejected'). Platform administrators review reports, and blocked accounts are rejected at the authentication layer.",
  },

  // ── General Educational References ────────────────────────────────
  // (Clearly designated as general programming knowledge, not platform policy)
  {
    documentTitle: "Full-Stack Web Architecture Fundamentals",
    documentSource: "General Educational Reference - Web Development",
    category: "web_development",
    tags: ["webdev", "architecture", "frontend", "backend", "rest"],
    content:
      "Full-stack web architectures separate presentation layers from data persistence layers. In modern Single Page Applications (SPAs), the client-side framework handles user interfaces, client routing, and localized state, while the backend API provides authentication via JSON Web Tokens (JWT), input validation, and database access over HTTP REST endpoints or real-time WebSockets.",
  },
  {
    documentTitle: "React Component Lifecycle & State Management",
    documentSource: "General Educational Reference - Web Development",
    category: "web_development",
    tags: ["react", "hooks", "state", "frontend"],
    content:
      "React functional components manage reactivity using hooks. useState maintains component-level state, while useEffect synchronizes side-effects such as data fetching and DOM events. Shared application state is managed using state containers like Redux Toolkit or React Context. Best practices recommend keeping state colocated close to where it is used to avoid unnecessary sub-tree re-renders.",
  },
  {
    documentTitle: "Asymptotic Analysis & Big O Fundamentals",
    documentSource: "General Educational Reference - Computer Science",
    category: "dsa",
    tags: ["dsa", "big o", "complexity", "algorithms"],
    content:
      "Asymptotic analysis evaluates algorithmic efficiency as input size grows toward infinity. Time complexity quantifies the count of operations relative to input size N, while space complexity measures auxiliary memory. Standard complexity classes range from O(1) constant time, O(log N) logarithmic lookup (such as binary search), O(N) linear iteration, O(N log N) optimal comparison sort, to O(N^2) quadratic nested iteration.",
  },
  {
    documentTitle: "Array & Hash Map Problem-Solving Patterns",
    documentSource: "General Educational Reference - Computer Science",
    category: "dsa",
    tags: ["dsa", "arrays", "hashmaps", "two pointers"],
    content:
      "Common array problem-solving techniques include the Two Pointers pattern for sorted collections, the Sliding Window technique for contiguous subsegments, and Hash Map frequency indexing. Hash tables offer expected O(1) time complexity for key lookups, enabling algorithms to trade O(N) memory space to eliminate quadratic O(N^2) search loops.",
  },
  {
    documentTitle: "Database Indexing & Query Optimization",
    documentSource: "General Educational Reference - System Design",
    category: "system_design",
    tags: ["system design", "database", "indexing", "b-tree"],
    content:
      "Database indexing significantly accelerates query performance by replacing linear collection scans with structured tree searches (typically B-Trees). Compound indexes require careful consideration of equality, sort, and range key order. While indexes optimize read query latency, excessive indexes increase disk storage and write latency due to index maintenance during inserts and updates.",
  },
  {
    documentTitle: "Technical Coding Interview Methodology",
    documentSource: "General Educational Reference - Career & Interviews",
    category: "interview_prep",
    tags: ["interview", "coding interview", "problem solving"],
    content:
      "Effective technical interview communication follows five disciplined steps: 1. Clarify constraints, data types, and potential edge cases before writing code. 2. Articulate a baseline brute-force approach with its complexity. 3. Propose an optimized algorithm with rationale. 4. Write modular, readable code. 5. Trace through test inputs manually to verify correctness and boundary conditions.",
  },
  {
    documentTitle: "Behavioral Interview STAR Technique",
    documentSource: "General Educational Reference - Career & Interviews",
    category: "interview_prep",
    tags: ["interview", "behavioral", "star method", "communication"],
    content:
      "Behavioral interview answers are structured using the STAR method: Situation (project context and background), Task (your specific challenge or responsibility), Action (the concrete engineering steps and decisions you executed), and Result (the measurable outcome, impact, and lessons learned). Emphasize personal contribution, collaborative communication, and engineering ownership.",
  },
];

/**
 * Prepares knowledge chunks with deterministic hashes without persisting to the database.
 * Does not make external network or database calls.
 *
 * @returns {Array<object>}
 */
const prepareChunks = () => {
  return starterKnowledgeDocuments.map((doc, idx) => {
    // Deterministic hash combining documentTitle, chunkIndex, and content
    const contentHash = KnowledgeChunk.hashChunk(doc.documentTitle, idx, doc.content);
    return {
      documentTitle: doc.documentTitle,
      documentSource: doc.documentSource,
      category: doc.category,
      chunkIndex: idx,
      content: doc.content,
      contentHash,
      dimensions: EMBEDDING_DIMENSIONS,
      isPublic: true,
      owner: null,
      tags: doc.tags || [],
    };
  });
};

/**
 * Idempotently seeds knowledge documents into MongoDB.
 *
 * SAFETY CONTRACT:
 * - Requires an embeddingGenerator function. Throws immediately if omitted to prevent
 *   saving invalid chunks with empty or placeholder vectors.
 * - Updates existing documents matching contentHash rather than creating duplicates.
 *
 * @param {Function} embeddingGenerator Async function receiving text and returning a 3072-dim array
 * @returns {Promise<{ total: number, processed: number, skipped: number }>}
 */
const seedKnowledgeBase = async (embeddingGenerator) => {
  if (typeof embeddingGenerator !== "function") {
    throw new Error(
      "seedKnowledgeBase requires an active embeddingGenerator function. " +
      "Documents cannot be persisted without valid embedding vectors."
    );
  }

  const prepared = prepareChunks();
  let processedCount = 0;

  for (const chunk of prepared) {
    const embedding = await embeddingGenerator(chunk.content);

    const allFinite =
      Array.isArray(embedding) &&
      embedding.every((n) => typeof n === "number" && Number.isFinite(n));

    if (!Array.isArray(embedding) || embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(
        `embeddingGenerator returned invalid vector length for "${chunk.documentTitle}". ` +
        `Expected ${EMBEDDING_DIMENSIONS} dimensions, received ${embedding ? embedding.length : "invalid"}.`
      );
    }

    if (!allFinite) {
      throw new Error(
        `embeddingGenerator returned vector with non-finite or non-numeric values for "${chunk.documentTitle}".`
      );
    }

    const updateDoc = {
      $set: {
        documentTitle: chunk.documentTitle,
        documentSource: chunk.documentSource,
        category: chunk.category,
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
        contentHash: chunk.contentHash,
        dimensions: embedding.length,
        embedding: embedding,
        isPublic: true,
        owner: null,
        tags: chunk.tags,
      },
    };

    const res = await KnowledgeChunk.updateOne(
      { contentHash: chunk.contentHash },
      updateDoc,
      { upsert: true, runValidators: true }
    );

    if (res.upsertedCount > 0 || res.modifiedCount > 0 || res.matchedCount > 0) {
      processedCount++;
    }
  }

  return {
    total: prepared.length,
    processed: processedCount,
  };
};

module.exports = {
  starterKnowledgeDocuments,
  prepareChunks,
  seedKnowledgeBase,
};
