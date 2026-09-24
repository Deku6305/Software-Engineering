import React, { useState } from 'react';
import { MonumentPoiData, SupportedLanguage } from '../types/index.ts';
import { TRANSLATIONS } from '../data/translations.ts';
import {
  Volume2,
  Navigation,
  Compass,
  QrCode,
  Search,
  Sparkles,
  Clock,
  Mountain,
  ChevronRight,
  X,
  Play,
  Pause,
  MapPin,
  CheckCircle2,
  Globe
} from 'lucide-react';

interface PoiListViewProps {
  pois: MonumentPoiData[];
  currentLang: SupportedLanguage;
  narrationLang: SupportedLanguage;
  onChangeNarrationLang: (lang: SupportedLanguage) => void;
  onPlayPoiAudio: (poi: MonumentPoiData, explicitLang?: SupportedLanguage) => void;
  isPlayingAudio: boolean;
  activePoiId?: string;
  onNavigateToPoi: (poi: MonumentPoiData) => void;
  onOpenArView: (poi: MonumentPoiData) => void;
  onTestQrScan: (code: string) => void;
  selectedPoiForModal: MonumentPoiData | null;
  onCloseModal: () => void;
  onSelectPoiModal: (poi: MonumentPoiData) => void;
}

const NARRATION_LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const PoiListView: React.FC<PoiListViewProps> = ({
  pois,
  currentLang,
  narrationLang,
  onChangeNarrationLang,
  onPlayPoiAudio,
  isPlayingAudio,
  activePoiId,
  onNavigateToPoi,
  onOpenArView,
  onTestQrScan,
  selectedPoiForModal,
  onCloseModal,
  onSelectPoiModal
}) => {
  const t = TRANSLATIONS[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPois = pois.filter((poi) => {
    const matchesSearch =
      poi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poi.brief.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poi.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || poi.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: currentLang === 'vi' ? 'Tất cả' : 'All' },
    { id: 'monument', label: currentLang === 'vi' ? 'Tượng đài' : 'Monuments' },
    { id: 'temple', label: currentLang === 'vi' ? 'Điện thờ' : 'Sanctuaries' },
    { id: 'relic', label: currentLang === 'vi' ? 'Xá lợi' : 'Stupas' },
    { id: 'viewpoint', label: currentLang === 'vi' ? 'Vọng cảnh' : 'Viewpoints' },
    { id: 'nature', label: currentLang === 'vi' ? 'Thiên nhiên' : 'Nature' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/60 via-stone-900 to-stone-950 border border-amber-900/40 p-5 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chùa Linh Ứng Bãi Bụt • Bán đảo Sơn Trà</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100 tracking-tight font-serif-sacred">
            Hệ Thống Thuyết Minh Di Tích
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed">
            Khám phá 9 điểm di tích linh thiêng bằng giọng đọc thuyết minh đa ngôn ngữ tự động (tùy chọn 6 thứ tiếng), quét mã QR tại hiện trường và trải nghiệm không gian AR sống động.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên tượng Phật, mã QR, lịch sử..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 focus:border-amber-500/60 focus:outline-none text-xs sm:text-sm text-stone-200 placeholder:text-stone-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-stone-900 text-stone-400 border border-stone-800 hover:border-stone-700 hover:text-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Monument Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredPois.map((poi) => {
          const isThisActive = activePoiId === poi.id;
          return (
            <div
              key={poi.id}
              className={`group rounded-2xl overflow-hidden bg-stone-900/90 border transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/20 ${
                isThisActive
                  ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                  : 'border-stone-800/80 hover:border-amber-500/40'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-stone-950">
                <img
                  src={poi.image}
                  alt={poi.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {/* QR Code Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/80 backdrop-blur-md border border-amber-500/40 text-[11px] font-bold text-amber-300">
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>{poi.code}</span>
                </div>

                {/* Duration & Elevation */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-stone-950/80 backdrop-blur-md text-[11px] text-stone-300 border border-stone-800">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{Math.round(poi.audioDurationSeconds / 60)} phút</span>
                </div>

                {/* Title and Tagline on Image bottom */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-bold text-amber-100 line-clamp-1 group-hover:text-amber-300 transition-colors font-serif-sacred">
                    {poi.name}
                  </h3>
                  <p className="text-xs text-amber-400/90 line-clamp-1">
                    {poi.titleTag}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {poi.brief}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-stone-400 pt-1 border-t border-stone-800/60">
                  <span className="flex items-center gap-1">
                    <Mountain className="w-3 h-3 text-amber-400" />
                    Độ cao {poi.coordinates.elevationMeters}m
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-amber-400" />
                    Hướng {poi.coordinates.compassBearing}°
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Play Audio Button */}
                  <button
                    onClick={() => onPlayPoiAudio(poi)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isThisActive && isPlayingAudio
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    }`}
                  >
                    {isThisActive && isPlayingAudio ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Tạm dừng</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe thuyết minh</span>
                      </>
                    )}
                  </button>

                  {/* View Details Button */}
                  <button
                    onClick={() => onSelectPoiModal(poi)}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700/80 hover:border-stone-600 transition-colors"
                  >
                    <span>Chi tiết</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POI Full Detail Modal */}
      {selectedPoiForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-stone-900 border border-amber-900/60 rounded-3xl shadow-2xl overflow-y-auto flex flex-col">
            {/* Header Image */}
            <div className="relative h-60 w-full shrink-0 overflow-hidden">
              <img
                src={selectedPoiForModal.image}
                alt={selectedPoiForModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />

              {/* Close Button */}
              <button
                onClick={onCloseModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/80 text-stone-300 hover:text-white border border-stone-800 hover:scale-105 transition-all"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Badges */}
              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-stone-950">
                    {selectedPoiForModal.code}
                  </span>
                  <span className="text-xs text-amber-300 font-medium">
                    {selectedPoiForModal.titleTag}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-amber-100 font-serif-sacred">
                  {selectedPoiForModal.name}
                </h2>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-7 space-y-6 flex-1 text-stone-200">
              {/* Play Audio Callout Banner with Dedicated Voice Language Selector */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-200">
                        Thuyết Minh Giọng Nói Tự Động
                      </h4>
                      <p className="text-xs text-stone-400">
                        Thời lượng ~{Math.round(selectedPoiForModal.audioDurationSeconds / 60)} phút • Chọn ngôn ngữ nghe bên dưới
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onPlayPoiAudio(selectedPoiForModal, narrationLang)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/30 transition-all shrink-0"
                  >
                    {activePoiId === selectedPoiForModal.id && isPlayingAudio ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Tạm dừng</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Nghe ngay</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Explicit Narration Language Selection Chips */}
                <div className="pt-2 border-t border-amber-500/20">
                  <div className="text-[11px] font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>Chọn ngôn ngữ phát giọng đọc thuyết minh:</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {NARRATION_LANGUAGES.map((lang) => {
                      const isSelected = narrationLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onChangeNarrationLang(lang.code);
                            onPlayPoiAudio(selectedPoiForModal, lang.code);
                          }}
                          className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs transition-all border ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md'
                              : 'bg-stone-950/80 text-stone-300 border-stone-800 hover:border-amber-500/40 hover:bg-stone-850'
                          }`}
                        >
                          <span>{lang.flag}</span>
                          <span className="text-[11px] truncate">{lang.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Lịch sử & Nguồn gốc */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Lịch Sử & Quá Trình Xây Dựng
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {selectedPoiForModal.fullHistory}
                </p>
              </div>

              {/* Ý nghĩa tâm linh */}
              <div className="space-y-2 p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  🪷 Ý Nghĩa Tâm Linh & Hạnh Nguyện
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed italic">
                  "{selectedPoiForModal.spiritualMeaning}"
                </p>
              </div>

              {/* Điểm nhấn kiến trúc */}
              {selectedPoiForModal.architecturalHighlights?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                    Đặc Điểm Kiến Trúc Điêu Khắc
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedPoiForModal.architecturalHighlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/80 text-xs text-stone-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lưu ý khi viếng thăm */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-300 block mb-1">💡 Lời khuyên cho du khách:</strong>
                {selectedPoiForModal.visitingTips}
              </div>

              {/* Bottom Quick Navigation Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  onClick={() => {
                    onCloseModal();
                    onNavigateToPoi(selectedPoiForModal);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Dẫn đường đến đây</span>
                </button>

                <button
                  onClick={() => {
                    onCloseModal();
                    onOpenArView(selectedPoiForModal);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>Xem qua AR 3D</span>
                </button>

                <button
                  onClick={() => {
                    onCloseModal();
                    onTestQrScan(selectedPoiForModal.code);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs border border-stone-700 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Thử mã QR này</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
