import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import { apiRouter } from './server/apiRouter.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', apiRouter);

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // In development mode, mount Vite middleware for instant HMR / preview
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built dist files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Linh Ung Backend] Server running at http://0.0.0.0:${PORT} in ${isProduction ? 'production' : 'development'} mode`);

    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    QRCode.toString(appUrl, { type: 'terminal', small: true }, (err, qrText) => {
      if (!err && qrText) {
        console.log('\n📱 [QUÉT MÃ QR DƯỚI ĐÂY ĐỂ MỞ APP TRÊN ĐIỆN THOẠI]:');
        console.log(qrText);
        console.log(`🔗 Link: ${appUrl}\n`);
      }
    });
  });
}

startServer().catch((err) => {
  console.error('[Linh Ung Backend] Failed to start server:', err);
  process.exit(1);
});
