// Nghiệp vụ cho staff (và admin): danh sách đơn, xác nhận thanh toán, quét QR check-in
const router = require('express').Router();
const db = require('../db');
const { requireRole } = require('../auth');
router.use(requireRole('staff', 'admin'));

const SELECT = `
  SELECT o.id, o.order_code AS "orderCode", o.quantity, o.total_amount AS total, o.customer_name AS "customerName",
         o.customer_phone AS phone, to_char(o.visit_date,'YYYY-MM-DD') AS "visitDate", o.note, o.status,
         o.created_at AS "createdAt", o.paid_at AS "paidAt", o.used_at AS "usedAt",
         s.code AS "serviceCode", st.name AS "serviceName"
    FROM orders o JOIN services s ON s.id = o.service_id
    LEFT JOIN service_translations st ON st.service_id = s.id AND st.language_code = 'vi'`;

router.get('/orders', async (req, res) => {
  const status = ['pending', 'paid', 'used', 'cancelled'].includes(req.query.status) ? req.query.status : null;
  const { rows } = await db.query(
    SELECT + ` WHERE ($1::order_status IS NULL OR o.status = $1::order_status)
               ORDER BY (o.status = 'pending') DESC, o.created_at DESC LIMIT 100`, [status]);
  res.json(rows);
});

// Staff đã kiểm tra tiền về -> xác nhận thanh toán
router.post('/orders/:id/confirm-payment', async (req, res) => {
  const { rowCount } = await db.query(
    `UPDATE orders SET status='paid', paid_at=now(), confirmed_by=$2 WHERE id=$1 AND status='pending'`,
    [Number(req.params.id), req.user.id]);
  if (!rowCount) return res.status(409).json({ error: 'Đơn không ở trạng thái chờ thanh toán' });
  res.json({ ok: true });
});

router.post('/orders/:id/cancel', async (req, res) => {
  const { rowCount } = await db.query(
    `UPDATE orders SET status='cancelled' WHERE id=$1 AND status IN ('pending','paid')`, [Number(req.params.id)]);
  if (!rowCount) return res.status(409).json({ error: 'Không thể huỷ đơn này' });
  res.json({ ok: true });
});

// Quét QR: code = "LU:<qr_token>" hoặc mã đơn
router.post('/checkin', async (req, res) => {
  const raw = String(req.body?.code || '').trim();
  if (!raw) return res.status(400).json({ error: 'Thiếu mã' });
  const token = raw.replace(/^LU:/i, '');
  const { rows: [o] } = await db.query(
    SELECT + ` WHERE o.qr_token = $1 OR upper(o.order_code) = upper($1)`, [token]);
  if (!o) return res.json({ result: 'not_found' });
  if (o.status === 'pending') return res.json({ result: 'unpaid', order: o });
  if (o.status === 'cancelled') return res.json({ result: 'cancelled', order: o });
  if (o.status === 'used') return res.json({ result: 'already_used', order: o });
  const { rowCount } = await db.query(
    `UPDATE orders SET status='used', used_at=now(), checked_by=$2 WHERE id=$1 AND status='paid'`, [o.id, req.user.id]);
  if (!rowCount) return res.json({ result: 'already_used', order: o });
  const today = (await db.query(`SELECT to_char((now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date,'YYYY-MM-DD') d`)).rows[0].d;
  res.json({ result: 'ok', order: { ...o, status: 'used', usedAt: new Date().toISOString() }, dateMismatch: o.visitDate !== today });
});

module.exports = router;
