import React from 'react';
import { SupportedLanguage } from '../types/index.ts';
import { TRANSLATIONS } from '../data/translations.ts';
import { Globe, Volume2, Smartphone, Monitor, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  isPlayingAudio: boolean;
  activePoiName?: string;
  onOpenPlayer: () => void;
}

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isMobileFrame,
  onToggleMobileFrame,
  isPlayingAudio,
  activePoiName,
  onOpenPlayer
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-amber-900/40 text-stone-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center border border-amber-400/40">
              <span className="text-xl select-none">🪷</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-amber-100 truncate font-serif-sacred">
                {t.appName}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-2.5 h-2.5" /> Sơn Trà
              </span>
            </div>
            <p className="text-xs text-stone-400 truncate hidden xs:block">
              {t.appSubtitle} • Đà Nẵng
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Audio playing mini chip */}
          {isPlayingAudio && (
            <button
              onClick={onOpenPlayer}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium animate-pulse hover:bg-amber-500/30 transition-colors"
              title="Mở thanh thuyết minh âm thanh"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="max-w-[100px] truncate hidden md:inline">{activePoiName || 'Audio'}</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-xs font-medium text-stone-200 transition-all"
              aria-label="Chọn ngôn ngữ"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{LANGUAGES.find(l => l.code === currentLang)?.flag}</span>
              <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === currentLang)?.label}</span>
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    currentLang === lang.code
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-stone-300 hover:bg-stone-800/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  {currentLang === lang.code && <span className="text-amber-400">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile frame preview toggle */}
          <button
            onClick={onToggleMobileFrame}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 text-xs text-stone-300 hover:text-stone-100 transition-colors"
            title={isMobileFrame ? 'Chuyển sang xem toàn màn hình' : 'Chuyển sang khung điện thoại'}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Toàn màn hình</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Khung điện thoại</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
