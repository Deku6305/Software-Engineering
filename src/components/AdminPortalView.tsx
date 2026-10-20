import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  AdminPoiData,
  BookingOrderData,
  RevenueAnalyticsData,
  SupportedLanguage
} from '../types/index.ts';
import { apiClient } from '../services/apiClient.ts';
import {
  Landmark,
  QrCode,
  DollarSign,
  TrendingUp,
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Copy,
  ExternalLink,
  Edit2,
  Trash2,
  Check,
  RefreshCw,
  Eye,
  AlertTriangle,
  UserCheck,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface AdminPortalViewProps {
  currentLang: SupportedLanguage;
  onNavigateToPoiDetail?: (poiId: string) => void;
  onSimulateScanCode?: (qrCode: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  currentLang,
  onNavigateToPoiDetail,
  onSimulateScanCode
}) => {
  // Navigation subtabs for Admin
  const [adminTab, setAdminTab] = useState<'monuments_qr' | 'revenue_bookings'>('revenue_bookings');

  // UC15: POI & QR State
  const [pois, setPois] = useState<AdminPoiData[]>([]);
  const [isLoadingPois, setIsLoadingPois] = useState(true);
  const [poiSearch, setPoiSearch] = useState('');
  const [poiCategoryFilter, setPoiCategoryFilter] = useState<string>('ALL');
  const [selectedPoiForQrModal, setSelectedPoiForQrModal] = useState<AdminPoiData | null>(null);
  const [qrModalDataUrl, setQrModalDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);

  // POI Create / Edit Modal State
  const [isPoiFormOpen, setIsPoiFormOpen] = useState(false);
  const [editingPoiId, setEditingPoiId] = useState<string | null>(null);
  const [poiFormData, setPoiFormData] = useState({
    code: '',
    nameVi: '',
    titleTagVi: '',
    category: 'monument' as const,
    briefVi: '',
    fullHistoryVi: '',
    spiritualMeaningVi: '',
    visitingTipsVi: '',
    lat: 16.1001,
    lng: 108.2778,
    mapX: 50,
    mapY: 50,
    audioDurationSeconds: 150,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    arModelType: 'lotus_halo'
  });

  // UC16: Bookings & Revenue State
  const [bookings, setBookings] = useState<BookingOrderData[]>([]);
  const [revenueStats, setRevenueStats] = useState<RevenueAnalyticsData | null>(null);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingSearch, setBookingSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [packageFilter, setPackageFilter] = useState<string>('ALL');

  // Fast Check-in Gate Staff Bar State
  const [checkInInput, setCheckInInput] = useState('');
  const [checkInResult, setCheckInResult] = useState<{
    success: boolean;
    message: string;
    order?: BookingOrderData;
  } | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Selected Booking Modal
  const [viewingBooking, setViewingBooking] = useState<BookingOrderData | null>(null);
  const [bookingQrDataUrl, setBookingQrDataUrl] = useState<string>('');

  // Load POIs
  const loadPois = async () => {
    setIsLoadingPois(true);
    try {
      const data = await apiClient.getAdminPois();
      setPois(data);
    } catch (err) {
      console.error('Error fetching admin POIs:', err);
    } finally {
      setIsLoadingPois(false);
    }
  };

  // Load Bookings & Analytics
  const loadBookingsAndRevenue = async () => {
    setIsLoadingBookings(true);
    try {
      const [orderList, analytics] = await Promise.all([
        apiClient.getAdminBookings({
          search: bookingSearch,
          status: statusFilter,
          ticketId: packageFilter,
          visitDate: selectedDateFilter
        }),
        apiClient.getRevenueAnalytics()
      ]);
      setBookings(orderList);
      setRevenueStats(analytics);
    } catch (err) {
      console.error('Error fetching bookings/revenue:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadPois();
  }, []);

  useEffect(() => {
    loadBookingsAndRevenue();
  }, [statusFilter, packageFilter, selectedDateFilter]);

  // Generate QR for POI modal
  useEffect(() => {
    if (selectedPoiForQrModal) {
      QRCode.toDataURL(selectedPoiForQrModal.code, {
        width: 320,
        margin: 2,
        color: {
          dark: '#1c1917',
          light: '#ffffff'
        }
      }).then(url => {
        setQrModalDataUrl(url);
      });
    }
  }, [selectedPoiForQrModal]);

  // Generate QR for Viewing Booking
  useEffect(() => {
    if (viewingBooking) {
      QRCode.toDataURL(viewingBooking.qrTicketCode, {
        width: 280,
        margin: 2,
        color: {
          dark: '#1c1917',
          light: '#ffffff'
        }
      }).then(url => {
        setBookingQrDataUrl(url);
      });
    }
  }, [viewingBooking]);

  // Handle POI Search
  const filteredPois = pois.filter(p => {
    const nameStr = typeof p.name === 'string' ? p.name : (p.name as any)?.vi || '';
    const codeStr = p.code || '';
    const titleStr = typeof p.titleTag === 'string' ? p.titleTag : (p.titleTag as any)?.vi || '';
    const q = poiSearch.toLowerCase().trim();

    const matchesSearch =
      nameStr.toLowerCase().includes(q) ||
      codeStr.toLowerCase().includes(q) ||
      titleStr.toLowerCase().includes(q);
    const matchesCategory = poiCategoryFilter === 'ALL' || p.category === poiCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle POI Delete
  const handleDeletePoi = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa điểm di tích "${name}"? Thao tác này không thể hoàn tác.`)) {
      const ok = await apiClient.deletePoi(id);
      if (ok) {
        setPois(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  // Open Edit Form
  const handleOpenEditPoi = (poi: AdminPoiData) => {
    setEditingPoiId(poi.id);
    setPoiFormData({
      code: poi.code,
      nameVi: poi.name,
      titleTagVi: poi.titleTag || '',
      category: (poi.category as any) || 'monument',
      briefVi: poi.brief || '',
      fullHistoryVi: poi.fullHistory || '',
      spiritualMeaningVi: poi.spiritualMeaning || '',
      visitingTipsVi: poi.visitingTips || '',
      lat: poi.coordinates?.lat || 16.1001,
      lng: poi.coordinates?.lng || 108.2778,
      mapX: poi.coordinates?.mapX || 50,
      mapY: poi.coordinates?.mapY || 50,
      audioDurationSeconds: poi.audioDurationSeconds || 150,
      image: poi.image || '',
      arModelType: poi.arModelType || 'lotus_halo'
    });
    setIsPoiFormOpen(true);
  };

  // Open Create Form
  const handleOpenCreatePoi = () => {
    setEditingPoiId(null);
    setPoiFormData({
      code: `LU-POI-${Math.floor(10 + Math.random() * 90)}`,
      nameVi: '',
      titleTagVi: '',
      category: 'monument',
      briefVi: '',
      fullHistoryVi: '',
      spiritualMeaningVi: '',
      visitingTipsVi: '',
      lat: 16.1001,
      lng: 108.2778,
      mapX: 50,
      mapY: 50,
      audioDurationSeconds: 150,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      arModelType: 'lotus_halo'
    });
    setIsPoiFormOpen(true);
  };

  // Save POI (Create or Update)
  const handleSavePoiForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poiFormData.nameVi.trim()) {
      alert('Vui lòng nhập tên điểm di tích!');
      return;
    }

    const payload = {
      code: poiFormData.code.trim().toUpperCase(),
      name: poiFormData.nameVi.trim(),
      titleTag: poiFormData.titleTagVi.trim(),
      category: poiFormData.category,
      brief: poiFormData.briefVi.trim(),
      fullHistory: poiFormData.fullHistoryVi.trim(),
      spiritualMeaning: poiFormData.spiritualMeaningVi.trim(),
      visitingTips: poiFormData.visitingTipsVi.trim(),
      coordinates: {
        lat: Number(poiFormData.lat),
        lng: Number(poiFormData.lng),
        mapX: Number(poiFormData.mapX),
        mapY: Number(poiFormData.mapY),
        elevationMeters: 120,
        compassBearing: 90
      },
      audioDurationSeconds: Number(poiFormData.audioDurationSeconds),
      image: poiFormData.image,
      arModelType: poiFormData.arModelType
    };

    if (editingPoiId) {
      const res = await apiClient.updatePoi(editingPoiId, payload);
      if (res && res.poi) {
        setIsPoiFormOpen(false);
        loadPois();
      }
    } else {
      const res = await apiClient.createPoi(payload);
      if (res && res.poi) {
        setIsPoiFormOpen(false);
        loadPois();
      }
    }
  };

  // Fast Check-In Handler
  const handleFastCheckIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!checkInInput.trim()) return;

    setIsCheckingIn(true);
    try {
      const res = await apiClient.checkInTicket(checkInInput.trim());
      setCheckInResult(res);
      if (res.success) {
        // Refresh orders and revenue
        loadBookingsAndRevenue();
        setCheckInInput('');
      }
    } catch (err) {
      setCheckInResult({
        success: false,
        message: 'Lỗi kết nối máy chủ soát vé!'
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Change booking status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiClient.updateBookingStatus(id, newStatus);
      loadBookingsAndRevenue();
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  // Delete booking
  const handleDeleteBooking = async (id: string) => {
    if (window.confirm(`Xác nhận xóa bản ghi đơn đặt vé ${id}?`)) {
      await apiClient.deleteBooking(id);
      loadBookingsAndRevenue();
    }
  };

  // Export Bookings CSV
  const handleExportCsv = () => {
    if (bookings.length === 0) {
      alert('Không có dữ liệu đơn hàng để xuất!');
      return;
    }

    const headers = [
      'Mã Đơn',
      'Tên Khách Hàng',
      'Số Điện Thoại',
      'Email',
      'Dịch Vụ',
      'Số Lượng',
      'Tổng Tiền (VND)',
      'Kênh Thanh Toán',
      'Trạng Thái',
      'Ngày Tham Quan',
      'Ngày Tạo',
      'Mã QR Vé'
    ];

    const rows = bookings.map(b => [
      `"${b.bookingId}"`,
      `"${b.customerName}"`,
      `"${b.customerPhone}"`,
      `"${b.customerEmail}"`,
      `"${b.ticketName}"`,
      b.quantity,
      b.totalAmountVnd,
      `"${b.paymentMethod || 'Chưa rõ'}"`,
      `"${b.status}"`,
      `"${b.visitDate}"`,
      `"${new Date(b.createdAt).toLocaleString('vi-VN')}"`,
      `"${b.qrTicketCode}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `linh_ung_bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print QR badge
  const handlePrintBadge = () => {
    window.print();
  };

  // Copy QR code text
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download QR Image
  const handleDownloadQr = (code: string) => {
    if (!qrModalDataUrl) return;
    const a = document.createElement('a');
    a.href = qrModalDataUrl;
    a.download = `QR_CHUA_LINH_UNG_${code}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  };

  // Total stats for POIs
  const totalScans = pois.reduce((acc, p) => acc + (p.scanCount || 0), 0);
  const mostScannedPoi = [...pois].sort((a, b) => (b.scanCount || 0) - (a.scanCount || 0))[0];

  return (
    <div className="w-full flex-1 flex flex-col bg-stone-950 text-stone-100 pb-16">
      {/* Top Admin Section Header */}
      <div className="border-b border-stone-800 bg-stone-900/50 backdrop-blur-sm px-4 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-500 font-medium mb-1">
              <span>Hệ Thống Quản Trị Viên (Admin)</span>
              <span aria-hidden="true">·</span>
              <span>Sơn Trà Đà Nẵng</span>
              <span aria-hidden="true">·</span>
              <span>Theo Sơ Đồ Use Case UC15 & UC16</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-sacred text-stone-100 flex items-center gap-2.5">
              <span>Bảng Điều Khiển Quản Lý Di Tích & Doanh Thu</span>
            </h1>
          </div>

          {/* Tab Selector: UC15 vs UC16 */}
          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg p-1 shrink-0">
            <button
              onClick={() => setAdminTab('revenue_bookings')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${adminTab === 'revenue_bookings'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
                }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>UC16: Doanh Thu & Đặt Vé</span>
            </button>
            <button
              onClick={() => setAdminTab('monuments_qr')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${adminTab === 'monuments_qr'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
                }`}
            >
              <QrCode className="w-4 h-4" />
              <span>UC15: Điểm Di Tích & Mã QR</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 flex-1 flex flex-col gap-6">
        {/* ========================================================================= */}
        {/* TAB 1: UC16 - QUẢN LÝ ĐƠN ĐẶT VÉ & DOANH THU                              */}
        {/* ========================================================================= */}
        {adminTab === 'revenue_bookings' && (
          <div className="flex flex-col gap-6">
            {/* Top KPI Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span className="font-medium">Tổng Doanh Thu Lũy Kế</span>
                  <DollarSign className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-amber-400">
                  {revenueStats ? formatVnd(revenueStats.totalRevenueVnd) : '...'}
                </div>
                <div className="mt-2 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Hôm nay: <strong className="text-stone-200 font-mono tabular-nums">{revenueStats ? formatVnd(revenueStats.todayRevenueVnd) : '0 đ'}</strong></span>
                  <span className="text-emerald-400 font-mono tabular-nums">7 ngày qua</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span className="font-medium">Tổng Số Vé Đã Xuất</span>
                  <Ticket className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
                  {revenueStats ? revenueStats.totalTicketsSold : '...'} <span className="text-sm font-normal text-stone-400">vé</span>
                </div>
                <div className="mt-2 text-[11px] text-stone-400">
                  <span>{revenueStats ? revenueStats.paidBookingsCount : 0} đơn thanh toán hợp lệ</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span className="font-medium">Khách Đã Soát Vé (Check-in)</span>
                  <UserCheck className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-sky-400">
                  {revenueStats ? revenueStats.checkedInCount : '...'} <span className="text-sm font-normal text-stone-400">lượt</span>
                </div>
                <div className="mt-2 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Tỷ lệ qua cổng:</span>
                  <span className="font-mono tabular-nums text-stone-200">
                    {revenueStats && revenueStats.totalBookings > 0
                      ? Math.round((revenueStats.checkedInCount / (revenueStats.paidBookingsCount + revenueStats.checkedInCount || 1)) * 100)
                      : 0}%
                  </span>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span className="font-medium">Chờ Thanh Toán / Hủy</span>
                  <Clock className="w-4 h-4 text-stone-400" />
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-amber-200">
                  {revenueStats ? revenueStats.pendingCount : 0} <span className="text-xs font-normal text-stone-400">chờ</span>
                  <span className="text-stone-600 mx-1.5">/</span>
                  <span className="text-rose-400 text-xl font-bold">{revenueStats ? revenueStats.cancelledCount : 0}</span> <span className="text-xs font-normal text-stone-400">hủy</span>
                </div>
                <div className="mt-2 text-[11px] text-stone-400">
                  <span>Cần đối soát thanh toán cổng VNPAY/Momo</span>
                </div>
              </div>
            </div>

            {/* Fast Gate Staff Check-In Bar */}
            <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                    <UserCheck className="w-4 h-4" />
                    <span>Soát Vé Nhanh Tại Cổng Chùa (Gate Check-In)</span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Nhập mã đơn hàng hoặc mã QR vé điện tử của khách tham quan để xác thực và check-in vào cổng.
                  </p>
                </div>

                <form onSubmit={handleFastCheckIn} className="flex-1 max-w-xl flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={checkInInput}
                      onChange={e => setCheckInInput(e.target.value)}
                      placeholder="Nhập mã đơn (LU-BKG-...) hoặc mã QR vé (PASS_...)"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isCheckingIn || !checkInInput.trim()}
                    className="px-4 py-2.5 text-xs font-semibold bg-amber-500 text-stone-950 rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                  >
                    {isCheckingIn ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Soát Vé Ngay</span>
                  </button>
                </form>
              </div>

              {/* Check-In Response Alert */}
              {checkInResult && (
                <div className={`mt-4 p-3.5 rounded-lg border text-xs flex items-start justify-between gap-3 ${checkInResult.success
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-800 text-rose-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    {checkInResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{checkInResult.message}</span>
                  </div>
                  <button
                    onClick={() => setCheckInResult(null)}
                    className="text-stone-400 hover:text-stone-200 text-xs px-1.5"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Revenue Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart 1: 7-day Revenue Trend (Custom Responsive SVG) */}
              <div className="lg:col-span-2 bg-stone-900/90 border border-stone-800 rounded-xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      <span>Biến Động Doanh Thu 7 Ngày Gần Nhất</span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">Thống kê doanh thu thực nhận theo ngày</p>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-stone-400 bg-stone-950 px-2.5 py-1 rounded border border-stone-800">
                    Tuần Này: {revenueStats ? formatVnd(revenueStats.weekRevenueVnd) : '0 đ'}
                  </span>
                </div>

                {/* SVG Bar Chart */}
                <div className="pt-2 pb-1">
                  {revenueStats && revenueStats.dailyTrend.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-7 gap-2 items-end h-44 border-b border-stone-800 pb-2 px-1">
                        {revenueStats.dailyTrend.map((d, idx) => {
                          const maxRev = Math.max(...revenueStats.dailyTrend.map(x => x.revenueVnd), 1000000);
                          const heightPct = Math.max(Math.round((d.revenueVnd / maxRev) * 100), 8);
                          const dayLabel = new Date(d.date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' });

                          return (
                            <div key={idx} className="flex flex-col items-center justify-end h-full group relative">
                              {/* Hover Tooltip */}
                              <div className="absolute -top-10 bg-stone-950 border border-stone-700 text-stone-100 text-[10px] font-mono rounded px-2 py-1 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                                {formatVnd(d.revenueVnd)} · {d.ticketCount} vé
                              </div>

                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full max-w-[36px] rounded-t transition-all ${d.revenueVnd > 0 ? 'bg-gradient-to-t from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300' : 'bg-stone-800'
                                  }`}
                              />
                              <span className="text-[10px] text-stone-400 mt-2 truncate w-full text-center">
                                {dayLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-44 flex items-center justify-center text-xs text-stone-500">
                      Đang cập nhật số liệu biểu đồ...
                    </div>
                  )}
                </div>
              </div>

              {/* Chart 2: Revenue Distribution by Package */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-100 mb-1">Cơ Cấu Doanh Thu Gói Dịch Vụ</h3>
                  <p className="text-xs text-stone-400 mb-4">Tỷ trọng doanh thu theo từng loại vé</p>

                  <div className="space-y-3">
                    {revenueStats && revenueStats.revenueByPackage.length > 0 ? (
                      revenueStats.revenueByPackage.map((pkg, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-300 truncate max-w-[170px]" title={pkg.packageName}>
                              {pkg.packageName}
                            </span>
                            <span className="font-mono tabular-nums text-stone-200">
                              {pkg.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden">
                            <div
                              style={{ width: `${pkg.percentage}%` }}
                              className={`h-full rounded-full ${idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-emerald-500' : idx === 2 ? 'bg-sky-500' : 'bg-purple-500'
                                }`}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-stone-500">
                            <span>{pkg.count} lượt đặt</span>
                            <span className="font-mono">{formatVnd(pkg.revenueVnd)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-stone-500 py-6 text-center">Chưa có số liệu phân bổ</div>
                    )}
                  </div>
                </div>

                {/* Payment Channels Breakdown */}
                <div className="pt-4 border-t border-stone-800/80 mt-4">
                  <div className="text-xs font-medium text-stone-400 mb-2">Cổng Thanh Toán:</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {revenueStats?.revenueByChannel.map((ch, idx) => (
                      <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300">
                        {ch.channel}: {ch.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Management Datatable */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-xl overflow-hidden">
              {/* Table Toolbar */}
              <div className="p-4 border-b border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-stone-900/50">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-amber-500" />
                    <span>Danh Sách Đơn Đặt Vé & Trạng Thái</span>
                  </h3>
                  <span className="text-xs font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                    {bookings.length} đơn hàng
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm tên, SĐT, mã đơn..."
                      value={bookingSearch}
                      onChange={e => setBookingSearch(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && loadBookingsAndRevenue()}
                      className="pl-8 pr-3 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500 w-48 sm:w-60"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="PAID">Đã thanh toán (Chờ check-in)</option>
                    <option value="CHECKED_IN">Đã soát vé (Vào cổng)</option>
                    <option value="PENDING_PAYMENT">Chờ thanh toán</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>

                  {/* Export CSV Button */}
                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors border border-stone-700"
                    title="Xuất file báo cáo Excel / CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Xuất CSV</span>
                  </button>

                  {/* Refresh */}
                  <button
                    onClick={loadBookingsAndRevenue}
                    className="p-1.5 text-stone-400 hover:text-stone-200 bg-stone-950 border border-stone-800 rounded-lg transition-colors"
                    title="Làm mới dữ liệu"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingBookings ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-800 bg-stone-950/80 text-stone-400 font-medium">
                      <th className="py-3 px-4">Mã Đơn / QR</th>
                      <th className="py-3 px-4">Khách Hàng</th>
                      <th className="py-3 px-4">Gói Dịch Vụ</th>
                      <th className="py-3 px-4 text-center">Số Lượng</th>
                      <th className="py-3 px-4 text-right">Tổng Tiền</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4">Ngày Tham Quan</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {isLoadingBookings ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-stone-500">
                          Đang tải dữ liệu đơn đặt vé...
                        </td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-stone-500">
                          Không tìm thấy đơn đặt vé nào phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      bookings.map(order => (
                        <tr key={order.bookingId} className="hover:bg-stone-800/30 transition-colors">
                          {/* Mã đơn & QR */}
                          <td className="py-3 px-4 font-mono">
                            <span className="font-semibold text-stone-100">{order.bookingId}</span>
                            <div className="text-[10px] text-stone-500 truncate max-w-[120px]">
                              {order.qrTicketCode}
                            </div>
                          </td>

                          {/* Khách hàng */}
                          <td className="py-3 px-4">
                            <div className="font-medium text-stone-200">{order.customerName}</div>
                            <div className="text-[11px] text-stone-400 font-mono">{order.customerPhone}</div>
                          </td>

                          {/* Gói dịch vụ */}
                          <td className="py-3 px-4">
                            <div className="text-stone-300 truncate max-w-[200px]" title={order.ticketName}>
                              {order.ticketName}
                            </div>
                            <div className="text-[10px] text-stone-500">
                              Kênh: {order.paymentMethod || 'Chưa thanh toán'}
                            </div>
                          </td>

                          {/* Số lượng */}
                          <td className="py-3 px-4 text-center font-mono tabular-nums">
                            {order.quantity}
                          </td>

                          {/* Tổng tiền */}
                          <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-amber-400">
                            {formatVnd(order.totalAmountVnd)}
                          </td>

                          {/* Trạng thái */}
                          <td className="py-3 px-4">
                            {order.status === 'CHECKED_IN' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Đã Soát Vé
                              </span>
                            )}
                            {order.status === 'PAID' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                                <Check className="w-3.5 h-3.5" /> Đã Thanh Toán
                              </span>
                            )}
                            {order.status === 'PENDING_PAYMENT' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                                <Clock className="w-3.5 h-3.5" /> Chờ Tiền Về
                              </span>
                            )}
                            {order.status === 'CANCELLED' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400">
                                <XCircle className="w-3.5 h-3.5" /> Đã Hủy
                              </span>
                            )}
                          </td>

                          {/* Ngày tham quan */}
                          <td className="py-3 px-4 text-stone-400 font-mono tabular-nums">
                            {order.visitDate}
                          </td>

                          {/* Thao tác */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Fast Check in button if PAID */}
                              {order.status === 'PAID' && (
                                <button
                                  onClick={() => {
                                    setCheckInInput(order.bookingId);
                                    apiClient.checkInTicket(order.bookingId).then(res => {
                                      setCheckInResult(res);
                                      loadBookingsAndRevenue();
                                    });
                                  }}
                                  className="px-2 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 rounded text-[11px] font-medium transition-colors"
                                  title="Soát vé khách vào cổng"
                                >
                                  Soát Vé
                                </button>
                              )}

                              {/* Confirm Payment button if PENDING */}
                              {order.status === 'PENDING_PAYMENT' && (
                                <button
                                  onClick={() => handleUpdateStatus(order.bookingId, 'PAID')}
                                  className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-medium transition-colors"
                                  title="Xác nhận khách đã nộp tiền mặt/chuyển khoản"
                                >
                                  Nhận Tiền
                                </button>
                              )}

                              {/* View detail / QR modal */}
                              <button
                                onClick={() => setViewingBooking(order)}
                                className="p-1.5 text-stone-400 hover:text-stone-200 bg-stone-950 border border-stone-800 rounded transition-colors"
                                title="Xem chi tiết & QR Vé"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Cancel/Delete */}
                              <button
                                onClick={() => handleDeleteBooking(order.bookingId)}
                                className="p-1.5 text-stone-500 hover:text-rose-400 bg-stone-950 border border-stone-800 rounded transition-colors"
                                title="Xóa đơn hàng"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: UC15 - QUẢN LÝ ĐIỂM DI TÍCH & MÃ QR                                 */}
        {/* ========================================================================= */}
        {adminTab === 'monuments_qr' && (
          <div className="flex flex-col gap-6">
            {/* KPI Summary Strip for Monuments */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4.5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block mb-1">Tổng Số Điểm Di Tích</span>
                  <div className="text-2xl font-bold font-mono tabular-nums text-stone-100">{pois.length}</div>
                  <span className="text-[11px] text-stone-500 mt-1 block">Toàn khu vực Bãi Bụt Sơn Trà</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Landmark className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4.5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block mb-1">Tổng Lượt Quét Mã QR</span>
                  <div className="text-2xl font-bold font-mono tabular-nums text-amber-400">{totalScans}</div>
                  <span className="text-[11px] text-stone-500 mt-1 block">Du khách đã quét nghe thuyết minh</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <QrCode className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4.5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block mb-1">Điểm Di Tích Hot Nhất</span>
                  <div className="text-base font-bold text-stone-100 truncate max-w-[180px]">
                    {mostScannedPoi ? mostScannedPoi.name : 'Chưa có'}
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono mt-1 block">
                    {mostScannedPoi ? `${mostScannedPoi.scanCount} lượt quét` : ''}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Monuments Toolbar */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={poiSearch}
                    onChange={e => setPoiSearch(e.target.value)}
                    placeholder="Tìm tên di tích, mã QR nhận diện..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={poiCategoryFilter}
                  onChange={e => setPoiCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500 shrink-0"
                >
                  <option value="ALL">Tất cả phân loại</option>
                  <option value="monument">Tượng Phật / Kiến trúc</option>
                  <option value="temple">Điện thờ / Tăng xá</option>
                  <option value="nature">Cảnh quan thiên nhiên</option>
                  <option value="viewpoint">Điểm vọng cảnh biển</option>
                  <option value="relic">Bảo vật / Xá lợi</option>
                </select>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleOpenCreatePoi}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-amber-500 text-stone-950 rounded-lg hover:bg-amber-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Điểm Di Tích Mới</span>
                </button>
              </div>
            </div>

            {/* POI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {isLoadingPois ? (
                <div className="col-span-full py-12 text-center text-stone-500 text-xs">
                  Đang tải danh sách điểm di tích...
                </div>
              ) : filteredPois.length === 0 ? (
                <div className="col-span-full py-12 text-center text-stone-500 text-xs">
                  Không tìm thấy điểm di tích nào phù hợp với từ khóa tìm kiếm.
                </div>
              ) : (
                filteredPois.map(poi => (
                  <div
                    key={poi.id}
                    className="bg-stone-900/90 border border-stone-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-stone-700 transition-all"
                  >
                    <div>
                      {/* Image header */}
                      <div className="relative h-44 w-full bg-stone-950 overflow-hidden">
                        <img
                          src={poi.image}
                          alt={poi.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                        {/* Top QR tag */}
                        <div className="absolute top-3 left-3 bg-stone-950/90 backdrop-blur-md border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded text-[11px] font-mono font-semibold flex items-center gap-1">
                          <QrCode className="w-3 h-3 text-amber-400" />
                          <span>{poi.code}</span>
                        </div>

                        {/* Category tag */}
                        <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md border border-stone-700 text-stone-300 px-2 py-0.5 rounded text-[10px] capitalize">
                          {poi.category}
                        </div>

                        {/* Scan Count badge */}
                        <div className="absolute bottom-2.5 right-3 bg-stone-950/90 backdrop-blur-md border border-stone-700 text-stone-200 px-2.5 py-1 rounded text-xs font-mono tabular-nums flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>{poi.scanCount || 0} lượt quét</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h4 className="font-bold text-base text-stone-100 font-serif-sacred line-clamp-1 mb-1">
                          {poi.name}
                        </h4>
                        <p className="text-xs text-amber-200/80 line-clamp-1 mb-2 font-medium">
                          {poi.titleTag || 'Di tích Chùa Linh Ứng'}
                        </p>
                        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3">
                          {poi.brief}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-800/80 pt-2.5">
                          <span className="flex items-center gap-1 font-mono">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            X:{poi.coordinates?.mapX}% Y:{poi.coordinates?.mapY}%
                          </span>
                          <span className="font-mono">
                            {poi.audioDurationSeconds ? `${Math.floor(poi.audioDurationSeconds / 60)}p${poi.audioDurationSeconds % 60}s` : 'Thuyết minh'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-3 bg-stone-950/70 border-t border-stone-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedPoiForQrModal(poi)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded text-xs font-medium transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Xem Mã QR & In</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditPoi(poi)}
                        className="p-2 text-stone-400 hover:text-stone-200 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded transition-colors"
                        title="Chỉnh sửa di tích"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeletePoi(poi.id, poi.name)}
                        className="p-2 text-stone-500 hover:text-rose-400 bg-stone-900 border border-stone-800 hover:border-rose-900 rounded transition-colors"
                        title="Xóa di tích"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: POI QR CODE VIEWER, PRINT & DOWNLOAD                             */}
      {/* ========================================================================= */}
      {selectedPoiForQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedPoiForQrModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 text-sm p-1 rounded-lg"
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-widest block mb-1">
                Biển Bảng QR Di Tích Chuẩn
              </span>
              <h3 className="text-lg font-bold font-serif-sacred text-stone-100">
                {selectedPoiForQrModal.name}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Chùa Linh Ứng Bãi Bụt · Bán đảo Sơn Trà
              </p>
            </div>

            {/* QR Card Container (Ready for Print or Visitor Scanning) */}
            <div
              id="printable-qr-card"
              className="bg-white text-stone-950 p-5 rounded-xl border-4 border-amber-500 shadow-inner flex flex-col items-center justify-center my-3"
            >
              <div className="text-center mb-2">
                <span className="text-lg select-none">🪷</span>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  CHÙA LINH ỨNG SƠN TRÀ
                </div>
                <div className="text-xs font-semibold text-stone-800 mt-0.5 line-clamp-1">
                  {selectedPoiForQrModal.name}
                </div>
              </div>

              {/* Rendered standard QR */}
              {qrModalDataUrl ? (
                <img
                  src={qrModalDataUrl}
                  alt={`QR Code ${selectedPoiForQrModal.code}`}
                  className="w-48 h-48 rounded-lg shadow-sm my-1"
                />
              ) : (
                <div className="w-48 h-48 bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                  Đang tạo mã QR...
                </div>
              )}

              {/* Code */}
              <div className="mt-2 text-center">
                <div className="font-mono font-bold text-sm text-stone-900 tracking-wider">
                  {selectedPoiForQrModal.code}
                </div>
                <div className="text-[10px] text-stone-600 mt-0.5">
                  Quét mã để nghe thuyết minh tự động & xem thực tế AR
                </div>
              </div>
            </div>

            {/* Scan stats info */}
            <div className="text-xs text-stone-400 flex items-center justify-between px-1 py-2">
              <span>Đã có <strong className="text-amber-400 font-mono">{selectedPoiForQrModal.scanCount || 0}</strong> lượt quét</span>
              <button
                onClick={() => handleCopyCode(selectedPoiForQrModal.code)}
                className="flex items-center gap-1 text-stone-300 hover:text-amber-400 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Đã sao chép' : 'Sao chép mã'}</span>
              </button>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-800">
              <button
                onClick={() => handleDownloadQr(selectedPoiForQrModal.code)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium transition-colors border border-stone-700"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Tải Ảnh QR (PNG)</span>
              </button>

              <button
                onClick={handlePrintBadge}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-semibold transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Biển Bảng Di Tích</span>
              </button>
            </div>

            {/* Simulate scan button for testing */}
            {onSimulateScanCode && (
              <button
                onClick={() => {
                  onSimulateScanCode(selectedPoiForQrModal.code);
                  setSelectedPoiForQrModal(null);
                }}
                className="w-full mt-2 py-2 text-center text-xs text-amber-400 hover:text-amber-300 font-medium underline"
              >
                Thử nghiệm quét mã này ngay trên giao diện khách tham quan →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE / EDIT POI FORM                                           */}
      {/* ========================================================================= */}
      {isPoiFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPoiFormOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 text-sm p-1 rounded-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold font-serif-sacred text-stone-100 mb-1">
              {editingPoiId ? 'Chỉnh Sửa Điểm Di Tích' : 'Thêm Điểm Di Tích Mới'}
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Cập nhật thông tin thuyết minh, phân loại, vị trí bản đồ và mã định danh QR.
            </p>

            <form onSubmit={handleSavePoiForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Tên Điểm Di Tích *</label>
                  <input
                    type="text"
                    required
                    value={poiFormData.nameVi}
                    onChange={e => setPoiFormData({ ...poiFormData, nameVi: e.target.value })}
                    placeholder="VD: Cổng Tam Quan Bãi Bụt"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Mã QR Định Danh (Code) *</label>
                  <input
                    type="text"
                    required
                    value={poiFormData.code}
                    onChange={e => setPoiFormData({ ...poiFormData, code: e.target.value.toUpperCase() })}
                    placeholder="VD: LU-TAMQUAN-01"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Tiêu Đề / Slogan Phụ</label>
                  <input
                    type="text"
                    value={poiFormData.titleTagVi}
                    onChange={e => setPoiFormData({ ...poiFormData, titleTagVi: e.target.value })}
                    placeholder="VD: Cửa ngõ tâm linh hướng biển"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Phân Loại Di Tích</label>
                  <select
                    value={poiFormData.category}
                    onChange={e => setPoiFormData({ ...poiFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="monument">Tượng Phật / Kiến Trúc Lớn</option>
                    <option value="temple">Điện Thờ / Chánh Điện</option>
                    <option value="nature">Cảnh Quan Thiên Nhiên</option>
                    <option value="viewpoint">Điểm Vọng Cảnh Biển</option>
                    <option value="relic">Tháp Xá Lợi / Cổ Vật</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Mô Tả Tóm Tắt (Dành Cho Thẻ & Audio)</label>
                <textarea
                  rows={2}
                  value={poiFormData.briefVi}
                  onChange={e => setPoiFormData({ ...poiFormData, briefVi: e.target.value })}
                  placeholder="Giới thiệu nhanh về vị trí và vẻ đẹp của di tích..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Lịch Sử & Chi Tiết Kiến Trúc</label>
                <textarea
                  rows={3}
                  value={poiFormData.fullHistoryVi}
                  onChange={e => setPoiFormData({ ...poiFormData, fullHistoryVi: e.target.value })}
                  placeholder="Năm xây dựng, kích thước, nghệ nhân điêu khắc..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Ý Nghĩa Tâm Linh</label>
                  <input
                    type="text"
                    value={poiFormData.spiritualMeaningVi}
                    onChange={e => setPoiFormData({ ...poiFormData, spiritualMeaningVi: e.target.value })}
                    placeholder="VD: Cầu bình an, sóng yên biển lặng..."
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Lưu Ý Khi Tham Quan</label>
                  <input
                    type="text"
                    value={poiFormData.visitingTipsVi}
                    onChange={e => setPoiFormData({ ...poiFormData, visitingTipsVi: e.target.value })}
                    placeholder="VD: Giữ yên lặng, cởi giày dép khi vào chánh điện..."
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Tọa Độ Bản Đồ X (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={poiFormData.mapX}
                    onChange={e => setPoiFormData({ ...poiFormData, mapX: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Tọa Độ Bản Đồ Y (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={poiFormData.mapY}
                    onChange={e => setPoiFormData({ ...poiFormData, mapY: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Thời Lượng Audio (giây)</label>
                  <input
                    type="number"
                    value={poiFormData.audioDurationSeconds}
                    onChange={e => setPoiFormData({ ...poiFormData, audioDurationSeconds: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Link Ảnh Di Tích</label>
                <input
                  type="url"
                  value={poiFormData.image}
                  onChange={e => setPoiFormData({ ...poiFormData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsPoiFormOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg font-medium transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-lg transition-colors"
                >
                  {editingPoiId ? 'Lưu Thay Đổi' : 'Thêm Mới Di Tích'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW BOOKING ORDER & E-TICKET QR                                 */}
      {/* ========================================================================= */}
      {viewingBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setViewingBooking(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 text-sm p-1 rounded-lg"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-widest block mb-1">
                Chi Tiết Vé Điện Tử & Soát Vé
              </span>
              <h3 className="text-lg font-bold font-serif-sacred text-stone-100">
                {viewingBooking.bookingId}
              </h3>
            </div>

            {/* QR Card */}
            <div className="bg-white text-stone-950 p-4 rounded-xl border border-stone-300 flex flex-col items-center justify-center my-3">
              {bookingQrDataUrl ? (
                <img
                  src={bookingQrDataUrl}
                  alt={viewingBooking.qrTicketCode}
                  className="w-40 h-40 rounded shadow-sm"
                />
              ) : (
                <div className="w-40 h-40 bg-stone-100 flex items-center justify-center text-xs">
                  Đang tạo QR vé...
                </div>
              )}
              <div className="mt-2 text-center">
                <span className="text-[11px] font-mono text-stone-600 block">{viewingBooking.qrTicketCode}</span>
                <span className="text-xs font-semibold text-stone-900">
                  {viewingBooking.customerName} · {viewingBooking.quantity} vé
                </span>
              </div>
            </div>

            {/* Order details */}
            <div className="space-y-2 text-xs border-t border-stone-800 pt-3">
              <div className="flex justify-between">
                <span className="text-stone-400">Dịch Vụ:</span>
                <span className="text-stone-200 font-medium text-right max-w-[200px]">{viewingBooking.ticketName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Số Điện Thoại:</span>
                <span className="text-stone-200 font-mono">{viewingBooking.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Email:</span>
                <span className="text-stone-200 font-mono">{viewingBooking.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Ngày Tham Quan:</span>
                <span className="text-stone-200 font-mono">{viewingBooking.visitDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Tổng Tiền:</span>
                <span className="text-amber-400 font-bold font-mono">{formatVnd(viewingBooking.totalAmountVnd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Trạng Thái:</span>
                <span className="font-semibold text-stone-200">
                  {viewingBooking.status === 'CHECKED_IN' && 'ĐÃ SOÁT VÉ VÀO CỔNG'}
                  {viewingBooking.status === 'PAID' && 'ĐÃ THANH TOÁN (CHỜ CHECK-IN)'}
                  {viewingBooking.status === 'PENDING_PAYMENT' && 'CHỜ THANH TOÁN'}
                  {viewingBooking.status === 'CANCELLED' && 'ĐÃ HỦY VÉ'}
                </span>
              </div>
              {viewingBooking.checkedInAt && (
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-400">Thời Gian Check-in:</span>
                  <span className="text-sky-400 font-mono">
                    {new Date(viewingBooking.checkedInAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              )}
            </div>

            {/* Actions in Modal */}
            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-end gap-2">
              {viewingBooking.status === 'PAID' && (
                <button
                  onClick={() => {
                    apiClient.checkInTicket(viewingBooking.bookingId).then(res => {
                      setCheckInResult(res);
                      loadBookingsAndRevenue();
                      setViewingBooking(null);
                    });
                  }}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-stone-950 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Soát Vé</span>
                </button>
              )}
              <button
                onClick={() => setViewingBooking(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
