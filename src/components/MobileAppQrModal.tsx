import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  Compass,
  Volume2
} from 'lucide-react';

interface MobileAppQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoute?: 'visitor' | 'admin';
}

export const MobileAppQrModal: React.FC<MobileAppQrModalProps> = ({
  isOpen,
  onClose,
  initialRoute = 'visitor'
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'visitor' | 'admin'>(initialRoute);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Compute live full URL for mobile scanning
  const getTargetUrl = () => {
    if (typeof window === 'undefined') return 'http://localhost:3000';
    const origin = window.location.origin;
    return selectedTarget === 'admin' ? `${origin}/admin` : `${origin}/`;
  };

  const targetUrl = getTargetUrl();

  // Generate QR Code image when target changes
  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate App QR code:', err));
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_CHUA_LINH_UNG_${selectedTarget.toUpperCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 text-sm p-1.5 rounded-lg bg-stone-950/60 hover:bg-stone-800 transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Quét Mã Trải Nghiệm Trên Điện Thoại</span>
          </div>
          <h3 className="text-lg font-bold font-serif-sacred text-stone-100">
            Mở Ứng Dụng Chùa Linh Ứng
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
            Dùng Camera điện thoại, Zalo hoặc Google Lens quét mã dưới đây để mở ngay ứng dụng trên di động.
          </p>
        </div>

        {/* Target Route Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800 mb-4">
          <button
            onClick={() => setSelectedTarget('visitor')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${selectedTarget === 'visitor'
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
              }`}
          >
            <span>🪷 Khách Tham Quan</span>
          </button>

          <button
            onClick={() => setSelectedTarget('admin')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${selectedTarget === 'admin'
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
              }`}
          >
            <span>🛡️ Quản Trị Viên</span>
          </button>
        </div>

        {/* QR Code Presentation Box */}
        <div className="bg-white text-stone-950 p-5 rounded-2xl border-4 border-amber-500 shadow-xl flex flex-col items-center justify-center mx-auto my-1">
          <div className="text-center mb-2">
            <span className="text-lg select-none">🪷</span>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
              CHÙA LINH ỨNG SƠN TRÀ · ĐÀ NẴNG
            </div>
            <div className="text-xs font-bold text-stone-900">
              {selectedTarget === 'visitor' ? 'Thuyết Minh & Hướng Dẫn Số' : 'Cổng Quản Trị Hệ Thống (Admin)'}
            </div>
          </div>

          {/* QR Image */}
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Mã QR mở ứng dụng trên điện thoại"
              className="w-48 h-48 rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-48 h-48 bg-stone-100 flex items-center justify-center text-xs text-stone-500">
              Đang tạo mã QR...
            </div>
          )}

          <div className="mt-2 text-center text-[10px] text-stone-600 font-medium">
            Quét bằng Camera iPhone / Android / Zalo
          </div>
        </div>

        {/* Highlights on Mobile */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-stone-300 text-center">
          <div className="bg-stone-950/80 p-2 rounded-lg border border-stone-800">
            <Compass className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
            <span>Định vị GPS</span>
          </div>
          <div className="bg-stone-950/80 p-2 rounded-lg border border-stone-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
            <span>Camera AR</span>
          </div>
          <div className="bg-stone-950/80 p-2 rounded-lg border border-stone-800">
            <Volume2 className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
            <span>Thuyết minh TTS</span>
          </div>
        </div>

        {/* Live URL Link bar */}
        <div className="mt-3 flex items-center justify-between gap-2 p-2 bg-stone-950 rounded-lg border border-stone-800 text-xs">
          <span className="text-stone-400 truncate font-mono text-[11px] select-all">
            {targetUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[11px] font-medium transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
          </button>
        </div>

        {/* Modal Actions */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-800">
          <button
            onClick={handleDownloadQr}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium transition-colors border border-stone-700"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Tải Ảnh QR</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
