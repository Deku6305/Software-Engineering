const router = require('express').Router();
const db = require('../db');
const { sign, requireRole } = require('../auth');

// Mật khẩu so khớp bằng pgcrypto (bcrypt) ngay trong DB
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu' });
  const { rows } = await db.query(
    `SELECT id, email, full_name, role FROM accounts
      WHERE lower(email) = lower($1) AND is_active AND password_hash = crypt($2, password_hash)`,
    [email.trim(), password]
  );
  if (!rows[0]) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
  res.json({ token: sign(rows[0]), user: rows[0] });
});

router.get('/me', requireRole('admin', 'staff'), (req, res) => res.json({ user: req.user }));
module.exports = router;
