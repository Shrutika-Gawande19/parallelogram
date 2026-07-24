import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read from .env.local if exists
let ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
try {
  const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
  const match = envFile.match(/VITE_ELEVENLABS_API_KEY=(.*)/);
  if (match) ELEVENLABS_API_KEY = match[1].trim();
} catch (e) {
  // Ignore missing file
}

if (!ELEVENLABS_API_KEY) {
  console.error("❌ ERROR: VITE_ELEVENLABS_API_KEY not found in .env.local!");
  console.error("Please add it to .env.local and run this script again.");
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio');
const AUDIO_MAP_FILE = path.join(__dirname, '../src/utils/audioMap.js');

const STYLE_SETTINGS = {
  celebration: { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question: { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis: { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking: { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// --- Add phrases used across narration.js ---
const phrases = [
  // Wonder
  { text: "Look at this playground gate sliding open...", style: 'statement' },
  { text: "The two long bars are always the same length and always stay parallel!", style: 'statement' },
  { text: "What shape do the bars make when the gate tilts? Let's find out!", style: 'question' },
  { text: "Let's discover what shape this is! We'll explore its properties and find out!", style: 'statement' },
  // Story (from storyContent.js)
  { text: "Mei Ling visited her Uncle Tan's carpentry workshop after school. She saw many wooden frames in different shapes stacked against the wall.", style: 'statement' },
  { text: "Uncle Tan was building a folding clothes rack. He showed Mei Ling how the two side bars are always the same length and always stay parallel to each other — no matter how wide or narrow the rack opens!", style: 'statement' },
  { text: "The frame forms a parallelogram. We label the four corners A, B, C, and D. The arrows on the sides show they are parallel. The tick marks show the sides are equal in length.", style: 'statement' },
  { text: "Uncle Tan measured the angle at corner A — it was 60°. Then he measured the angle at corner C, directly opposite. It was also 60°! In a parallelogram, opposite angles are always equal.", style: 'statement' },
  { text: "Next, Uncle Tan measured the angle at B. Since ∠A = 60°, and ∠A + ∠B = 180°, so ∠B = 120°. Angles that are next to each other in a parallelogram are supplementary — they add up to 180°!", style: 'statement' },
  { text: "Great job! You've discovered all the properties of a parallelogram:\n• Opposite sides are parallel and equal\n• Opposite angles are equal\n• Adjacent angles add up to 180°", style: 'celebration' },
  // Simulate
  { text: "Welcome to the Shape Shifter! Drag the top-right corner to tilt the shape. Can you make it a parallelogram?", style: 'instruction' },
  { text: "Welcome to the Repair Shop! Use the tools to fix these broken shapes by selecting the correct missing sides or angles!", style: 'instruction' },
  { text: "Welcome to the City Builder! Adjust the base, height, and slant to create different parallelograms and watch how the area changes.", style: 'instruction' },
  { text: "Great job! Station completed!", style: 'celebration' },
  // Play
  { text: "Select your world to begin!", style: 'instruction' },
  { text: "Correct! Great job!", style: 'celebration' },
  { text: "Oops! Try again!", style: 'encouragement' },
  // Reflect
  { text: "Great job! Let's reflect on what we've learned today about parallelograms. Think about how their properties help us in the real world.", style: 'statement' },
];

function normalizeText(text) {
  let t = text;
  // Normalize mathematical signs and abbreviations
  t = t.replace(/=/g, " is equal to ");
  t = t.replace(/\+/g, " plus ");
  t = t.replace(/180°/g, "one hundred eighty degrees");
  t = t.replace(/60°/g, "sixty degrees");
  t = t.replace(/120°/g, "one hundred twenty degrees");
  t = t.replace(/∠A/g, "angle A");
  t = t.replace(/∠B/g, "angle B");
  t = t.replace(/∠C/g, "angle C");
  t = t.replace(/∠D/g, "angle D");
  t = t.replace(/—/g, "..."); // pauses for dashes
  return t;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 40).replace(/_$/, '');
}

async function requestAudio(phrase, i) {
  const normText = normalizeText(phrase.text);
  const slug = `audio_${slugify(phrase.text)}_${i}.mp3`;
  const filePath = path.join(OUTPUT_DIR, slug);

  if (fs.existsSync(filePath)) {
    console.log(`✅ Skipping existing: ${slug}`);
    return `/assets/audio/${slug}`;
  }

  const voiceSettings = STYLE_SETTINGS[phrase.style] || STYLE_SETTINGS.statement;

  const data = JSON.stringify({
    text: normText,
    model_id: MODEL,
    voice_settings: voiceSettings,
  });

  const options = {
    hostname: 'api.elevenlabs.io',
    path: `/v1/text-to-speech/${VOICE_ID}`,
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errData = '';
        res.on('data', chunk => errData += chunk);
        res.on('end', () => reject(`HTTP Error ${res.statusCode}: ${errData}`));
        return;
      }
      const stream = fs.createWriteStream(filePath);
      res.pipe(stream);
      stream.on('finish', () => resolve(`/assets/audio/${slug}`));
    });

    req.on('error', (e) => reject(e.message));
    req.write(data);
    req.end();
  });
}

async function generateAll() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const map = {};
  for (let i = 0; i < phrases.length; i++) {
    const p = phrases[i];
    console.log(`[${i+1}/${phrases.length}] Generating for: "${p.text.substring(0, 30)}..."`);
    try {
      const url = await requestAudio(p, i);
      map[p.text] = url;
      await new Promise(r => setTimeout(r, 600)); // Rate limit
    } catch (e) {
      console.error(`❌ Failed on phrase ${i}:`, e);
      process.exit(1);
    }
  }

  // Write audioMap
  const jsContent = `// Auto-generated mapping file\nexport const audioMap = ${JSON.stringify(map, null, 2)};\n`;
  fs.writeFileSync(AUDIO_MAP_FILE, jsContent);
  console.log("🎉 All audio generated and audioMap.js updated successfully!");
}

generateAll();
