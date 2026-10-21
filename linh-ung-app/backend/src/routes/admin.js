// API quản trị: thống kê, doanh thu, lượt nghe, quản lý POI
const router = require('express').Router();
const db = require('../db');
const { requireRole } = require('../auth');
router.use(requireRole('admin'));

const TZ = `'Asia/Ho_Chi_Minh'`;
const PAID = `o.status IN ('paid','used')`;

router.get('/stats', async (_req, res) => {
  const { rows: [s] } = await db.query(`
    SELECT
      (SELECT count(*) FROM app_sessions WHERE last_seen > now() - interval '2 minutes') AS online,
      (SELECT count(*) FROM app_sessions) AS visitors,
      (SELECT count(*) FROM app_sessions WHERE (first_seen AT TIME ZONE ${TZ})::date = (now() AT TIME ZONE ${TZ})::date) AS "newToday",
      (SELECT count(*) FROM poi_listens) AS listens,
      (SELECT count(*) FROM orders WHERE status = 'pending') AS pending,
      COALESCE((SELECT sum(total_amount) FROM orders o WHERE ${PAID}
                AND (paid_at AT TIME ZONE ${TZ})::date = (now() AT TIME ZONE ${TZ})::date), 0) AS "revenueToday",
      COALESCE((SELECT sum(total_amount) FROM orders o WHERE ${PAID}), 0) AS "revenueTotal"`);
  const { rows: byLang } = await db.query(
    `SELECT COALESCE(lang,'?') AS lang, count(*) AS n FROM app_sessions
      WHERE last_seen > now() - interval '2 minutes' GROUP BY 1 ORDER BY 2 DESC`);
  res.json({ ...s, onlineByLang: byLang });
});

// Lượt nghe theo từng bản thuyết minh (POI) và ngôn ngữ
router.get('/listens', async (_req, res) => {
  const { rows } = await db.query(
    `SELECT p.id, p.code, COALESCE(t.title, p.code) AS title, l.language_code AS lang, count(l.id) AS n
       FROM pois p
       LEFT JOIN poi_translations t ON t.poi_id = p.id AND t.language_code = 'vi'
       LEFT JOIN poi_listens l ON l.poi_id = p.id
      GROUP BY p.id, t.title, l.language_code ORDER BY p.id`);
  const m = new Map();
  for (const r of rows) {
    if (!m.has(r.id)) m.set(r.id, { id: r.id, code: r.code, title: r.title, total: 0, byLang: {} });
    if (r.lang) { m.get(r.id).byLang[r.lang] = r.n; m.get(r.id).total += r.n; }
  }
  res.json([...m.values()].sort((a, b) => b.total - a.total));
});

// Doanh thu theo ngày và theo dịch vụ
router.get('/revenue', async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days) || 14, 1), 90);
  const { rows } = await db.query(
    `SELECT to_char(d,'YYYY-MM-DD') AS day, s.code, COALESCE(st.name, s.code) AS name,
            COALESCE(sum(o.total_amount),0) AS revenue, count(o.id) AS orders
       FROM generate_series(((now() AT TIME ZONE ${TZ})::date - ($1::int - 1))::timestamp,
                            (now() AT TIME ZONE ${TZ})::date::timestamp, interval '1 day') d
       CROSS JOIN services s
       LEFT JOIN service_translations st ON st.service_id = s.id AND st.language_code = 'vi'
       LEFT JOIN orders o ON o.service_id = s.id AND ${PAID} AND (o.paid_at AT TIME ZONE ${TZ})::date = d::date
      GROUP BY d, s.code, st.name ORDER BY d, s.code`, [days]);
  const byDay = new Map(), bySvc = new Map();
  for (const r of rows) {
    if (!byDay.has(r.day)) byDay.set(r.day, { day: r.day, total: 0, orders: 0, services: {} });
    const d = byDay.get(r.day); d.total += r.revenue; d.orders += r.orders; d.services[r.code] = r.revenue;
    if (!bySvc.has(r.code)) bySvc.set(r.code, { code: r.code, name: r.name, revenue: 0, orders: 0 });
    const s = bySvc.get(r.code); s.revenue += r.revenue; s.orders += r.orders;
  }
  const byService = [...bySvc.values()];
  res.json({ days, total: byService.reduce((a, s) => a + s.revenue, 0), byService, byDay: [...byDay.values()].reverse() });
});

// ---- Quản lý POI ----
router.get('/pois', async (_req, res) => {
  const { rows } = await db.query(
    `SELECT p.id, p.code, p.category, p.latitude::float8 AS lat, p.longitude::float8 AS lng,
            p.trigger_radius_m AS radius, COALESCE(t.title, p.code) AS title,
            (SELECT count(*) FROM poi_listens l WHERE l.poi_id = p.id) AS listens,
            (SELECT array_agg(language_code ORDER BY language_code) FROM poi_translations x WHERE x.poi_id = p.id) AS langs
       FROM pois p LEFT JOIN poi_translations t ON t.poi_id = p.id AND t.language_code = 'vi'
      ORDER BY p.sort_order, p.id`);
  res.json(rows);
});

router.post('/pois', async (req, res) => {
  const b = req.body || {};
  const lat = Number(b.lat), lng = Number(b.lng), radius = Number(b.radius) || 10;
  const tr = b.translations || {};
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)
    return res.status(400).json({ error: 'Tọa độ không hợp lệ' });
  if (!tr.vi?.title?.trim() || !tr.vi?.narration?.trim())
    return res.status(400).json({ error: 'Cần tiêu đề và nội dung thuyết minh tiếng Việt' });

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { rows: [p] } = await client.query(
      `INSERT INTO pois (code, category, latitude, longitude, trigger_radius_m, sort_order)
       VALUES ($1,$2,$3,$4,$5,(SELECT COALESCE(max(sort_order),0)+1 FROM pois)) RETURNING id`,
      [(b.code || `POI_${Date.now()}`).toUpperCase().replace(/\s+/g, '_'), b.category || 'other', lat, lng, radius]);
    for (const [code, v] of Object.entries(tr)) {
      if (!v?.title?.trim() || !v?.narration?.trim()) continue;
      await client.query(
        `INSERT INTO poi_translations (poi_id, language_code, title, short_description, narration_text)
         VALUES ($1,$2,$3,$4,$5)`, [p.id, code, v.title.trim(), v.short || null, v.narration.trim()]);
    }
    // tự thêm vào tuyến toàn cảnh để hiện trên bản đồ tuyến
    await client.query(
      `INSERT INTO tour_pois (tour_id, poi_id, stop_order)
       SELECT t.id, $1, COALESCE((SELECT max(stop_order) FROM tour_pois WHERE tour_id = t.id), 0) + 1
         FROM tours t WHERE t.code = 'TOUR_FULL'`, [p.id]);
    await client.query('COMMIT');
    res.status(201).json({ id: p.id });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(e.code === '23505' ? 409 : 500).json({ error: e.code === '23505' ? 'Mã POI đã tồn tại' : e.message });
  } finally { client.release(); }
});

router.delete('/pois/:id', async (req, res) => {
  const { rowCount } = await db.query('DELETE FROM pois WHERE id = $1', [Number(req.params.id)]);
  res.json({ deleted: rowCount });
});

module.exports = router;
