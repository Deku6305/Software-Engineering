// API công khai cho app người dùng (không cần đăng nhập)
const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('../db');
const gem = require('../gemini');

const AUDIO_DIR = process.env.AUDIO_DIR || path.join(__dirname, '../../audio');
fs.mkdirSync(AUDIO_DIR, { recursive: true });

const LANGS = { vi: 'Vietnamese', en: 'English', zh: 'Chinese (Simplified)', ko: 'Korean', ja: 'Japanese', fr: 'French' };
const L = (req) => (LANGS[req.query.lang] ? req.query.lang : 'vi');
const base = (req) => `${req.protocol}://${req.get('host')}`;
const BANK_INFO = () => process.env.BANK_INFO || 'Vietcombank - 0123456789 - CHUA LINH UNG';

router.get('/languages', (_req, res) =>
  res.json(Object.entries(LANGS).map(([code, name]) => ({ code, name }))));

// ---- Phiên người dùng ẩn danh (đếm số người đang truy cập) ----
router.post('/sessions/heartbeat', async (req, res) => {
  const { deviceId, lang, platform } = req.body || {};
  if (!deviceId) return res.status(400).json({ error: 'deviceId required' });
  await db.query(
    `INSERT INTO app_sessions (device_id, lang, platform) VALUES ($1,$2,$3)
     ON CONFLICT (device_id) DO UPDATE SET last_seen = now(), lang = EXCLUDED.lang, platform = EXCLUDED.platform`,
    [String(deviceId).slice(0, 64), lang, platform]
  );
  res.json({ ok: true });
});

// ---- POI ----
router.get('/pois', async (req, res) => {
  const { rows } = await db.query(
    `SELECT p.id, p.code, p.category, p.latitude::float8 AS lat, p.longitude::float8 AS lng,
            p.trigger_radius_m AS radius, p.image_url,
            COALESCE(t.title, te.title, tv.title) AS title,
            COALESCE(t.short_description, te.short_description, tv.short_description) AS short
       FROM pois p
       LEFT JOIN poi_translations t  ON t.poi_id  = p.id AND t.language_code  = $1
       LEFT JOIN poi_translations te ON te.poi_id = p.id AND te.language_code = 'en'
       LEFT JOIN poi_translations tv ON tv.poi_id = p.id AND tv.language_code = 'vi'
      WHERE p.is_active ORDER BY p.sort_order, p.id`, [L(req)]);
  res.json(rows);
});

const inflight = new Map();
// Lấy (hoặc sinh bằng Gemini TTS) file audio thuyết minh, cache trong thư mục /audio
async function ensureAudio(row) {
  if (row.audio_url) return row.audio_url;
  if (!gem.enabled() || process.env.ENABLE_TTS === 'false') return null;
  const file = `poi_${row.poi_id}_${row.language_code}.wav`;
  const rel = `/audio/${file}`;
  const full = path.join(AUDIO_DIR, file);
  if (fs.existsSync(full)) return rel;
  if (!inflight.has(file)) {
    inflight.set(file, (async () => {
      const buf = await gem.tts(row.narration_text);
      fs.writeFileSync(full, buf);
      await db.query('UPDATE poi_translations SET audio_url=$3 WHERE poi_id=$1 AND language_code=$2',
        [row.poi_id, row.language_code, rel]);
      return rel;
    })().finally(() => inflight.delete(file)));
  }
  try { return await inflight.get(file); } catch (e) { console.warn('TTS failed:', e.message); return null; }
}

// Thuyết minh theo ngôn ngữ: nếu chưa có bản dịch -> Gemini dịch rồi lưu cache vào DB
router.get('/pois/:id/narration', async (req, res) => {
  const id = Number(req.params.id);
  const lang = L(req);
  let { rows: [row] } = await db.query(
    'SELECT * FROM poi_translations WHERE poi_id=$1 AND language_code=$2', [id, lang]);
  let translated = false;
  if (!row) {
    const { rows: [src] } = await db.query(
      `SELECT * FROM poi_translations WHERE poi_id=$1 AND language_code IN ('vi','en')
        ORDER BY (language_code='vi') DESC LIMIT 1`, [id]);
    if (!src) return res.status(404).json({ error: 'Không tìm thấy thuyết minh' });
    row = src;
    if (gem.enabled()) {
      try {
        const tr = await gem.translatePoi(
          { title: src.title, short_description: src.short_description, narration_text: src.narration_text },
          LANGS[lang]);
        const ins = await db.query(
          `INSERT INTO poi_translations (poi_id, language_code, title, short_description, narration_text, is_auto_translated)
           VALUES ($1,$2,$3,$4,$5,TRUE) ON CONFLICT DO NOTHING RETURNING *`,
          [id, lang, tr.title, tr.short_description, tr.narration_text]);
        row = ins.rows[0] || (await db.query(
          'SELECT * FROM poi_translations WHERE poi_id=$1 AND language_code=$2', [id, lang])).rows[0];
        translated = true;
      } catch (e) { console.warn('Translate failed:', e.message); }
    }
  }
  const audio = await ensureAudio(row);
  res.json({
    poiId: id, lang: row.language_code, requestedLang: lang, translated,
    title: row.title, short: row.short_description, text: row.narration_text,
    audioUrl: audio ? base(req) + audio : null,
  });
});

router.post('/pois/:id/listen', async (req, res) => {
  const { deviceId, lang, source } = req.body || {};
  await db.query(
    'INSERT INTO poi_listens (poi_id, language_code, device_id, source) VALUES ($1,$2,$3,$4)',
    [Number(req.params.id), LANGS[lang] ? lang : 'vi', deviceId, source === 'auto' ? 'auto' : 'manual']);
  res.json({ ok: true });
});

// ---- Tuyến tham quan ----
router.get('/tours', async (req, res) => {
  const lang = L(req);
  const { rows } = await db.query(
    `SELECT t.id, t.code, t.duration_minutes,
            COALESCE(tt.name, te.name) AS name, COALESCE(tt.description, te.description) AS description,
            tp.stop_order AS "order", p.id AS poi_id, p.latitude::float8 AS lat, p.longitude::float8 AS lng,
            COALESCE(pt.title, pe.title, pv.title) AS poi_title
       FROM tours t
       LEFT JOIN tour_translations tt ON tt.tour_id = t.id AND tt.language_code = $1
       LEFT JOIN tour_translations te ON te.tour_id = t.id AND te.language_code = 'en'
       JOIN tour_pois tp ON tp.tour_id = t.id
       JOIN pois p ON p.id = tp.poi_id AND p.is_active
       LEFT JOIN poi_translations pt ON pt.poi_id = p.id AND pt.language_code = $1
       LEFT JOIN poi_translations pe ON pe.poi_id = p.id AND pe.language_code = 'en'
       LEFT JOIN poi_translations pv ON pv.poi_id = p.id AND pv.language_code = 'vi'
      WHERE t.is_active ORDER BY t.id, tp.stop_order`, [lang]);
  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.id)) map.set(r.id, { id: r.id, code: r.code, name: r.name, description: r.description,
      duration: r.duration_minutes, stops: [] });
    map.get(r.id).stops.push({ order: r.order, poiId: r.poi_id, title: r.poi_title, lat: r.lat, lng: r.lng });
  }
  res.json([...map.values()]);
});

// ---- Chỉ đường (proxy OSRM đi bộ; fallback đường thẳng) ----
const hav = (a, b) => {
  const R = 6371000, rad = (x) => (x * Math.PI) / 180;
  const dLa = rad(b[0] - a[0]), dLn = rad(b[1] - a[1]);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLn / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
router.get('/route', async (req, res) => {
  const pts = String(req.query.points || '').split(';').map((s) => s.split(',').map(Number));
  if (pts.length < 2 || pts.some((p) => p.length !== 2 || p.some(Number.isNaN)))
    return res.status(400).json({ error: 'points=lat,lng;lat,lng' });
  const coords = pts.map(([la, ln]) => `${ln},${la}`).join(';');
  const url = `${process.env.ROUTING_URL || 'https://routing.openstreetmap.de/routed-foot'}` +
    `/route/v1/foot/${coords}?overview=full&geometries=geojson`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const j = await r.json();
    if (j.code !== 'Ok') throw new Error(j.code);
    const rt = j.routes[0];
    return res.json({ provider: 'osrm', distance: rt.distance, duration: rt.duration,
      coordinates: rt.geometry.coordinates.map(([ln, la]) => ({ latitude: la, longitude: ln })) });
  } catch (e) {
    let d = 0; for (let i = 1; i < pts.length; i++) d += hav(pts[i - 1], pts[i]);
    res.json({ provider: 'straight-line', distance: d, duration: d / 1.3,
      coordinates: pts.map(([la, ln]) => ({ latitude: la, longitude: ln })) });
  }
});

// ---- Dịch vụ & đặt dịch vụ ----
router.get('/services', async (req, res) => {
  const { rows } = await db.query(
    `SELECT s.id, s.code, s.unit_price AS price,
            COALESCE(t.name, te.name) AS name, COALESCE(t.description, te.description) AS description,
            COALESCE(t.unit, te.unit) AS unit
       FROM services s
       LEFT JOIN service_translations t  ON t.service_id = s.id AND t.language_code = $1
       LEFT JOIN service_translations te ON te.service_id = s.id AND te.language_code = 'en'
      WHERE s.is_active ORDER BY s.id`, [L(req)]);
  res.json({ services: rows, bankInfo: BANK_INFO() });
});

const ORDER_SELECT = `
  SELECT o.id, o.order_code AS "orderCode", o.qr_token AS "qrToken", o.quantity, o.unit_price AS "unitPrice",
         o.total_amount AS total, o.customer_name AS "customerName", o.customer_phone AS phone,
         to_char(o.visit_date,'YYYY-MM-DD') AS "visitDate", o.note, o.status, o.created_at AS "createdAt",
         s.code AS "serviceCode", COALESCE(t.name, te.name) AS "serviceName"
    FROM orders o JOIN services s ON s.id = o.service_id
    LEFT JOIN service_translations t  ON t.service_id = s.id AND t.language_code = $1
    LEFT JOIN service_translations te ON te.service_id = s.id AND te.language_code = 'en'`;

router.post('/orders', async (req, res) => {
  const { deviceId, serviceCode, quantity, customerName, phone, visitDate, note, lang } = req.body || {};
  const qty = Number(quantity);
  if (!customerName?.trim()) return res.status(400).json({ error: 'Vui lòng nhập họ tên' });
  if (!/^\+?[0-9 .-]{8,15}$/.test(phone || '')) return res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
  if (!Number.isInteger(qty) || qty < 1 || qty > 100) return res.status(400).json({ error: 'Số lượng không hợp lệ' });
  const { rows: [svc] } = await db.query('SELECT * FROM services WHERE code=$1 AND is_active', [serviceCode]);
  if (!svc) return res.status(404).json({ error: 'Dịch vụ không tồn tại' });

  const code = 'LU' + new Date().toISOString().slice(2, 10).replace(/-/g, '') +
    crypto.randomBytes(2).toString('hex').toUpperCase();
  const { rows: [o] } = await db.query(
    `INSERT INTO orders (order_code, qr_token, device_id, service_id, quantity, unit_price, total_amount,
                         customer_name, customer_phone, visit_date, note)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,COALESCE($10::date, (now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date),$11)
     RETURNING id`,
    [code, crypto.randomBytes(12).toString('hex'), deviceId, svc.id, qty, svc.unit_price, qty * svc.unit_price,
     customerName.trim(), phone.trim(), visitDate || null, note || null]);
  const { rows: [full] } = await db.query(ORDER_SELECT + ' WHERE o.id = $2', [LANGS[lang] ? lang : 'vi', o.id]);
  res.status(201).json({ order: full, bankInfo: BANK_INFO() });
});

router.get('/orders', async (req, res) => {
  if (!req.query.deviceId) return res.json([]);
  const { rows } = await db.query(ORDER_SELECT + ' WHERE o.device_id = $2 ORDER BY o.created_at DESC LIMIT 50',
    [L(req), String(req.query.deviceId)]);
  res.json(rows);
});

// ---- Chatbot Gemini ----
let ctxCache = { at: 0, text: '' };
async function knowledge() {
  if (Date.now() - ctxCache.at < 60000) return ctxCache.text;
  const { rows: pois } = await db.query(
    `SELECT DISTINCT ON (p.id) t.title, t.narration_text FROM pois p
       JOIN poi_translations t ON t.poi_id = p.id AND t.language_code IN ('vi','en')
      WHERE p.is_active ORDER BY p.id, (t.language_code='vi') DESC`);
  const { rows: svcs } = await db.query(
    `SELECT t.name, t.description, s.unit_price, t.unit FROM services s
       JOIN service_translations t ON t.service_id = s.id AND t.language_code='vi' WHERE s.is_active`);
  ctxCache = { at: Date.now(), text:
    'ĐIỂM THAM QUAN:\n' + pois.map((p) => `- ${p.title}: ${p.narration_text}`).join('\n') +
    '\n\nDỊCH VỤ:\n' + svcs.map((s) => `- ${s.name}: ${s.description} Giá ${s.unit_price} VND/${s.unit}.`).join('\n') };
  return ctxCache.text;
}

router.post('/chat', async (req, res) => {
  const { message, history, lang } = req.body || {};
  if (!message?.trim()) return res.status(400).json({ error: 'Empty message' });
  if (!gem.enabled()) return res.status(503).json({ error: 'Chatbot chưa được cấu hình GEMINI_API_KEY ở backend.' });
  const system =
    `You are a friendly AI guide for Linh Ung Pagoda (Son Tra, Da Nang, Vietnam). ` +
    `ALWAYS answer in ${LANGS[lang] || 'the same language the user writes in'}. Be concise (max ~120 words), warm and respectful. ` +
    `Use the knowledge below for facts about the pagoda and services; if you are not sure, say so honestly instead of inventing. ` +
    `You may give general visiting etiquette (modest dress, quiet voice, remove hats in the main hall).\n\n` + (await knowledge());
  try {
    const reply = await gem.chat({
      system, message: message.slice(0, 1000),
      history: (Array.isArray(history) ? history : []).slice(-8).map((h) => ({ role: h.role, text: String(h.text).slice(0, 800) })),
    });
    res.json({ reply });
  } catch (e) {
    res.status(502).json({ error: 'Gemini lỗi: ' + e.message });
  }
});

module.exports = router;
module.exports.AUDIO_DIR = AUDIO_DIR;
