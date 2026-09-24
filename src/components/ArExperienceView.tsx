import React, { useState, useEffect, useRef } from 'react';
import { MonumentPoiData, SupportedLanguage } from '../types/index.ts';
import { TRANSLATIONS } from '../data/translations.ts';
import {
  Compass,
  Sparkles,
  Camera,
  Layers,
  Volume2,
  RefreshCw,
  Sun,
  Eye,
  Sliders,
  RotateCcw,
  RotateCw
} from 'lucide-react';

interface ArExperienceViewProps {
  pois: MonumentPoiData[];
  currentLang: SupportedLanguage;
  onPlayPoiAudio: (poi: MonumentPoiData) => void;
  selectedArPoi?: MonumentPoiData | null;
}

export const ArExperienceView: React.FC<ArExperienceViewProps> = ({
  pois,
  currentLang,
  onPlayPoiAudio,
  selectedArPoi,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Compass and simulated orientation
  const [bearingHeading, setBearingHeading] = useState(85); // 85 deg facing Lady Buddha
  const [pitchAngle, setPitchAngle] = useState(10); // looking up slightly
  const [showLotusHalo, setShowLotusHalo] = useState(true);
  const [showBlessingParticles, setShowBlessingParticles] = useState(true);
  const [timeTravelYear, setTimeTravelYear] = useState<number>(2026); // 2004 vs 2010 vs 2026

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraEnabled(true);
    } catch (err: any) {
      console.warn('AR camera access failed:', err);
      setCameraError('Chế độ giả lập 3D không gian ảo đã được kích hoạt.');
      setCameraEnabled(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraEnabled(false);
  };

  useEffect(() => {
    startCamera();

    // Listen to real device orientation if on physical phone
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setBearingHeading(Math.round(e.alpha));
      }
      if (e.beta !== null) {
        setPitchAngle(Math.round(e.beta));
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      stopCamera();
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const ladyBuddhaPoi = pois.find((p) => p.id === 'poi_quanam_67m') || pois[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{t.ar.title}</span>
        </div>
        <h2 className="text-2xl font-bold text-amber-100 font-serif-sacred">
          Không Gian Linh Thiêng Tăng Cường (AR)
        </h2>
        <p className="text-xs sm:text-sm text-stone-300">
          {t.ar.subtitle}
        </p>
      </div>

      {/* Main AR Viewport */}
      <div className="relative w-full max-w-3xl mx-auto aspect-[16/10] min-h-[420px] rounded-3xl overflow-hidden bg-stone-950 border-2 border-amber-500/50 shadow-2xl flex items-center justify-center select-none">
        {/* Real Camera stream or Fallback 3D backdrop */}
        {cameraEnabled ? (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1600&q=80')`,
              filter: timeTravelYear === 2004 ? 'sepia(0.8) contrast(1.2)' : 'none',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/60" />
          </div>
        )}

        {/* Lotus Petal Blessing Rain Particles */}
        {showBlessingParticles && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute text-xl animate-float opacity-75"
                style={{
                  left: `${(i * 9 + 5) % 95}%`,
                  top: `${(i * 13 + 10) % 85}%`,
                  animationDuration: `${3.5 + (i % 4)}s`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                🪷
              </span>
            ))}
          </div>
        )}

        {/* Radiant Lotus Halo effect superimposed on Lady Buddha */}
        {showLotusHalo && (
          <div className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
            {/* Radiant Pulsing Rings */}
            <div className="w-52 h-52 rounded-full border-2 border-amber-400/60 animate-ping opacity-60" />
            <div className="absolute w-44 h-44 rounded-full border-2 border-yellow-300/80 shadow-[0_0_50px_#f59e0b] animate-spin-slow" />
            <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-300/30 blur-md" />
            <span className="absolute text-4xl select-none animate-pulse">☸</span>
          </div>
        )}

        {/* AR Floating POI Pins over Viewport */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between z-20 pointer-events-none">
          {/* Top HUD: Compass Heading & Mode info */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-950/85 backdrop-blur-md border border-amber-500/40 text-xs font-mono text-amber-300">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>
                {bearingHeading}° {bearingHeading >= 45 && bearingHeading <= 135 ? 'ĐÔNG (East Sea)' : 'BẮC (Sơn Trà)'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className="px-3 py-1.5 rounded-xl bg-stone-950/85 backdrop-blur-md border border-stone-800 hover:border-amber-500/50 text-xs text-stone-200 font-medium transition-colors"
              >
                {cameraEnabled ? 'Tắt Camera' : 'Bật Camera Thật'}
              </button>
            </div>
          </div>

          {/* Center: Spatial Pin for Lady Buddha 67m */}
          <div className="flex flex-col items-center justify-center pointer-events-auto my-auto">
            <div className="p-3.5 rounded-2xl bg-stone-950/90 backdrop-blur-xl border-2 border-amber-400/80 shadow-2xl text-center space-y-1.5 max-w-xs animate-float">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                <span>LU-QUANAM-01</span>
                <span>• 67M</span>
              </div>
              <h4 className="text-sm font-bold text-amber-100 font-serif-sacred">
                {ladyBuddhaPoi.name}
              </h4>
              <p className="text-[11px] text-stone-300">
                {t.ar.distanceAway}: <strong className="text-amber-400">45 mét</strong> (Độ dốc +15m)
              </p>

              <button
                onClick={() => onPlayPoiAudio(ladyBuddhaPoi)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all mt-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe Thuyết Minh AR</span>
              </button>
            </div>
          </div>

          {/* Bottom HUD: Gyro Adjuster & Rotation Controls */}
          <div className="flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-1 bg-stone-950/85 backdrop-blur-md p-1 rounded-xl border border-stone-800">
              <button
                onClick={() => setBearingHeading((prev) => (prev - 15 + 360) % 360)}
                className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-amber-300 transition-colors"
                title="Xoay trái 15°"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-stone-400 px-1.5">
                {bearingHeading}°
              </span>
              <button
                onClick={() => setBearingHeading((prev) => (prev + 15) % 360)}
                className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-amber-300 transition-colors"
                title="Xoay phải 15°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLotusHalo(!showLotusHalo)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  showLotusHalo
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-stone-900 text-stone-400 border-stone-800'
                }`}
              >
                Hào Quang Sen
              </button>

              <button
                onClick={() => setShowBlessingParticles(!showBlessingParticles)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  showBlessingParticles
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                    : 'bg-stone-900 text-stone-400 border-stone-800'
                }`}
              >
                Mưa Hoa Sen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Reconstruction Timeline Slider */}
      <div className="max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-amber-200 font-serif-sacred">
              {t.ar.historicalSlider} (Tái Hiện Không Gian Lịch Sử)
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
            Năm {timeTravelYear}
          </span>
        </div>

        <input
          type="range"
          min="2004"
          max="2026"
          step="1"
          value={timeTravelYear}
          onChange={(e) => setTimeTravelYear(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
        />

        <div className="flex items-center justify-between text-[11px] text-stone-400">
          <span>2004: Khởi công đặt đá</span>
          <span>2010: Khánh thành tượng 67m</span>
          <span>Hiện tại: Quần thể hoàn mỹ</span>
        </div>

        <p className="text-xs text-stone-300 bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 leading-relaxed">
          {timeTravelYear < 2008 ? (
            <span>
              <strong>Giai đoạn 2004:</strong> Vùng đồi núi hoang sơ Bãi Bụt bắt đầu khởi công. Hàng vạn khối đá cẩm thạch trắng được vận chuyển từ làng Non Nước về dưới sự chỉ đạo của Cố Thượng tọa Thích Thiện Nguyện.
            </span>
          ) : timeTravelYear <= 2012 ? (
            <span>
              <strong>Giai đoạn 2010:</strong> Đại lễ khánh thành tôn tượng Phật Bà Quan Thế Âm 67m và Chánh Điện. Hàng vạn tăng ni Phật tử và khách quốc tế chiêm bái hào quang trên biển.
            </span>
          ) : (
            <span>
              <strong>Hiện tại ({timeTravelYear}):</strong> Biểu tượng tâm linh hàng đầu miền Trung, che chở sóng gió cho ngư dân Đà Nẵng và đón hàng triệu du khách chiêm bái.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
