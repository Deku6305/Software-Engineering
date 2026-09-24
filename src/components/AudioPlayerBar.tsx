import React, { useState } from 'react';
import { MonumentPoiData, SupportedLanguage } from '../types/index.ts';
import { Play, Pause, Square, Volume2, Info, Globe, ChevronUp } from 'lucide-react';

interface AudioPlayerBarProps {
  currentPoi: MonumentPoiData | null;
  isPlaying: boolean;
  progress: number;
  currentTimeSec: number;
  durationSec: number;
  playbackSpeed: number;
  narrationLang: SupportedLanguage;
  onChangeNarrationLang: (lang: SupportedLanguage) => void;
  onPlayPause: () => void;
  onStop: () => void;
  onSeek: (percent: number) => void;
  onCycleSpeed: () => void;
  onOpenDetails: (poi: MonumentPoiData) => void;
}

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentPoi,
  isPlaying,
  progress,
  currentTimeSec,
  durationSec,
  playbackSpeed,
  narrationLang,
  onChangeNarrationLang,
  onPlayPause,
  onStop,
  onSeek,
  onCycleSpeed,
  onOpenDetails,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  if (!currentPoi) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === narrationLang) || LANGUAGES[0];

  return (
    <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-xl border-t border-amber-900/50 shadow-2xl transition-all">
      {/* Visual seek progress bar */}
      <div
        className="w-full h-1.5 bg-stone-800 cursor-pointer relative group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
          onSeek(pct);
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 relative transition-all"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-200 rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2.5 text-stone-100 relative">
        {/* Left: Monument Info */}
        <div
          className="flex items-center gap-3 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onOpenDetails(currentPoi)}
        >
          <img
            src={currentPoi.image}
            alt={currentPoi.name}
            className="w-11 h-11 rounded-lg object-cover border border-amber-500/40 shadow-md shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 relative">
                {isPlaying && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <h4 className="text-xs sm:text-sm font-semibold text-amber-100 truncate">
                {currentPoi.name}
              </h4>
            </div>
            <p className="text-[11px] text-stone-400 truncate">
              {formatTime(currentTimeSec)} / {formatTime(durationSec)} • Giọng đọc: {currentLangObj.flag} {currentLangObj.label}
            </p>
          </div>
        </div>

        {/* Center/Right: Playback & Language Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Narration Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-xs font-semibold text-amber-300 transition-all shadow-sm"
              title="Chọn ngôn ngữ giọng đọc thuyết minh"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLangObj.flag}</span>
              <span className="hidden md:inline text-[11px]">{currentLangObj.label}</span>
              <ChevronUp className={`w-3 h-3 text-stone-400 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Popover Menu */}
            {showLangMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-stone-900 border border-amber-900/60 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800 mb-1">
                  Chọn Ngôn Ngữ Thuyết Minh
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onChangeNarrationLang(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      narrationLang === lang.code
                        ? 'bg-amber-500/25 text-amber-300 font-bold'
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {narrationLang === lang.code && <span className="text-amber-400 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Speed Toggle */}
          <button
            onClick={onCycleSpeed}
            className="px-2 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] font-bold text-amber-400 hover:border-amber-500/50 transition-colors"
            title="Đổi tốc độ đọc"
          >
            {playbackSpeed}x
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={onPlayPause}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát thuyết minh'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Stop / Close Button */}
          <button
            onClick={onStop}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 hover:border-stone-700 transition-colors"
            title="Dừng thuyết minh"
          >
            <Square className="w-4 h-4" />
          </button>

          {/* Info Modal Button */}
          <button
            onClick={() => onOpenDetails(currentPoi)}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-amber-400 hover:bg-stone-800 transition-colors hidden xs:block"
            title="Xem chi tiết thuyết minh"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
