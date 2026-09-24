import React, { useState, useEffect } from 'react';
import {
  MonumentPoiData,
  SupportedLanguage
} from './types/index.ts';
import { TRANSLATIONS } from './data/translations.ts';
import { apiClient } from './services/apiClient.ts';
import { useSpeechAudio } from './hooks/useSpeechAudio.ts';
import { Header } from './components/Header.tsx';
import { AudioPlayerBar } from './components/AudioPlayerBar.tsx';
import { PoiListView } from './components/PoiListView.tsx';
import { QrScannerView } from './components/QrScannerView.tsx';
import { InteractiveMapView } from './components/InteractiveMapView.tsx';
import { ArExperienceView } from './components/ArExperienceView.tsx';
import { BookingAndTicketView } from './components/BookingAndTicketView.tsx';
import { ChatBotView } from './components/ChatBotView.tsx';
import {
  Landmark,
  QrCode,
  MapPin,
  Sparkles,
  Ticket,
  Bot
} from 'lucide-react';

type TabKey =
  | 'monuments'
  | 'qrScanner'
  | 'map'
  | 'ar'
  | 'tickets'
  | 'chatAi';

export default function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('vi');
  const [activeTab, setActiveTab] = useState<TabKey>('monuments');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [pois, setPois] = useState<MonumentPoiData[]>([]);
  const [isLoadingPois, setIsLoadingPois] = useState(true);

  // Cross-view navigation context
  const [selectedPoiForModal, setSelectedPoiForModal] = useState<MonumentPoiData | null>(null);
  const [targetNavigationPoi, setTargetNavigationPoi] = useState<MonumentPoiData | null>(null);
  const [activeScannedPoi, setActiveScannedPoi] = useState<MonumentPoiData | null>(null);

  // Web Speech Audio Engine with narration language
  const {
    currentPoi: playingPoi,
    isPlaying: isPlayingAudio,
    playbackSpeed,
    progress: audioProgress,
    currentTimeSec,
    durationSec,
    narrationLang,
    setNarrationLang,
    playPoiAudio,
    stopAudio,
    pauseAudio,
    resumeAudio,
    setSpeed,
    seekTo,
  } = useSpeechAudio(currentLang);

  const t = TRANSLATIONS[currentLang];

  // Load POIs whenever current language changes
  useEffect(() => {
    setIsLoadingPois(true);
    apiClient.getPois(currentLang).then((data) => {
      setPois(data);
      setIsLoadingPois(false);

      // If a modal or playing POI is active, update its localized content
      if (selectedPoiForModal) {
        const updated = data.find((p) => p.id === selectedPoiForModal.id);
        if (updated) setSelectedPoiForModal(updated);
      }
    });
  }, [currentLang]);

  // When global language changes in header, also sync audio narration voice language
  const handleGlobalLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    setNarrationLang(lang);
    if (playingPoi) {
      apiClient.getPois(lang).then((data) => {
        const matching = data.find((p) => p.id === playingPoi.id);
        if (matching) {
          playPoiAudio(matching, undefined, lang);
        }
      });
    }
  };

  // When user specifically chooses narration language in the player or POI card
  const handleNarrationLanguageChange = async (lang: SupportedLanguage) => {
    setNarrationLang(lang);
    if (playingPoi) {
      const localizedPois = await apiClient.getPois(lang);
      const matching = localizedPois.find((p) => p.id === playingPoi.id);
      if (matching) {
        playPoiAudio(matching, undefined, lang);
      }
    }
  };

  // Actions
  const handlePlayPoiAudio = async (poi: MonumentPoiData, explicitLang?: SupportedLanguage) => {
    const targetLang = explicitLang || narrationLang || currentLang;
    if (targetLang !== poi.currentLanguage) {
      // Fetch localized POI text
      const localizedPois = await apiClient.getPois(targetLang);
      const localized = localizedPois.find((p) => p.id === poi.id) || poi;
      playPoiAudio(localized, undefined, targetLang);
      return;
    }

    if (playingPoi?.id === poi.id && isPlayingAudio) {
      pauseAudio();
    } else if (playingPoi?.id === poi.id && !isPlayingAudio) {
      resumeAudio();
    } else {
      playPoiAudio(poi, undefined, targetLang);
    }
  };

  const handleNavigateToPoi = (poi: MonumentPoiData) => {
    setTargetNavigationPoi(poi);
    setActiveTab('map');
  };

  const handleOpenArView = (poi: MonumentPoiData) => {
    setActiveTab('ar');
  };

  const handleScanSuccess = async (code: string) => {
    const matched = await apiClient.getPoiByQr(code, narrationLang || currentLang);
    if (matched) {
      setActiveScannedPoi(matched);
      playPoiAudio(matched, undefined, narrationLang || currentLang);
    } else {
      alert(`Không tìm thấy dữ liệu cho mã QR: ${code}`);
    }
  };

  const handleSpeakArbitraryText = (text: string) => {
    if (pois.length > 0) {
      playPoiAudio(pois[0], text, narrationLang || currentLang);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 0.8];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  // Note: Tab BE & CI/CD is removed from visitor UI as requested, keeping services active in background
  const navTabs: { id: TabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'monuments', label: t.tabs.monuments, icon: Landmark },
    { id: 'qrScanner', label: t.tabs.qrScanner, icon: QrCode },
    { id: 'map', label: t.tabs.map, icon: MapPin },
    { id: 'ar', label: t.tabs.ar, icon: Sparkles },
    { id: 'tickets', label: t.tabs.tickets, icon: Ticket },
    { id: 'chatAi', label: t.tabs.chatAi, icon: Bot },
  ];

  return (
    <div className={`min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans ${isMobileFrame ? 'p-0 sm:py-8 bg-neutral-900' : ''}`}>
      {/* Mobile Device Frame Mockup Container when enabled */}
      <div
        className={`w-full mx-auto flex-1 flex flex-col transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-md sm:h-[880px] sm:rounded-[40px] sm:border-[8px] sm:border-stone-800 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden bg-stone-950 relative sm:ring-1 sm:ring-stone-700'
            : 'max-w-7xl'
        }`}
      >
        {/* Dynamic Island / Speaker notch when on Mobile Frame */}
        {isMobileFrame && (
          <div className="hidden sm:flex justify-center pt-2 pb-1 bg-stone-950 z-50">
            <div className="w-24 h-4 bg-stone-900 rounded-full flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-800" />
              <span className="w-8 h-1 rounded-full bg-stone-800" />
            </div>
          </div>
        )}

        {/* Global Navigation Header */}
        <Header
          currentLang={currentLang}
          onLanguageChange={handleGlobalLanguageChange}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          isPlayingAudio={isPlayingAudio}
          activePoiName={playingPoi?.name}
          onOpenPlayer={() => {
            if (playingPoi) setSelectedPoiForModal(playingPoi);
          }}
        />

        {/* Desktop Tab Switcher Bar (Hidden on narrow screens) */}
        <div className="hidden md:flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-900/60 border-b border-stone-800/80">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold shadow-amber-500/20'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 pb-28 sm:pb-24 overflow-y-auto">
          {isLoadingPois ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <span className="text-4xl animate-bounce">🪷</span>
              <p className="text-xs text-stone-400">
                Đang khởi tạo âm thanh thuyết minh Chùa Linh Ứng...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'monuments' && (
                <PoiListView
                  pois={pois}
                  currentLang={currentLang}
                  narrationLang={narrationLang}
                  onChangeNarrationLang={handleNarrationLanguageChange}
                  onPlayPoiAudio={handlePlayPoiAudio}
                  isPlayingAudio={isPlayingAudio}
                  activePoiId={playingPoi?.id}
                  onNavigateToPoi={handleNavigateToPoi}
                  onOpenArView={handleOpenArView}
                  onTestQrScan={handleScanSuccess}
                  selectedPoiForModal={selectedPoiForModal}
                  onCloseModal={() => setSelectedPoiForModal(null)}
                  onSelectPoiModal={(poi) => setSelectedPoiForModal(poi)}
                />
              )}

              {activeTab === 'qrScanner' && (
                <QrScannerView
                  pois={pois}
                  currentLang={currentLang}
                  onScanSuccess={handleScanSuccess}
                  activeScannedPoi={activeScannedPoi}
                  onPlayPoiAudio={handlePlayPoiAudio}
                />
              )}

              {activeTab === 'map' && (
                <InteractiveMapView
                  pois={pois}
                  currentLang={currentLang}
                  onSelectPoi={(poi) => setSelectedPoiForModal(poi)}
                  onPlayPoiAudio={handlePlayPoiAudio}
                  targetNavigationPoi={targetNavigationPoi}
                />
              )}

              {activeTab === 'ar' && (
                <ArExperienceView
                  pois={pois}
                  currentLang={currentLang}
                  onPlayPoiAudio={handlePlayPoiAudio}
                  selectedArPoi={playingPoi}
                />
              )}

              {activeTab === 'tickets' && (
                <BookingAndTicketView currentLang={currentLang} />
              )}

              {activeTab === 'chatAi' && (
                <ChatBotView
                  currentLang={currentLang}
                  onSpeakText={handleSpeakArbitraryText}
                />
              )}
            </>
          )}
        </main>

        {/* Floating Bottom Audio Player Bar with Language Selector */}
        <AudioPlayerBar
          currentPoi={playingPoi}
          isPlaying={isPlayingAudio}
          progress={audioProgress}
          currentTimeSec={currentTimeSec}
          durationSec={durationSec}
          playbackSpeed={playbackSpeed}
          narrationLang={narrationLang}
          onChangeNarrationLang={handleNarrationLanguageChange}
          onPlayPause={() => {
            if (isPlayingAudio) pauseAudio();
            else resumeAudio();
          }}
          onStop={stopAudio}
          onSeek={seekTo}
          onCycleSpeed={cycleSpeed}
          onOpenDetails={(poi) => setSelectedPoiForModal(poi)}
        />

        {/* Mobile App Bottom Tab Bar (Visible on phones & mobile preview) */}
        <nav className="fixed sm:static bottom-0 left-0 right-0 z-30 bg-stone-950/95 backdrop-blur-lg border-t border-amber-900/40 px-2 py-1.5 flex items-center justify-around sm:hidden">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                  isActive ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <div
                  className={`p-1 rounded-lg ${
                    isActive ? 'bg-amber-500/20 text-amber-300' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] truncate max-w-[56px] leading-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
