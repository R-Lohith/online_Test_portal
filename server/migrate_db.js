/**
 * migrate_db.js  ─  Run ONCE to:
 *   1. Drop old "aiquestions" and "manualquestions" collections
 *   2. Create indexes on the new "questions" collection
 *   3. Print the final collection list so you can confirm the structure
 *
 * Usage (from the /server directory):
 *   node migrate_db.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bit_test';

async function migrate() {
    console.log('\n🔄  Connecting to MongoDB…');
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to:', mongoose.connection.host);

    const db = mongoose.connection.db;

    // ── 1. List existing collections ──────────────────────────────────────────
    const before = (await db.listCollections().toArray()).map((c) => c.name);
    console.log('\n📦  Collections BEFORE migration:', before);

    // ── 2. Drop old collections ───────────────────────────────────────────────
    const toDrop = ['aiquestions', 'manualquestions'];
    for (const col of toDrop) {
        if (before.includes(col)) {
            await db.collection(col).drop();
            console.log(`🗑   Dropped collection: ${col}`);
        } else {
            console.log(`ℹ️   Collection "${col}" does not exist – skipping`);
        }
    }

    // ── 3. Ensure "questions" collection exists with correct indexes ──────────
    const questionsCol = db.collection('questions');
    await questionsCol.createIndex({ topic: 1, level: 1 });
    await questionsCol.createIndex({ source: 1 });
    console.log('📑  Indexes created on "questions": { topic, level } and { source }');

    // ── 4. Print current state ────────────────────────────────────────────────
    const after = (await db.listCollections().toArray()).map((c) => c.name);
    console.log('\n📦  Collections AFTER migration:', after);

    // Show question breakdown by topic → level
    const pipeline = [
        {
            $group: {
                _id: { topic: '$topic', level: '$level', source: '$source' },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.topic': 1, '_id.level': 1 } },
    ];
    const breakdown = await questionsCol.aggregate(pipeline).toArray();

    if (breakdown.length === 0) {
        console.log('\n📊  "questions" collection is empty (add questions via the admin UI)');
    } else {
        console.log('\n📊  Current question breakdown:');
        console.log('────────────────────────────────────────');
        for (const row of breakdown) {
            console.log(
                `  Topic: ${row._id.topic || '(none)'}  │  Level: ${row._id.level}  │  Source: ${row._id.source}  │  Count: ${row.count}`
            );
        }
    }

    console.log('\n✅  Migration complete!\n');
    await mongoose.disconnect();
    process.exit(0);
}

migrate().catch((err) => {
    console.error('❌  Migration failed:', err.message);
    process.exit(1);
});
