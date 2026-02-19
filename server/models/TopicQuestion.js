import mongoose from 'mongoose';

/**
 * DYNAMIC TOPIC COLLECTIONS
 * ─────────────────────────
 * Instead of one "questions" collection, each topic gets its OWN collection.
 *
 * MongoDB Structure:
 *   Database: bit_test
 *   ├── Collection: "react"          ← topic "React" (auto-created)
 *   │     { level: "easy",   source: "manual", questionText, options, correctAnswer, correctIndex, subject, createdAt }
 *   │     { level: "medium", source: "ai",     questionText, options, correctAnswer, correctIndex, subject, createdAt }
 *   │     { level: "hard",   source: "ai",     questionText, options, correctAnswer, correctIndex, subject, createdAt }
 *   │
 *   ├── Collection: "javascript"     ← topic "JavaScript" (auto-created)
 *   │     { level: "easy",   source: "manual", ... }
 *   │
 *   └── Collection: "node_js"        ← topic "Node.js" → sanitized to "node_js"
 *
 * Rules:
 *   - Topic name → collection name: lowercase, spaces→underscores, strip special chars
 *   - If topic collection already exists → INSERT into existing collection (no duplicate)
 *   - level field: "easy" | "medium" | "hard"
 *   - source field: "manual" | "ai"
 *   - correctAnswer: PLAIN TEXT (no encryption)
 */

// ── Shared schema used for EVERY topic collection ───────────────────────────
const TopicQuestionSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
        lowercase: true,
    },
    source: {
        type: String,
        enum: ['manual', 'ai'],
        required: true,
        default: 'manual',
    },
    subject: {
        type: String,
        default: '',
        trim: true,
    },
    questionText: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: (val) => val.length >= 2,
            message: 'At least 2 options required',
        },
    },
    // Correct answer stored as PLAIN TEXT — never encrypted
    correctAnswer: {
        type: String,
        required: true,
        trim: true,
    },
    // 0-based index of correct option
    correctIndex: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index within each topic collection for fast level-wise queries
TopicQuestionSchema.index({ level: 1, createdAt: -1 });

// ── In-memory cache so we don't re-register models on every request ─────────
const modelCache = {};

/**
 * getTopicModel(topicName)
 *
 * Returns a Mongoose model whose backing collection is named after the topic.
 *   e.g. "React"       → collection "react"
 *        "Node.js"     → collection "node_js"
 *        "Data Structures" → collection "data_structures"
 *
 * MongoDB automatically creates the collection on first insert — no setup needed.
 * If the collection already exists, documents are appended to it.
 */
export const getTopicModel = (topicName) => {
    if (!topicName || typeof topicName !== 'string') {
        throw new Error('Topic name must be a non-empty string');
    }

    // Sanitize: lowercase → replace spaces/dots/dashes → remove remaining specials
    const collectionName = topicName
        .trim()
        .toLowerCase()
        .replace(/[\s.\-/\\]+/g, '_')   // spaces, dots, dashes → underscore
        .replace(/[^a-z0-9_]/g, '')      // strip anything else
        .replace(/_+/g, '_')             // collapse consecutive underscores
        .replace(/^_|_$/g, '');          // trim leading/trailing underscores

    if (!collectionName) throw new Error(`Topic "${topicName}" produces an empty collection name`);

    // Return cached model if already registered
    if (modelCache[collectionName]) return modelCache[collectionName];

    // mongoose.models contains models previously registered this session
    if (mongoose.models[collectionName]) {
        modelCache[collectionName] = mongoose.models[collectionName];
        return modelCache[collectionName];
    }

    // Create a new model with the topic name as the explicit collection name
    // Third argument to mongoose.model() is the collection name override
    const model = mongoose.model(collectionName, TopicQuestionSchema, collectionName);
    modelCache[collectionName] = model;

    console.log(`📦 Topic collection ready: "${collectionName}"`);
    return model;
};

/**
 * sanitizeTopicName(raw)
 * Returns the collection name that getTopicModel would produce.
 * Useful in routes to build consistent collection names.
 */
export const sanitizeTopicName = (raw) =>
    raw.trim().toLowerCase()
        .replace(/[\s.\-/\\]+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
