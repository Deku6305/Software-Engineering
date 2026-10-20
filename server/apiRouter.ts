import { Router, Request, Response } from 'express';
import { poiAudioService } from './poiAudioService.ts';
import { navigationService } from './navigationService.ts';
import { bookingService } from './bookingService.ts';
import { paymentService } from './paymentService.ts';
import { chatAiService } from './chatAiService.ts';
import { metricsService } from './metricsService.ts';
import { cicdService } from './cicdService.ts';
import { ttsService } from './ttsService.ts';
import { eventBus } from './eventBus.ts';

export const apiRouter = Router();

// 1. Healthcheck & System Metrics
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    system: metricsService.getSystemSummary()
  });
});

// Stream native TTS Audio with exact native pronunciation
apiRouter.get('/tts', async (req: Request, res: Response) => {
  try {
    const text = (req.query.text as string) || 'Chùa Linh Ứng Bãi Bụt Sơn Trà';
    const lang = (req.query.lang as string) || 'vi';

    const audioBuf = await ttsService.getAudioBuffer(text, lang);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuf.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(audioBuf);
  } catch (err: any) {
    console.error('Error in /api/tts:', err);
    res.status(500).json({ error: 'Failed to generate TTS audio', message: err.message });
  }
});

apiRouter.get('/system/services', (_req: Request, res: Response) => {
  res.json({
    services: metricsService.getServicesHealth(),
    systemSummary: metricsService.getSystemSummary()
  });
});

apiRouter.get('/system/events', (_req: Request, res: Response) => {
  const limit = parseInt(_req.query.limit as string) || 30;
  res.json({
    events: eventBus.getRecentEvents(limit)
  });
});

// 2. POI & Multilingual Audio Endpoints
apiRouter.get('/pois', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || 'vi';
  const pois = poiAudioService.getAllPois(lang);
  res.json({ pois, total: pois.length, lang });
});

apiRouter.get('/pois/qr/:code', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || 'vi';
  const code = req.params.code;
  const poi = poiAudioService.getPoiByQrCode(code, lang);
  if (!poi) {
    return res.status(404).json({ error: 'POI not found for QR code', code });
  }
  res.json({ poi });
});

apiRouter.get('/pois/:id', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || 'vi';
  const id = req.params.id;
  const poi = poiAudioService.getPoiById(id, lang);
  if (!poi) {
    return res.status(404).json({ error: 'POI not found', id });
  }
  res.json({ poi });
});

apiRouter.get('/qr-registry', (_req: Request, res: Response) => {
  res.json({
    registry: poiAudioService.getRegisteredQrList()
  });
});

// 3. Navigation & Route Guidance Endpoints
apiRouter.get('/navigation/itineraries', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || 'vi';
  const itineraries = navigationService.getSuggestedItineraries(lang);
  res.json({ itineraries });
});

apiRouter.get('/navigation/route', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || 'vi';
  const from = (req.query.from as string) || 'poi_cong_tamquan';
  const to = (req.query.to as string) || 'poi_quanam_67m';
  const route = navigationService.calculateRoute(from, to, lang);
  res.json({ route });
});

// 4. Booking & Tickets Endpoints
apiRouter.get('/tickets', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || 'vi';
  const packages = bookingService.getPackages(lang);
  res.json({ packages });
});

apiRouter.post('/bookings', (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, customerEmail, ticketId, quantity, visitDate, lang } = req.body;
    if (!customerName || !customerPhone || !ticketId || !quantity) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }
    const order = bookingService.createBooking({
      customerName,
      customerPhone,
      customerEmail,
      ticketId,
      quantity: Number(quantity),
      visitDate: visitDate || new Date().toISOString().split('T')[0],
      lang: lang || (req.query.lang as string) || 'vi'
    });
    res.status(201).json({ order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/bookings/:id', (req: Request, res: Response) => {
  const order = bookingService.getBookingById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json({ order });
});

// 5. Payment Gateway Endpoints
apiRouter.post('/payment/initiate', (req: Request, res: Response) => {
  try {
    const { bookingId, amountVnd, channel } = req.body;
    if (!bookingId || !amountVnd || !channel) {
      return res.status(400).json({ error: 'Missing payment fields' });
    }
    const transaction = paymentService.initiatePayment({
      bookingId,
      amountVnd: Number(amountVnd),
      channel
    });
    res.json({ transaction });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/payment/confirm', (req: Request, res: Response) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ error: 'Missing transactionId' });
    }
    const transaction = paymentService.confirmPayment(transactionId);
    const updatedBooking = bookingService.getBookingById(transaction.bookingId);
    res.json({ transaction, booking: updatedBooking });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Gemini Chatbot Endpoint
apiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, lang } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const result = await chatAiService.answerUserQuestion(message, history || [], lang || 'vi');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. CI/CD Operations Endpoints
apiRouter.get('/cicd/pipelines', (_req: Request, res: Response) => {
  res.json({
    pipelines: cicdService.getRecentPipelines()
  });
});

apiRouter.post('/cicd/trigger', (req: Request, res: Response) => {
  const { branch, commitMessage } = req.body;
  const newRun = cicdService.triggerNewPipeline({ branch, commitMessage });
  res.json({ pipeline: newRun });
});

// 8. UC15: Quản lý Điểm Di Tích & Mã QR (Admin Portal)
apiRouter.get('/admin/pois', (_req: Request, res: Response) => {
  const pois = poiAudioService.getAdminPois();
  res.json({ pois, total: pois.length });
});

apiRouter.post('/admin/pois', (req: Request, res: Response) => {
  try {
    const created = poiAudioService.createPoi(req.body);
    res.status(201).json({ poi: created, message: 'Tạo mới điểm di tích thành công' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/pois/:id', (req: Request, res: Response) => {
  try {
    const updated = poiAudioService.updatePoi(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Không tìm thấy di tích' });
    }
    res.json({ poi: updated, message: 'Cập nhật điểm di tích thành công' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/pois/:id', (req: Request, res: Response) => {
  const success = poiAudioService.deletePoi(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Không tìm thấy di tích để xóa' });
  }
  res.json({ success: true, message: 'Đã xóa điểm di tích thành công' });
});

apiRouter.post('/admin/pois/:id/record-scan', (req: Request, res: Response) => {
  const total = poiAudioService.recordQrScan(req.params.id);
  res.json({ success: true, totalScans: total });
});

// 9. UC16: Quản Lý Đơn Đặt Vé & Doanh Thu (Admin Portal)
apiRouter.get('/admin/bookings', (req: Request, res: Response) => {
  const { search, status, ticketId, visitDate } = req.query;
  const orders = bookingService.getAllOrders({
    search: search as string,
    status: status as string,
    ticketId: ticketId as string,
    visitDate: visitDate as string
  });
  res.json({ bookings: orders, total: orders.length });
});

apiRouter.get('/admin/revenue', (_req: Request, res: Response) => {
  const analytics = bookingService.getRevenueAnalytics();
  res.json(analytics);
});

apiRouter.post('/admin/bookings/check-in', (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Mã vé hoặc mã QR không được để trống' });
  }
  const result = bookingService.checkInTicket(code);
  res.json(result);
});

apiRouter.patch('/admin/bookings/:id/status', (req: Request, res: Response) => {
  const { status, paymentMethod } = req.body;
  const updated = bookingService.updateBookingStatus(req.params.id, status, paymentMethod);
  if (!updated) {
    return res.status(404).json({ error: 'Không tìm thấy đơn đặt vé' });
  }
  res.json({ order: updated, message: 'Cập nhật trạng thái vé thành công' });
});

apiRouter.delete('/admin/bookings/:id', (req: Request, res: Response) => {
  const ok = bookingService.deleteBooking(req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'Không tìm thấy đơn đặt vé' });
  }
  res.json({ success: true, message: 'Đã xóa đơn đặt vé thành công' });
});

