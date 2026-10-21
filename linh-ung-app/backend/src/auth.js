const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'dev-secret';

const sign = (u) =>
  jwt.sign({ id: u.id, role: u.role, email: u.email, name: u.full_name }, SECRET, { expiresIn: '12h' });

const requireRole = (...roles) => (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer /, '');
    const p = jwt.verify(token, SECRET);
    if (!roles.includes(p.role)) return res.status(403).json({ error: 'Không có quyền truy cập' });
    req.user = p;
    next();
  } catch {
    res.status(401).json({ error: 'Chưa đăng nhập hoặc phiên đã hết hạn' });
  }
};
module.exports = { sign, requireRole };
