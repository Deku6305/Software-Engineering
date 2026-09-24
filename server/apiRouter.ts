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
    const { customerName, customerPhone, customerEmail, ticketId, quantity, visitDate } = req.body;
    if (!customerName || !customerPhone || !ticketId || !quantity) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }
    const order = bookingService.createBooking({
      customerName,
      customerPhone,
      customerEmail,
      ticketId,
      quantity: Number(quantity),
      visitDate: visitDate || new Date().toISOString().split('T')[0]
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
