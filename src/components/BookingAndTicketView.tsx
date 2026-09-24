import React, { useState, useEffect } from 'react';
import {
  TicketPackageData,
  BookingOrderData,
  PaymentTransactionData,
  SupportedLanguage
} from '../types/index.ts';
import { TRANSLATIONS } from '../data/translations.ts';
import { apiClient } from '../services/apiClient.ts';
import {
  Ticket,
  Calendar,
  User,
  Phone,
  Mail,
  CheckCircle2,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sparkles,
  Lock,
  Copy,
  Download,
  X,
  Clock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface BookingAndTicketViewProps {
  currentLang: SupportedLanguage;
}

export const BookingAndTicketView: React.FC<BookingAndTicketViewProps> = ({
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [packages, setPackages] = useState<TicketPackageData[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<TicketPackageData | null>(null);

  // Form fields
  const [quantity, setQuantity] = useState(1);
  const [visitDate, setVisitDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Checkout & Payment states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBooking, setActiveBooking] = useState<BookingOrderData | null>(null);
  const [paymentTransaction, setPaymentTransaction] = useState<PaymentTransactionData | null>(null);
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState<string>('VIETQR');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [showSuccessPassModal, setShowSuccessPassModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getTickets(currentLang).then((pkgs) => {
      setPackages(pkgs);
      if (pkgs.length > 0) setSelectedPkg(pkgs[0]);
    });
  }, [currentLang]);

  const handleStartBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg || !customerName.trim() || !customerPhone.trim()) {
      alert('Vui lòng điền họ tên và số điện thoại liên hệ');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create booking order in backend
      const order = await apiClient.createBooking({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        ticketId: selectedPkg.id,
        quantity,
        visitDate,
      });

      setActiveBooking(order);

      // 2. Initiate payment transaction
      const txn = await apiClient.initiatePayment({
        bookingId: order.bookingId,
        amountVnd: order.totalAmountVnd,
        channel: selectedPaymentChannel,
      });

      setPaymentTransaction(txn);
      setShowPaymentModal(true);
    } catch (err: any) {
      alert('Lỗi tạo đơn đặt vé: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChannelSwitch = async (channel: string) => {
    setSelectedPaymentChannel(channel);
    if (!activeBooking) return;

    try {
      const txn = await apiClient.initiatePayment({
        bookingId: activeBooking.bookingId,
        amountVnd: activeBooking.totalAmountVnd,
        channel,
      });
      setPaymentTransaction(txn);
    } catch (err) {
      console.error('Error switching payment channel:', err);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentTransaction) return;
    setIsConfirmingPayment(true);
    try {
      const result = await apiClient.confirmPayment(paymentTransaction.transactionId);
      setActiveBooking(result.booking);
      setShowPaymentModal(false);
      setShowSuccessPassModal(true);
    } catch (err: any) {
      alert('Lỗi xác nhận thanh toán: ' + err.message);
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-stone-900 border border-amber-900/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Dịch Vụ & Tiện Ích Trực Tuyến</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-100 font-serif-sacred">
            {t.booking.title}
          </h2>
          <p className="text-xs text-stone-300 max-w-xl">
            {t.booking.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Thanh toán VietQR & MoMo bảo mật 100%</span>
        </div>
      </div>

      {/* Main Grid: Ticket Selection & Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ticket Packages Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-serif-sacred">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Chọn Gói Tiện Ích & Dịch Vụ</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {packages.map((pkg) => {
              const isSelected = selectedPkg?.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/40 shadow-xl'
                      : 'bg-stone-900/90 border-stone-800 hover:border-amber-500/40 hover:bg-stone-850'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header badge & image */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {pkg.badge && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-500/40 mb-1">
                            {pkg.badge}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-amber-100 font-serif-sacred line-clamp-1">
                          {pkg.name}
                        </h4>
                      </div>
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-700 shrink-0"
                      />
                    </div>

                    <div className="text-xs text-stone-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{pkg.durationText}</span>
                    </div>

                    {/* Includes list */}
                    <ul className="space-y-1 text-xs text-stone-300">
                      {pkg.includes.map((inc, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="line-clamp-1">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing and Select radio */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-800">
                    <div>
                      <span className="text-sm sm:text-base font-extrabold text-amber-300">
                        {formatVnd(pkg.priceVnd)}
                      </span>
                      {pkg.originalPriceVnd && (
                        <span className="text-xs text-stone-500 line-through ml-2">
                          {formatVnd(pkg.originalPriceVnd)}
                        </span>
                      )}
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500 text-stone-950'
                          : 'border-stone-600'
                      }`}
                    >
                      {isSelected && <span className="text-xs font-bold">✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Booking Form */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-amber-900/50 space-y-4 shadow-xl h-fit">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-amber-200 font-serif-sacred">
              Thông Tin Đặt Vé & Thanh Toán
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Xác nhận tức thì qua tin nhắn & vé điện tử
            </p>
          </div>

          <form onSubmit={handleStartBooking} className="space-y-3.5 text-xs">
            {/* Selected Package preview */}
            {selectedPkg && (
              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase">
                  Gói dịch vụ đã chọn:
                </span>
                <p className="text-xs font-semibold text-stone-100">
                  {selectedPkg.name}
                </p>
                <p className="text-xs text-amber-300 font-bold">
                  {formatVnd(selectedPkg.priceVnd)} / lượt
                </p>
              </div>
            )}

            {/* Visit Date */}
            <div>
              <label className="block text-stone-300 mb-1 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {t.booking.visitDate}
              </label>
              <input
                type="date"
                required
                value={visitDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500/50 text-xs"
              />
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-stone-300 mb-1 font-medium">
                {t.booking.quantity}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="font-bold text-sm text-amber-300 w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(20, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-stone-300 mb-1 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                {t.booking.fullName} *
              </label>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500/50 text-xs"
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-stone-300 mb-1 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                {t.booking.phone} *
              </label>
              <input
                type="tel"
                required
                placeholder="0905 123 456"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500/50 text-xs"
              />
            </div>

            {/* Customer Email */}
            <div>
              <label className="block text-stone-300 mb-1 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                Email nhận vé (không bắt buộc)
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500/50 text-xs"
              />
            </div>

            {/* Total calculation */}
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <span className="text-stone-300 font-medium">Tổng tiền:</span>
              <span className="text-base sm:text-lg font-extrabold text-amber-400">
                {selectedPkg ? formatVnd(selectedPkg.priceVnd * quantity) : '0 đ'}
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Đang xử lý đặt vé...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Tiến Hành Thanh Toán Bảo Mật</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Payment Gateway Modal (VietQR / MoMo / VNPay / Card) */}
      {showPaymentModal && paymentTransaction && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-stone-900 border border-amber-500/50 rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-amber-100 font-serif-sacred">
                    Cổng Thanh Toán Trực Tuyến
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Mã đơn: <span className="font-mono text-amber-300">{activeBooking.bookingId}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Channel Selector */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'VIETQR', label: 'VietQR', icon: '🏦' },
                { id: 'MOMO', label: 'MoMo', icon: '👛' },
                { id: 'VNPAY', label: 'VNPay', icon: '💳' },
                { id: 'CREDIT_CARD', label: 'Thẻ Quốc Tế', icon: '🌐' },
              ].map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelSwitch(channel.id)}
                  className={`p-2 rounded-xl text-center border transition-all text-xs font-medium ${
                    selectedPaymentChannel === channel.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="text-base">{channel.icon}</div>
                  <span className="text-[10px] block mt-0.5">{channel.label}</span>
                </button>
              ))}
            </div>

            {/* Total Amount Callout */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <span className="text-xs text-stone-300">Số tiền cần thanh toán:</span>
              <span className="text-lg font-extrabold text-amber-400">
                {formatVnd(paymentTransaction.amountVnd)}
              </span>
            </div>

            {/* VietQR Bank Info Display */}
            {selectedPaymentChannel === 'VIETQR' && paymentTransaction.bankAccountInfo && (
              <div className="space-y-3">
                {/* QR Code image */}
                <div className="p-3 bg-white rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg">
                  {paymentTransaction.qrData ? (
                    <img
                      src={paymentTransaction.qrData}
                      alt="VietQR code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="w-32 h-32 text-stone-950" />
                  )}
                </div>

                <p className="text-center text-[11px] text-stone-400">
                  Mở ứng dụng ngân hàng bất kỳ (VCB, MB, Techcombank, BIDV...) quét mã QR
                </p>

                {/* Account Details Box */}
                <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Ngân hàng:</span>
                    <span className="text-stone-200 font-semibold">{paymentTransaction.bankAccountInfo.bankName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Số tài khoản:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-amber-300 font-bold">{paymentTransaction.bankAccountInfo.accountNumber}</span>
                      <button
                        onClick={() => handleCopy(paymentTransaction.bankAccountInfo!.accountNumber, 'acc')}
                        className="text-stone-400 hover:text-amber-400 p-0.5"
                        title="Sao chép"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Chủ tài khoản:</span>
                    <span className="text-stone-200 font-semibold">{paymentTransaction.bankAccountInfo.accountName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Nội dung chuyển khoản:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-emerald-400 font-bold">{paymentTransaction.bankAccountInfo.transferDescription}</span>
                      <button
                        onClick={() => handleCopy(paymentTransaction.bankAccountInfo!.transferDescription, 'desc')}
                        className="text-stone-400 hover:text-emerald-400 p-0.5"
                        title="Sao chép"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {copiedField && (
                    <div className="text-[10px] text-center text-emerald-400 font-semibold pt-1">
                      ✓ Đã sao chép vào bộ nhớ tạm!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Credit Card Simulation Display */}
            {selectedPaymentChannel === 'CREDIT_CARD' && (
              <div className="space-y-2.5 text-xs p-3 rounded-xl bg-stone-950 border border-stone-800">
                <div>
                  <label className="text-stone-400 block mb-1">Số thẻ tín dụng / ghi nợ</label>
                  <input
                    type="text"
                    defaultValue="4532 •••• •••• 8892"
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-stone-400 block mb-1">Hạn thẻ (MM/YY)</label>
                    <input
                      type="text"
                      defaultValue="08/28"
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200"
                    />
                  </div>
                  <div>
                    <label className="text-stone-400 block mb-1">Mã bảo mật (CVV)</label>
                    <input
                      type="password"
                      defaultValue="789"
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Payment Button */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirmPayment}
                disabled={isConfirmingPayment}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isConfirmingPayment ? (
                  <span>Đang kết nối cổng ngân hàng & phát hành vé...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác Nhận Đã Thanh Toán & Nhận Vé Ngay</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-stone-500">
                Hệ thống xác thực giao dịch tự động qua EventBus microservice trong 1-3 giây.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success E-Ticket Pass Modal */}
      {showSuccessPassModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-md bg-stone-900 border-2 border-emerald-500/60 rounded-3xl shadow-2xl p-6 space-y-4 text-center">
            {/* Success icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ĐÃ THANH TOÁN THÀNH CÔNG
              </span>
              <h3 className="text-xl font-bold text-amber-100 font-serif-sacred mt-2">
                Vé Điện Tử Chùa Linh Ứng
              </h3>
              <p className="text-xs text-stone-400">
                {t.booking.eTicketSuccess}
              </p>
            </div>

            {/* E-Ticket Card Layout */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-left space-y-3 relative overflow-hidden">
              {/* Watermark */}
              <div className="absolute -right-4 -bottom-4 text-7xl opacity-5 select-none pointer-events-none">
                🪷
              </div>

              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div>
                  <span className="text-[10px] text-stone-400">Mã vé (Check-in Code):</span>
                  <p className="text-xs font-mono font-bold text-amber-300">{activeBooking.bookingId}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400">Ngày tham quan:</span>
                  <p className="text-xs font-semibold text-stone-200">{activeBooking.visitDate}</p>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-stone-300">
                  <strong>Khách hàng:</strong> {activeBooking.customerName}
                </p>
                <p className="text-stone-300">
                  <strong>Dịch vụ:</strong> {activeBooking.ticketName}
                </p>
                <p className="text-stone-300">
                  <strong>Số lượng:</strong> {activeBooking.quantity} khách
                </p>
                <p className="text-amber-300 font-bold">
                  <strong>Tổng thanh toán:</strong> {formatVnd(activeBooking.totalAmountVnd)}
                </p>
              </div>

              {/* QR Code for Check-in scanning */}
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-3">
                <div className="w-16 h-16 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
                  <QrCode className="w-14 h-14 text-stone-950" />
                </div>
                <div className="text-[11px] text-stone-400">
                  Xuất trình mã QR này tại trạm xe điện buggy hoặc cổng Tháp Xá Lợi để check-in.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  alert('Vé điện tử đã được lưu vào bộ nhớ thiết bị của bạn!');
                  setShowSuccessPassModal(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{t.booking.savePass}</span>
              </button>

              <button
                onClick={() => setShowSuccessPassModal(false)}
                className="text-xs text-stone-400 hover:text-stone-200"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
