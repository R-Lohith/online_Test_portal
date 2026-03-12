import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { getTopicModel, sanitizeTopicName } from '../models/TopicQuestion.js';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Gemini REST endpoint — direct fetch, no SDK needed
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Known non-topic collections to exclude from /topics listing
const SYSTEM_COLLECTIONS = new Set([
  'admins', 'students', 'logins', 'results',
  'studentresults', 'users', 'system.views', 'questions',
]);

// ── Helpers ──────────────────────────────────────────────────────────────────
const normaliseLevel = (raw = 'easy') => {
  const map = { easy: 'easy', medium: 'medium', hard: 'hard' };
  return map[String(raw).toLowerCase()] || 'easy';
};

// ════════════════════════════════════════════════════════════════════════════
// POST /api/mcq/manual
//
// Stores ONE manual question into the topic's own collection.
// Body: { topic, subject, level, questionText, options[], correctAnswer }
//
// MongoDB: collection = sanitized(topic), e.g. "React" → "react"
//   If "react" already exists → inserts into it (no overwrite)
//   If "react" is new        → MongoDB creates it automatically
// ════════════════════════════════════════════════════════════════════════════
router.post('/manual', async (req, res) => {
  try {
    const { topic, subject = '', level, questionText, options, correctAnswer } = req.body;

    if (!topic || !level || !questionText || !Array.isArray(options) || !correctAnswer) {
      return res.status(400).json({
        message: 'topic, level, questionText, options[] and correctAnswer are all required.',
      });
    }

    const normLevel = normaliseLevel(level);
    const filledOptions = options.filter((o) => String(o).trim());
    const correctIndex = filledOptions.indexOf(correctAnswer);

    if (correctIndex === -1) {
      return res.status(400).json({ message: 'correctAnswer must exactly match one of the options.' });
    }

    // Get/create the dynamic collection for this topic
    const TopicModel = getTopicModel(topic);
    const collectionName = sanitizeTopicName(topic);

    const doc = new TopicModel({
      level: normLevel,
      source: 'manual',
      subject: subject.trim(),
      questionText: questionText.trim(),
      options: filledOptions,
      correctAnswer: correctAnswer.trim(),   // ← plain text, NO encryption
      correctIndex,
    });

    const saved = await doc.save();

    console.log(`✅ Manual question saved → collection: "${collectionName}", level: "${normLevel}"`);

    return res.status(201).json({
      message: 'Question added successfully!',
      collection: collectionName,
      level: normLevel,
      question: saved,
    });
  } catch (err) {
    console.error('Manual question error:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// POST /api/mcq/ai
//
// Generates MCQs via Gemini AI and stores them in the topic's collection.
// Body: { topic, subject, level, count }
//
// MongoDB: same dynamic collection logic as /manual above
// ════════════════════════════════════════════════════════════════════════════
router.post('/ai', async (req, res) => {
  try {
    const { topic, subject = '', level, count = 5 } = req.body;

    if (!topic || !level) {
      return res.status(400).json({ message: 'topic and level are required.' });
    }

    const normLevel = normaliseLevel(level);
    const n = Math.max(1, Math.min(20, parseInt(count, 10) || 5));
    const collectionName = sanitizeTopicName(topic);

    // ── Gemini prompt ──────────────────────────────────────────────────────
    const prompt = `Generate exactly ${n} multiple choice questions about the topic "${topic}"${subject ? ` (subject: ${subject})` : ''} at ${normLevel} difficulty level.

Return ONLY a valid JSON array with no extra text, no markdown, and no code fences. Each element must follow this exact structure:
{
  "questionText": "...",
  "options": ["option A", "option B", "option C", "option D"],
  "correctAnswer": "exact text of the correct option (must match one of the options above)",
  "correctIndex": 0
}

Rules:
- correctIndex must be the 0-based index of correctAnswer in the options array.
- correctAnswer must EXACTLY match options[correctIndex] character by character.
- Always provide exactly 4 options per question.
- Questions must be clear, accurate MCQs for ${normLevel} difficulty on "${topic}".
- Return ONLY the JSON array — no extra words, headings, or explanation.`;

    // ── Call Gemini REST API ───────────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY not set in server/.env' });
    }

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
    let rawText = null;
    let lastErr = null;

    for (const modelName of modelsToTry) {
      const url = `${GEMINI_BASE}/${modelName}:generateContent?key=${apiKey}`;
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
          }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}: ${data.error?.message}`);
        }
        rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log(`✅ Gemini model: ${modelName}`);
        break;
      } catch (e) {
        console.warn(`⚠️  "${modelName}" failed: ${e.message?.substring(0, 100)}`);
        lastErr = e;
      }
    }

    if (rawText === null) throw lastErr || new Error('All Gemini models failed');

    // ── Parse Gemini JSON ──────────────────────────────────────────────────
    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) throw new Error('Response is not an array');
    } catch (parseErr) {
      console.error('Gemini parse error — raw:', rawText.substring(0, 300));
      return res.status(500).json({
        message: 'Gemini returned invalid JSON. Try again.',
        error: parseErr.message,
      });
    }

    // ── Build valid docs ───────────────────────────────────────────────────
    const valid = parsed
      .map((item) => ({
        level: normLevel,
        source: 'ai',
        subject: subject.trim(),
        questionText: String(item.questionText || '').trim(),
        options: Array.isArray(item.options) ? item.options.map(String) : [],
        correctAnswer: String(item.correctAnswer || '').trim(),  // plain text
        correctIndex: Number(item.correctIndex ?? 0),
      }))
      .filter((d) => d.questionText && d.options.length >= 2 && d.correctAnswer);

    if (valid.length === 0) {
      return res.status(500).json({ message: 'Gemini returned no valid questions. Try again.' });
    }

    // ── Save into topic's dynamic collection ──────────────────────────────
    const TopicModel = getTopicModel(topic);
    const created = await TopicModel.insertMany(valid);

    console.log(`✅ AI: ${created.length} questions → collection: "${collectionName}", level: "${normLevel}"`);

    return res.status(201).json({
      message: `✅ ${created.length} questions generated and saved to "${collectionName}" (${normLevel})!`,
      createdCount: created.length,
      collection: collectionName,
      topic,
      level: normLevel,
      questions: created,
    });
  } catch (err) {
    console.error('AI generation error:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// POST /api/mcq/rag
//
// Extracts text from PDF, uses Gemini to generate MCQs, and stores them.
// Body: FormData { pdf, topic, subject, level, count, customPrompt }
// ════════════════════════════════════════════════════════════════════════════
router.post('/rag', upload.single('pdf'), async (req, res) => {
  try {
    const { topic, subject = '', level = 'easy', count = 5, customPrompt = '' } = req.body;
    const pdfFile = req.file;

    if (!pdfFile) {
      return res.status(400).json({ message: 'PDF file is required.' });
    }
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required.' });
    }

    const normLevel = normaliseLevel(level);
    const n = Math.max(1, Math.min(20, parseInt(count, 10) || 5));
    const collectionName = sanitizeTopicName(topic);

    // ── Extract text from PDF ──────────────────────────────────────────────
    let pdfText = '';
    try {
      const parser = new PDFParse({ data: pdfFile.buffer });
      const result = await parser.getText();
      pdfText = result.text;
      await parser.destroy(); // Important to clean up
    } catch (pdfErr) {
      console.error('PDF Parse Error:', pdfErr);
      return res.status(400).json({ message: 'Failed to parse PDF file.', error: pdfErr.message });
    }

    if (!pdfText.trim()) {
      return res.status(400).json({ message: 'PDF file seems to be empty or contains no extractable text.' });
    }

    // ── Gemini prompt with PDF context ─────────────────────────────────────
    const prompt = `You are an expert educator. I have provided content from a PDF below. 
Your task is to generate exactly ${n} multiple choice questions about the topic "${topic}"${subject ? ` (subject: ${subject})` : ''} at ${normLevel} difficulty level, BASED ON THE PROVIDED PDF CONTENT.

${customPrompt ? `Additional Instructions: ${customPrompt}\n` : ''}

PDF CONTENT PREVIEW (first 8000 characters):
${pdfText.substring(0, 8000)}

Return ONLY a valid JSON array with no extra text. Each element must follow this structure:
{
  "questionText": "...",
  "options": ["option A", "option B", "option C", "option D"],
  "correctAnswer": "exact text of the correct option",
  "correctIndex": 0
}

Rules:
- Questions MUST be grounded in the provided PDF content.
- Always provide exactly 4 options per question.
- Return ONLY the JSON array.`;

    // ── Call Gemini REST API (reuse logic) ─────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ message: 'GEMINI_API_KEY not set.' });

    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    let rawText = null;
    let lastErr = null;

    for (const modelName of modelsToTry) {
      const url = `${GEMINI_BASE}/${modelName}:generateContent?key=${apiKey}`;
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
          }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${data.error?.message}`);
        rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (rawText === null) throw lastErr || new Error('All Gemini models failed');

    // ── Parse & Save (reuse logic) ─────────────────────────────────────────
    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      return res.status(500).json({ message: 'Gemini returned invalid JSON.', error: parseErr.message });
    }

    const valid = parsed
      .map((item) => ({
        level: normLevel,
        source: 'ai',
        subject: subject.trim(),
        questionText: String(item.questionText || '').trim(),
        options: Array.isArray(item.options) ? item.options.map(String) : [],
        correctAnswer: String(item.correctAnswer || '').trim(),
        correctIndex: Number(item.correctIndex ?? 0),
      }))
      .filter((d) => d.questionText && d.options.length >= 2 && d.correctAnswer);

    if (valid.length === 0) return res.status(500).json({ message: 'No valid questions generated.' });

    const TopicModel = getTopicModel(topic);
    const created = await TopicModel.insertMany(valid);

    return res.status(201).json({
      message: `✅ ${created.length} RAG questions generated from PDF!`,
      createdCount: created.length,
      collection: collectionName,
      questions: created,
    });
  } catch (err) {
    console.error('RAG generation error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// GET /api/mcq/topics
//
// Lists all topic collections with their level breakdown.
// Automatically excludes system/auth collections.
// ════════════════════════════════════════════════════════════════════════════
router.get('/topics', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const all = await db.listCollections().toArray();

    // Filter to only topic collections
    const topicCols = all
      .map((c) => c.name)
      .filter((name) => !SYSTEM_COLLECTIONS.has(name) && !name.startsWith('system.'));

    const topics = [];
    for (const colName of topicCols) {
      try {
        const pipeline = [
          { $group: { _id: '$level', count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ];
        const breakdown = await db.collection(colName).aggregate(pipeline).toArray();
        const total = breakdown.reduce((sum, b) => sum + b.count, 0);

        // Only include collections that have level-structured MCQ docs
        if (total > 0) {
          topics.push({
            collectionName: colName,
            displayName: colName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            total,
            levels: breakdown.map((b) => ({ level: b._id, count: b.count })),
          });
        }
      } catch {
        // Skip collections that can't be aggregated
      }
    }

    return res.json(topics.sort((a, b) => a.collectionName.localeCompare(b.collectionName)));
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// GET /api/mcq/questions
//
// Fetch questions from a specific topic collection.
// Query: ?topic=React&level=easy&source=ai
//
// If no topic is given, returns questions from ALL topic collections.
// ════════════════════════════════════════════════════════════════════════════
router.get('/questions', async (req, res) => {
  try {
    const { topic, level, source } = req.query;

    // Build mongo filter for within a collection
    const filter = {};
    if (level) filter.level = normaliseLevel(level);
    if (source) filter.source = source;

    if (topic) {
      // Query a specific topic collection
      const TopicModel = getTopicModel(topic);
      const questions = await TopicModel.find(filter).sort({ level: 1, createdAt: -1 }).lean();
      return res.json(questions.map((q) => ({ ...q, _topic: sanitizeTopicName(topic) })));
    }

    // No topic specified — gather from ALL topic collections
    const db = mongoose.connection.db;
    const allCols = await db.listCollections().toArray();
    const topicCols = allCols
      .map((c) => c.name)
      .filter((name) => !SYSTEM_COLLECTIONS.has(name) && !name.startsWith('system.'));

    const result = [];
    for (const colName of topicCols) {
      try {
        const TopicModel = getTopicModel(colName);
        const docs = await TopicModel.find(filter).sort({ level: 1, createdAt: -1 }).lean();
        docs.forEach((d) => result.push({ ...d, _topic: colName }));
      } catch { /* skip */ }
    }

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// DELETE /api/mcq/questions/:topic/:id
//
// Deletes a question from the given topic's collection.
// ════════════════════════════════════════════════════════════════════════════
router.delete('/questions/:topic/:id', async (req, res) => {
  try {
    const { topic, id } = req.params;
    const TopicModel = getTopicModel(topic);
    const deleted = await TopicModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Question not found' });
    return res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// POST /api/mcq/submit
// ════════════════════════════════════════════════════════════════════════════
router.post('/submit', async (req, res) => {
  try {
    const { studentId, answers } = req.body;
    if (!studentId || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    let correctCount = 0;
    const records = [];

    for (const a of answers) {
      const { questionId, topic, selectedIndex } = a;
      if (!topic) continue;
      try {
        const TopicModel = getTopicModel(topic);
        const doc = await TopicModel.findById(questionId).lean();
        if (!doc) continue;
        const correct = Number(selectedIndex) === Number(doc.correctIndex);
        if (correct) correctCount++;
        records.push({ questionId, selectedIndex, correctIndex: doc.correctIndex, correct });
      } catch { /* skip bad ids */ }
    }

    return res.json({ score: correctCount, total: records.length, answers: records });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
