require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const pub = require('./routes/public');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/audio', express.static(pub.AUDIO_DIR));

app.get('/api/health', async (_req, res) => {
  const { rows } = await db.query('SELECT now() AS now');
  res.json({ ok: true, db: rows[0].now, gemini: !!process.env.GEMINI_API_KEY });
});
app.use('/api', pub);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/admin', require('./routes/admin'));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Lỗi máy chủ: ' + err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`API listening on :${PORT}`));
