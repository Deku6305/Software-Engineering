// Gọi Gemini REST API: chat, dịch nội dung, text-to-speech
const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const TTS_MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const enabled = () => !!KEY;

async function generate(model, body) {
  if (!KEY) throw new Error('GEMINI_API_KEY chưa được cấu hình');
  const r = await fetch(`${BASE}/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || r.statusText);
  return j;
}

const textOf = (j) => (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');

async function chat({ system, history = [], message }) {
  const contents = [
    ...history.map((h) => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: message }] },
  ];
  const j = await generate(MODEL, { system_instruction: { parts: [{ text: system }] }, contents });
  return textOf(j).trim();
}

// Dịch {title, short_description, narration_text} sang ngôn ngữ đích, trả về JSON cùng cấu trúc
async function translatePoi(obj, langName) {
  const prompt =
    `Translate the values of this JSON object into ${langName}. Keep the keys unchanged, keep the tone of a ` +
    `warm tour guide, return ONLY valid JSON.\n` + JSON.stringify(obj);
  const j = await generate(MODEL, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });
  return JSON.parse(textOf(j));
}

function wav(pcm, rate = 24000) {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

// Trả về Buffer WAV
async function tts(text, voice = 'Kore') {
  const j = await generate(TTS_MODEL, {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
    },
  });
  const b64 = j.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) throw new Error('TTS không trả về audio');
  return wav(Buffer.from(b64, 'base64'));
}

module.exports = { enabled, chat, translatePoi, tts };
