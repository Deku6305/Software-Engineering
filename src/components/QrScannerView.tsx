import React, { useState, useEffect, useRef } from 'react';
import { MonumentPoiData, SupportedLanguage } from '../types/index.ts';
import { TRANSLATIONS } from '../data/translations.ts';
import {
  Camera,
  QrCode,
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Flashlight,
  ArrowRight
} from 'lucide-react';

interface QrScannerViewProps {
  pois: MonumentPoiData[];
  currentLang: SupportedLanguage;
  onScanSuccess: (code: string) => void;
  activeScannedPoi: MonumentPoiData | null;
  onPlayPoiAudio: (poi: MonumentPoiData) => void;
}

export const QrScannerView: React.FC<QrScannerViewProps> = ({
  pois,
  currentLang,
  onScanSuccess,
  activeScannedPoi,
  onPlayPoiAudio,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ truy cập máy ảnh');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or error:', err);
      setCameraError(err.message || 'Không thể mở máy ảnh. Vui lòng cấp quyền.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    // Attempt auto start on mount
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleSimulateScan = (code: string) => {
    // Play subtle audio click/beep
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch (e) {
        // ignore
      }
    }
    onScanSuccess(code);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <QrCode className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.scanner.title}</span>
        </div>
        <h2 className="text-2xl font-bold text-amber-100 font-serif-sacred">
          Quét Mã QR Nhận Diện Di Tích
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          {t.scanner.instruction}
        </p>
      </div>

      {/* Main Scanner Viewport Area */}
      <div className="relative max-w-md mx-auto aspect-square rounded-3xl overflow-hidden bg-stone-950 border-2 border-amber-500/50 shadow-2xl flex items-center justify-center">
        {cameraActive ? (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="p-6 text-center space-y-3 z-10">
            <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-xs text-stone-400">
              {cameraError || 'Camera đang tắt hoặc không khả dụng'}
            </p>
            <button
              onClick={startCamera}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khởi động lại Camera</span>
            </button>
          </div>
        )}

        {/* Viewfinder Target Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
          <div className="relative w-64 h-64 border-2 border-dashed border-amber-400/40 rounded-3xl flex items-center justify-center">
            {/* Viewfinder Corners */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

            {/* Pulsing Scan Laser Line */}
            <div className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-bounce" />

            <div className="absolute bottom-3 text-[10px] text-amber-300 font-mono tracking-wider bg-stone-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
              ĐANG QUÉT MÃ QR...
            </div>
          </div>
        </div>

        {/* Top Floating Controls on Camera */}
        {cameraActive && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE CAMERA
            </span>

            <button
              onClick={() => setTorchOn(!torchOn)}
              className="p-2 rounded-full bg-stone-950/80 text-amber-300 border border-stone-800 hover:bg-stone-900 transition-colors"
              title="Bật đèn flash"
            >
              <Flashlight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Scanned Result Banner if detected */}
      {activeScannedPoi && (
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-stone-900 border border-emerald-500/50 shadow-xl flex items-center justify-between gap-3 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={activeScannedPoi.image}
              alt={activeScannedPoi.name}
              className="w-12 h-12 rounded-xl object-cover border border-emerald-400/50 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Đã quét mã {activeScannedPoi.code}
              </span>
              <h4 className="text-sm font-bold text-amber-100 truncate font-serif-sacred">
                {activeScannedPoi.name}
              </h4>
            </div>
          </div>

          <button
            onClick={() => onPlayPoiAudio(activeScannedPoi)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shrink-0 transition-all"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Nghe ngay</span>
          </button>
        </div>
      )}

      {/* Manual Input Fallback */}
      <div className="max-w-md mx-auto flex gap-2">
        <input
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Nhập mã QR di tích (ví dụ: LU-QUANAM-01)..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 uppercase"
        />
        <button
          onClick={() => {
            if (manualCode.trim()) {
              handleSimulateScan(manualCode.trim());
              setManualCode('');
            }
          }}
          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 font-bold text-xs border border-stone-700 transition-colors"
        >
          Nhập
        </button>
      </div>

      {/* Clickable QR Test Cards for All Monument Spots */}
      <div className="max-w-2xl mx-auto space-y-3 pt-3 border-t border-stone-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5 font-serif-sacred">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {t.scanner.simulatedTitle}
            </h3>
            <p className="text-xs text-stone-400">
              {t.scanner.simulatedDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {pois.map((poi) => (
            <button
              key={poi.id}
              onClick={() => handleSimulateScan(poi.code)}
              className="flex items-center justify-between p-3 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 hover:bg-stone-850 text-left transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-stone-950 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:border-amber-400 transition-colors">
                  <QrCode className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-amber-400 font-mono">
                    {poi.code}
                  </span>
                  <h5 className="text-xs font-semibold text-stone-200 truncate group-hover:text-amber-200">
                    {poi.name}
                  </h5>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
