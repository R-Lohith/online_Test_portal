// test_gemini.js — run: node test_gemini.js
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
console.log('API Key prefix:', API_KEY?.substring(0, 20));

// Try both v1 and v1beta endpoints with multiple models
const endpoints = [
    { version: 'v1', model: 'gemini-1.5-flash' },
    { version: 'v1', model: 'gemini-1.5-pro' },
    { version: 'v1beta', model: 'gemini-2.0-flash' },
    { version: 'v1beta', model: 'gemini-2.0-flash-lite' },
    { version: 'v1beta', model: 'gemini-2.5-flash' },
    { version: 'v1', model: 'gemini-pro' },
];

for (const { version, model } of endpoints) {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${API_KEY}`;
    try {
        console.log(`\n🧪 Testing ${version}/${model}...`);
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Say hello in one word.' }] }],
            }),
        });
        const data = await resp.json();
        if (resp.ok) {
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log(`✅ WORKS! Response: "${text}"`);
            break;
        } else {
            console.log(`❌ Status ${resp.status}: ${JSON.stringify(data.error?.message)?.substring(0, 100)}`);
        }
    } catch (e) {
        console.log(`❌ Error: ${e.message}`);
    }
}

process.exit(0);
