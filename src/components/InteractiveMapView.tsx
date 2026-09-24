import React, { useState, useEffect } from 'react';
import {
  MonumentPoiData,
  RouteResult,
  ItineraryData,
  SupportedLanguage
} from '../types/index.ts';
import { TRANSLATIONS } from '../data/translations.ts';
import { apiClient } from '../services/apiClient.ts';
import {
  MapPin,
  Navigation,
  Compass,
  Clock,
  Footprints,
  AlertTriangle,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  Volume2,
  CheckCircle2,
  ShieldCheck,
  LocateFixed
} from 'lucide-react';

interface InteractiveMapViewProps {
  pois: MonumentPoiData[];
  currentLang: SupportedLanguage;
  onSelectPoi: (poi: MonumentPoiData) => void;
  onPlayPoiAudio: (poi: MonumentPoiData) => void;
  targetNavigationPoi?: MonumentPoiData | null;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  pois,
  currentLang,
  onSelectPoi,
  onPlayPoiAudio,
  targetNavigationPoi,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [itineraries, setItineraries] = useState<ItineraryData[]>([]);
  const [activeItinerary, setActiveItinerary] = useState<ItineraryData | null>(null);

  // Routing state
  const [startPoiId, setStartPoiId] = useState<string>('poi_cong_tamquan');
  const [destPoiId, setDestPoiId] = useState<string>(
    targetNavigationPoi ? targetNavigationPoi.id : 'poi_quanam_67m'
  );
  const [currentRoute, setCurrentRoute] = useState<RouteResult | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Simulated User location
  const [userPos, setUserPos] = useState<{ x: number; y: number }>({ x: 28, y: 68 });
  const [activePoiHover, setActivePoiHover] = useState<MonumentPoiData | null>(null);

  useEffect(() => {
    // Fetch suggested itineraries from backend
    apiClient.getItineraries(currentLang).then((res) => {
      setItineraries(res);
    });
  }, [currentLang]);

  useEffect(() => {
    if (targetNavigationPoi) {
      setDestPoiId(targetNavigationPoi.id);
      fetchRoute('poi_cong_tamquan', targetNavigationPoi.id);
    } else {
      fetchRoute(startPoiId, destPoiId);
    }
  }, [targetNavigationPoi]);

  const fetchRoute = async (fromId: string, toId: string) => {
    setIsLoadingRoute(true);
    const route = await apiClient.calculateRoute(fromId, toId, currentLang);
    setCurrentRoute(route);
    setIsLoadingRoute(false);
  };

  const handleStartRouting = () => {
    fetchRoute(startPoiId, destPoiId);
  };

  const handleSelectItinerary = (it: ItineraryData) => {
    if (activeItinerary?.id === it.id) {
      setActiveItinerary(null);
    } else {
      setActiveItinerary(it);
      if (it.poiSequence.length >= 2) {
        setStartPoiId(it.poiSequence[0]);
        setDestPoiId(it.poiSequence[1]);
        fetchRoute(it.poiSequence[0], it.poiSequence[1]);
      }
    }
  };

  // Find destination POI object
  const destinationPoi = pois.find((p) => p.id === destPoiId);
  const startPoi = pois.find((p) => p.id === startPoiId);

  // Compute SVG Path between start and destination
  const getRouteSvgPath = () => {
    if (!startPoi || !destinationPoi) return '';
    const x1 = startPoi.coordinates.mapX * 8; // scale 0-100 to 0-800
    const y1 = startPoi.coordinates.mapY * 5; // scale 0-100 to 0-500
    const x2 = destinationPoi.coordinates.mapX * 8;
    const y2 = destinationPoi.coordinates.mapY * 5;

    // Curved architectural waypoint path
    const midX = (x1 + x2) / 2 + (y2 - y1) * 0.15;
    const midY = (y1 + y2) / 2 - (x2 - x1) * 0.15;

    return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Anti-Lost Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.map.antiLostTitle}</span>
          </div>
          <h2 className="text-xl font-bold text-amber-100 font-serif-sacred">
            {t.map.title}
          </h2>
          <p className="text-xs text-stone-300 max-w-xl">
            {t.map.antiLostDesc}
          </p>
        </div>

        {/* Live GPS simulated status badge */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-stone-950/80 border border-emerald-500/40 text-xs font-medium text-emerald-300 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Đang bám sát vị trí: Vùng an toàn chùa Linh Ứng</span>
        </div>
      </div>

      {/* Suggested Itineraries Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.map.itineraryTitle} (Lựa chọn lộ trình tối ưu)</span>
          </h3>
          <span className="text-[11px] text-stone-400">Chạm để kích hoạt hướng dẫn</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {itineraries.map((it) => {
            const isSelected = activeItinerary?.id === it.id;
            return (
              <button
                key={it.id}
                onClick={() => handleSelectItinerary(it)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/20'
                    : 'bg-stone-900/90 border-stone-800 hover:border-amber-500/40 hover:bg-stone-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-500/30">
                      {it.badge}
                    </span>
                    <span className="text-[11px] text-stone-400 font-medium">
                      ⏱ {it.durationText}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-100 line-clamp-1 font-serif-sacred">
                    {it.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">
                    {it.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-stone-800 text-[11px] text-stone-300">
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3 h-3 text-amber-400" />
                    {it.distanceMeters}m ({it.poiSequence.length} điểm)
                  </span>
                  <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                    {isSelected ? 'Đang đi' : 'Chọn tour'} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Vector SVG Map Canvas */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-950 border-2 border-amber-900/60 shadow-2xl">
        {/* Map Header Toolstrip */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Compass Rose */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950/85 backdrop-blur-md border border-stone-800 text-xs font-semibold text-stone-300 pointer-events-auto">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Bắc Sơn Trà (350° N)</span>
          </div>

          {/* Reset position button */}
          <button
            onClick={() => setUserPos({ x: 28, y: 68 })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950/85 backdrop-blur-md border border-stone-800 hover:border-amber-500/50 text-xs font-medium text-amber-300 pointer-events-auto transition-colors"
            title="Đưa vị trí bạn về Cổng Tam Quan"
          >
            <LocateFixed className="w-3.5 h-3.5" />
            <span>Về điểm xuất phát</span>
          </button>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="relative w-full aspect-[16/10] min-h-[380px] sm:min-h-[460px]">
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full select-none"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Sea ocean gradient */}
              <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0c1926" />
                <stop offset="50%" stopColor="#082f49" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>

              {/* Mountain terrain gradient */}
              <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1c1917" />
                <stop offset="70%" stopColor="#292524" />
                <stop offset="100%" stopColor="#44403c" />
              </linearGradient>

              {/* Paved path gradient */}
              <linearGradient id="pavedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#78716c" />
                <stop offset="100%" stopColor="#a8a29e" />
              </linearGradient>

              {/* Route glow filter */}
              <filter id="glowRoute" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Mountain Contours (Sơn Trà) */}
            <path
              d="M 0 0 L 800 0 L 800 280 Q 600 240 450 260 Q 300 280 180 340 L 0 420 Z"
              fill="url(#mountainGrad)"
            />

            {/* Ocean (Biển Đông / Bãi Bụt Bay) */}
            <path
              d="M 0 420 Q 180 340 300 280 Q 450 260 600 240 Q 700 230 800 280 L 800 500 L 0 500 Z"
              fill="url(#oceanGrad)"
              opacity="0.85"
            />

            {/* Ocean wave ripples */}
            <path
              d="M 200 460 Q 300 440 420 455 Q 560 470 680 440"
              stroke="#38bdf8"
              strokeWidth="1.5"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M 350 480 Q 480 465 600 475"
              stroke="#38bdf8"
              strokeWidth="1.5"
              fill="none"
              opacity="0.25"
            />

            {/* Paved Walkways / Marble Courtyards */}
            {/* Tam quan to 18 La Han */}
            <path
              d="M 200 325 L 304 260 L 384 210"
              stroke="#57534e"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            {/* 18 La Han to Chanh Dien */}
            <path
              d="M 304 260 L 384 210 L 496 190"
              stroke="#57534e"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            {/* Chanh Dien to Lady Buddha 67m */}
            <path
              d="M 384 210 Q 440 200 496 190 L 592 140"
              stroke="#57534e"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lady Buddha to Thap Xa Loi */}
            <path
              d="M 496 190 L 592 140"
              stroke="#57534e"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lady Buddha to Vong Canh coastal overlook */}
            <path
              d="M 496 190 Q 560 230 656 275"
              stroke="#57534e"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            {/* Pathway to Cay Da Ngan Nam */}
            <path
              d="M 592 140 Q 640 100 704 75"
              stroke="#44403c"
              strokeWidth="8"
              strokeDasharray="4 4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Central Pagoda Courtyard Slab */}
            <polygon
              points="340,230 430,180 540,195 440,260"
              fill="#292524"
              stroke="#d97706"
              strokeWidth="1.5"
              opacity="0.8"
            />

            {/* Active Navigation Route Path (Glow Amber Animated) */}
            {currentRoute && (
              <path
                d={getRouteSvgPath()}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="8 6"
                filter="url(#glowRoute)"
                className="animate-pulse"
              />
            )}

            {/* Utility points: Restrooms, Buggy, Water */}
            {/* Buggy Station */}
            <g transform="translate(160, 340)">
              <circle r="12" fill="#065f46" stroke="#10b981" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#ffffff">🚌</text>
              <text x="0" y="24" textAnchor="middle" fontSize="9" fill="#a7f3d0" fontWeight="bold">Xe điện</text>
            </g>

            {/* Restrooms */}
            <g transform="translate(260, 290)">
              <circle r="10" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
              <text x="0" y="3" textAnchor="middle" fontSize="9" fill="#cbd5e1">🚻</text>
            </g>

            {/* Shaded Rest Garden */}
            <g transform="translate(420, 270)">
              <circle r="10" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
              <text x="0" y="3" textAnchor="middle" fontSize="9" fill="#cbd5e1">🍵</text>
            </g>

            {/* Monument POI Markers */}
            {pois.map((poi) => {
              const x = poi.coordinates.mapX * 8;
              const y = poi.coordinates.mapY * 5;
              const isSelectedDest = destPoiId === poi.id;
              const isSelectedStart = startPoiId === poi.id;

              return (
                <g
                  key={poi.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setDestPoiId(poi.id);
                    fetchRoute(startPoiId, poi.id);
                  }}
                  onMouseEnter={() => setActivePoiHover(poi)}
                  onMouseLeave={() => setActivePoiHover(null)}
                >
                  {/* Ping Ring for Selected Destination or 67m Lady Buddha */}
                  {(isSelectedDest || poi.id === 'poi_quanam_67m') && (
                    <circle
                      r="22"
                      fill="none"
                      stroke={isSelectedDest ? '#f59e0b' : '#38bdf8'}
                      strokeWidth="2"
                      className="animate-pulse-ring"
                    />
                  )}

                  {/* Marker Pin Base */}
                  <circle
                    r="15"
                    fill={
                      isSelectedDest
                        ? '#d97706'
                        : isSelectedStart
                        ? '#059669'
                        : '#1c1917'
                    }
                    stroke={isSelectedDest ? '#fef08a' : '#d97706'}
                    strokeWidth="2.5"
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* Icon badge inside */}
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fontSize="13"
                    className="pointer-events-none select-none"
                  >
                    {poi.id === 'poi_quanam_67m'
                      ? '🪷'
                      : poi.category === 'temple'
                      ? '⛩️'
                      : poi.category === 'relic'
                      ? '🏛️'
                      : poi.category === 'nature'
                      ? '🌳'
                      : '🌊'}
                  </text>

                  {/* Name Label Plate */}
                  <rect
                    x="-55"
                    y="20"
                    width="110"
                    height="18"
                    rx="4"
                    fill="#0c0a09"
                    stroke="#44403c"
                    strokeWidth="0.8"
                    opacity="0.9"
                  />
                  <text
                    x="0"
                    y="32"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill={isSelectedDest ? '#fef08a' : '#f5f5f4'}
                    className="pointer-events-none select-none font-sans"
                  >
                    {poi.name.split(' (')[0].substring(0, 16)}
                  </text>
                </g>
              );
            })}

            {/* Draggable/Simulated User GPS Location */}
            <g
              transform={`translate(${userPos.x * 8}, ${userPos.y * 5})`}
              className="cursor-move"
            >
              <circle r="14" fill="#3b82f6" opacity="0.3" className="animate-ping" />
              <circle r="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
              <text x="0" y="-12" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#60a5fa">
                Bạn ở đây
              </text>
            </g>
          </svg>
        </div>

        {/* Map Legend Footer Bar */}
        <div className="p-3 bg-stone-900/90 border-t border-stone-800 text-[11px] text-stone-300 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300" />
              {t.map.legend.poi}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
              {t.map.legend.user}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              {t.map.legend.buggy}
            </span>
            <span className="flex items-center gap-1.5">
              <span>🚻</span> {t.map.legend.restroom}
            </span>
          </div>

          <span className="text-stone-400">
            *Nhấp trực tiếp vào bất kỳ tượng để bắt đầu chỉ đường
          </span>
        </div>
      </div>

      {/* Turn-by-Turn Navigation Details Card */}
      {currentRoute && destinationPoi && (
        <div className="p-5 rounded-2xl bg-stone-900 border border-amber-900/50 space-y-4 shadow-xl">
          {/* Header of Route */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-stone-950">
                  Lộ trình tới {destinationPoi.name}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  {destinationPoi.code}
                </span>
              </div>
              <h3 className="text-base font-bold text-amber-100 mt-1 font-serif-sacred">
                Hướng dẫn di chuyển chống lạc
              </h3>
            </div>

            {/* Quick stats: Distance & Time */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-right">
                <span className="text-[10px] text-stone-400 block">{t.map.distance}</span>
                <span className="text-xs sm:text-sm font-bold text-amber-300">
                  ~{currentRoute.totalDistanceMeters}m
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-right">
                <span className="text-[10px] text-stone-400 block">{t.map.duration}</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">
                  ~{currentRoute.estimatedMinutes} phút đi bộ
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-step turn directions */}
          <div className="space-y-2.5">
            {currentRoute.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="flex items-start gap-3 p-3 rounded-xl bg-stone-950/60 border border-stone-800/80"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/40">
                  {step.stepNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                    {step.instruction}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-stone-400">
                    <span>Khoảng cách: {step.distanceMeters}m</span>
                    <span>•</span>
                    <span>Thời gian: ~{step.estimatedMinutes} phút</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety warning */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/60 flex items-center gap-2.5 text-xs text-amber-200/90">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{currentRoute.safetyNote}</span>
          </div>

          {/* Action to trigger voice narration for this destination */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              onClick={() => onPlayPoiAudio(destinationPoi)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe thuyết minh điểm đến này</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
