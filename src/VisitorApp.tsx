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
import { MobileAppQrModal } from './components/MobileAppQrModal.tsx';
import {
  Landmark,
  QrCode,
  MapPin,
  Sparkles,
  Ticket,
  Bot,
  ShieldCheck
} from 'lucide-react';

type VisitorTabKey =
  | 'monuments'
  | 'qrScanner'
  | 'map'
  | 'ar'
  | 'tickets'
  | 'chatAi';

interface VisitorAppProps {
  onNavigateToAdmin: () => void;
}

export const VisitorApp: React.FC<VisitorAppProps> = ({ onNavigateToAdmin }) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('vi');
  const [activeTab, setActiveTab] = useState<VisitorTabKey>('monuments');
  const [pois, setPois] = useState<MonumentPoiData[]>([]);
  const [isLoadingPois, setIsLoadingPois] = useState(true);

  // Cross-view navigation context
  const [selectedPoiForModal, setSelectedPoiForModal] = useState<MonumentPoiData | null>(null);
  const [targetNavigationPoi, setTargetNavigationPoi] = useState<MonumentPoiData | null>(null);
  const [activeScannedPoi, setActiveScannedPoi] = useState<MonumentPoiData | null>(null);
  const [isMobileQrOpen, setIsMobileQrOpen] = useState<boolean>(false);

  // Web Speech Audio Engine with narration language
  const {
    currentPoi: playingPoi,
    setCurrentPoi: setPlayingPoi,
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

      if (selectedPoiForModal) {
        const updated = data.find((p) => p.id === selectedPoiForModal.id);
        if (updated) setSelectedPoiForModal(updated);
      }
      if (activeScannedPoi) {
        const updatedScanned = data.find((p) => p.id === activeScannedPoi.id);
        if (updatedScanned) setActiveScannedPoi(updatedScanned);
      }
      if (targetNavigationPoi) {
        const updatedTarget = data.find((p) => p.id === targetNavigationPoi.id);
        if (updatedTarget) setTargetNavigationPoi(updatedTarget);
      }
      if (playingPoi) {
        const updatedPlaying = data.find((p) => p.id === playingPoi.id);
        if (updatedPlaying) setPlayingPoi(updatedPlaying);
      }
    });
  }, [currentLang]);

  // Handle global language change
  const handleGlobalLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    setNarrationLang(lang);
    if (playingPoi) {
      apiClient.getPois(lang).then((data) => {
        const matching = data.find((p) => p.id === playingPoi.id);
        if (matching) {
          if (isPlayingAudio) {
            playPoiAudio(matching, undefined, lang);
          } else {
            setPlayingPoi(matching);
          }
        }
      });
    }
  };

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

  const handlePlayPoiAudio = async (poi: MonumentPoiData, explicitLang?: SupportedLanguage) => {
    const targetLang = explicitLang || narrationLang || currentLang;
    if (targetLang !== poi.currentLanguage) {
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

  const handleOpenArView = (_poi: MonumentPoiData) => {
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

  const navTabs: { id: VisitorTabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'monuments', label: t.tabs.monuments, icon: Landmark },
    { id: 'qrScanner', label: t.tabs.qrScanner, icon: QrCode },
    { id: 'map', label: t.tabs.map, icon: MapPin },
    { id: 'ar', label: t.tabs.ar, icon: Sparkles },
    { id: 'tickets', label: t.tabs.tickets, icon: Ticket },
    { id: 'chatAi', label: t.tabs.chatAi, icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <div className="w-full mx-auto flex-1 flex flex-col max-w-7xl">
        {/* Global Navigation Header */}
        <Header
          currentLang={currentLang}
          onLanguageChange={handleGlobalLanguageChange}
          isPlayingAudio={isPlayingAudio}
          activePoiName={playingPoi?.name}
          onOpenPlayer={() => {
            if (playingPoi) setSelectedPoiForModal(playingPoi);
          }}
          isAdminActive={false}
          onToggleAdmin={onNavigateToAdmin}
          onOpenMobileQr={() => setIsMobileQrOpen(true)}
        />

        {/* Desktop Tab Switcher Bar */}
        <div className="hidden md:flex items-center justify-between px-4 py-2 bg-stone-900/60 border-b border-stone-800/80">
          <div className="flex items-center gap-1.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive
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

          <div className="flex items-center gap-2">
            {/* Quick Button to open Phone QR Code */}
            <button
              onClick={() => setIsMobileQrOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-xs font-medium text-stone-300 hover:text-amber-400 hover:bg-stone-850 transition-colors"
              title="Quét mã QR để mở app trên điện thoại di động"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>📱 Quét Mở Trên ĐT</span>
            </button>

            {/* Quick link button to Admin page */}
            <button
              onClick={onNavigateToAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-xs font-medium text-amber-300 hover:bg-stone-850 transition-colors"
              title="Chuyển sang trang Quản Trị Viên (UC15 & UC16)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Trang Quản Trị (Admin) →</span>
            </button>
          </div>
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
                  targetNavigationPoi={targetNavigationPoi}
                  onPlayPoiAudio={handlePlayPoiAudio}
                  onSelectPoi={(poi) => setSelectedPoiForModal(poi)}
                />
              )}

              {activeTab === 'ar' && (
                <ArExperienceView
                  pois={pois}
                  currentLang={currentLang}
                  onPlayPoiAudio={handlePlayPoiAudio}
                  selectedArPoi={selectedPoiForModal}
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

        {/* Floating Bottom Audio Player Bar */}
        <AudioPlayerBar
          currentPoi={playingPoi}
          currentLang={currentLang}
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

        {/* Mobile App Bottom Tab Bar */}
        <nav className="fixed sm:static bottom-0 left-0 right-0 z-30 bg-stone-950/95 backdrop-blur-lg border-t border-amber-900/40 px-2 py-1.5 flex items-center justify-around sm:hidden">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${isActive ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
              >
                <div
                  className={`p-1 rounded-lg ${isActive ? 'bg-amber-500/20 text-amber-300' : ''
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

        {/* Modal to scan QR code on mobile phone */}
        <MobileAppQrModal
          isOpen={isMobileQrOpen}
          onClose={() => setIsMobileQrOpen(false)}
          initialRoute="visitor"
        />
      </div>
    </div>
  );
};
