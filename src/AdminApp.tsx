import React, { useState } from 'react';
import { AdminPortalView } from './components/AdminPortalView.tsx';
import { MobileAppQrModal } from './components/MobileAppQrModal.tsx';
import {
  ArrowLeft,
  Database,
  QrCode,
  DollarSign,
  Container,
  Layers,
  Terminal,
  Server,
  Sparkles,
  ExternalLink,
  Table,
  CheckCircle2,
  HardDrive,
  Smartphone
} from 'lucide-react';

interface AdminAppProps {
  onNavigateToVisitor: () => void;
  onSimulateScanCode?: (code: string) => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({
  onNavigateToVisitor,
  onSimulateScanCode
}) => {
  const [activeAdminSection, setActiveAdminSection] = useState<'main_portal' | 'database_docker'>('main_portal');
  const [isMobileQrOpen, setIsMobileQrOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Dedicated Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-stone-900 border-b border-amber-900/40 text-stone-100 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Brand & Admin Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToVisitor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:border-amber-500/50 text-xs font-semibold text-amber-300 hover:bg-stone-850 transition-colors shrink-0"
              title="Quay lại giao diện dành cho Khách Tham Quan"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Giao Diện Khách Quan</span>
            </button>

            <div className="h-5 w-px bg-stone-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-lg">🪷</span>
              <span className="font-bold text-sm sm:text-base text-stone-100 font-serif-sacred">
                Cổng Quản Trị Chùa Linh Ứng
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Admin Panel (UC15 & UC16)
              </span>
            </div>
          </div>

          {/* Top Bar Switcher & Mobile QR button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileQrOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:border-amber-500/50 text-xs font-semibold text-stone-300 hover:text-amber-400 transition-colors shrink-0"
              title="Quét mã QR để mở app trên điện thoại"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">📱 Mở Trên ĐT</span>
            </button>

            <div className="flex items-center bg-stone-950 border border-stone-800 rounded-lg p-1">
              <button
                onClick={() => setActiveAdminSection('main_portal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${activeAdminSection === 'main_portal'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-stone-100'
                  }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Nghiệp Vụ Quản Trị</span>
              </button>

              <button
                onClick={() => setActiveAdminSection('database_docker')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${activeAdminSection === 'database_docker'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-stone-100'
                  }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1">
                  <span>Cơ Sở Dữ Liệu & Docker</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeAdminSection === 'main_portal' ? (
          <AdminPortalView
            currentLang="vi"
            onSimulateScanCode={onSimulateScanCode}
          />
        ) : (
          /* ========================================================================= */
          /* DOCKER & DATABASE MANAGEMENT DASHBOARD                                    */
          /* ========================================================================= */
          <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-500 font-medium mb-1">
                <span>Kiến Trúc Hạ Tầng Docker & PostgreSQL</span>
                <span aria-hidden="true">·</span>
                <span>Quản Lý Bảng Dữ Liệu Hệ Thống</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-sacred text-stone-100 flex items-center gap-2.5">
                <Database className="w-6 h-6 text-amber-400" />
                <span>Bảng Dữ Liệu & Cấu Hình Docker Container</span>
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Hệ thống dữ liệu cho phép khởi chạy độc lập qua Docker Compose với PostgreSQL 16 và công cụ trực quan hóa Adminer.
              </p>
            </div>

            {/* Docker Containers Architecture Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: PostgreSQL Service */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                      <Database className="w-4 h-4" />
                      <span>PostgreSQL Database</span>
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                      Port 5432
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-200 mb-1">
                    Container: linhung-postgres-db
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed mb-3">
                    Lưu trữ bảng dữ liệu di tích, mã QR, nhật ký quét, đơn đặt vé và chỉ số doanh thu với volume lưu trữ vĩnh viễn <code className="text-amber-300 font-mono">pgdata</code>.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-stone-400 border-t border-stone-800 pt-2 flex justify-between">
                  <span>DB: linhung_pagoda</span>
                  <span>User: admin</span>
                </div>
              </div>

              {/* Box 2: Adminer Web UI */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                      <Table className="w-4 h-4" />
                      <span>Trình Xem Bảng Web (Adminer)</span>
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300">
                      Port 8080
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-200 mb-1">
                    Container: linhung-db-viewer
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed mb-3">
                    Giao diện web trực quan giúp ban quản lý xem bảng, sửa dữ liệu, xuất file SQL/CSV và chạy truy vấn dữ liệu trực tiếp trong trình duyệt.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-sky-400 border-t border-stone-800 pt-2">
                  <span>Truy cập: http://localhost:8080</span>
                </div>
              </div>

              {/* Box 3: Redis Bus */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                      <Server className="w-4 h-4" />
                      <span>Redis Event Bus & Cache</span>
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-400">
                      Port 6379
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-200 mb-1">
                    Container: linhung-redis-bus
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed mb-3">
                    Đồng bộ sự kiện Pub/Sub thời gian thực giữa các vi dịch vụ (Microservices): soát vé, quét mã QR và cập nhật doanh thu tự động.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-stone-400 border-t border-stone-800 pt-2">
                  <span>Mạng: pagoda-internal-mesh</span>
                </div>
              </div>
            </div>

            {/* Database Tables Schema Viewer */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-stone-800 bg-stone-900/60 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
                  <Table className="w-4 h-4 text-amber-500" />
                  <span>Cấu Trúc Các Bảng Dữ Liệu (Database Tables) Trong `sql/init.sql`</span>
                </h3>
                <span className="text-xs font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                  4 Bảng Chính
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-800">
                {/* Table 1: monuments_poi */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">1. monuments_poi</span>
                    <span className="text-[10px] text-stone-400">UC15: Di tích & QR</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Lưu trữ thông tin chi tiết di tích, tọa độ GPS, mã QR nhận diện và số lượt quét.
                  </p>
                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800/80 font-mono text-[11px] text-stone-300 space-y-1">
                    <div>• <strong>id</strong>: VARCHAR(64) [PRIMARY KEY]</div>
                    <div>• <strong>code</strong>: VARCHAR(32) [UNIQUE] (VD: LU-QUANAM-01)</div>
                    <div>• <strong>name_vi / name_en</strong>: VARCHAR(255)</div>
                    <div>• <strong>category</strong>: VARCHAR(50) (monument, temple...)</div>
                    <div>• <strong>lat / lng / map_x / map_y</strong>: Tọa độ GPS & sơ đồ</div>
                    <div>• <strong>audio_duration_seconds</strong>: INT</div>
                    <div>• <strong>scan_count</strong>: INT DEFAULT 0 (Lượt quét QR)</div>
                  </div>
                </div>

                {/* Table 2: booking_orders */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">2. booking_orders</span>
                    <span className="text-[10px] text-stone-400">UC16: Vé & Doanh thu</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Lưu trữ đơn hàng, khách mua vé xe điện buggy, hoa đăng, trạng thái thanh toán và check-in.
                  </p>
                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800/80 font-mono text-[11px] text-stone-300 space-y-1">
                    <div>• <strong>booking_id</strong>: VARCHAR(32) [PRIMARY KEY] (LU-BKG-...)</div>
                    <div>• <strong>customer_name / phone / email</strong></div>
                    <div>• <strong>ticket_id / ticket_name</strong>: Gói dịch vụ đã chọn</div>
                    <div>• <strong>quantity / total_amount_vnd</strong>: Số lượng & tiền</div>
                    <div>• <strong>status</strong>: PENDING_PAYMENT | PAID | CHECKED_IN</div>
                    <div>• <strong>qr_ticket_code</strong>: Mã QR vé vào cổng chùa</div>
                    <div>• <strong>visit_date / checked_in_at</strong>: Mốc thời gian</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-800 border-t border-stone-800">
                {/* Table 3: ticket_packages */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-400">3. ticket_packages</span>
                    <span className="text-[10px] text-stone-400">Danh mục dịch vụ</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Các gói vé: Xe điện buggy khứ hồi, vé tháp xá lợi, hoa đăng hoàng hôn, smart headset, cơm chay.
                  </p>
                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800/80 font-mono text-[11px] text-stone-300 space-y-1">
                    <div>• <strong>id</strong>: VARCHAR(64) [PRIMARY KEY]</div>
                    <div>• <strong>name_vi / name_en</strong>: Tên dịch vụ</div>
                    <div>• <strong>price_vnd</strong>: INT (Giá vé niêm yết)</div>
                    <div>• <strong>category</strong>: transport | exhibition | experience</div>
                    <div>• <strong>badge / duration_text</strong>: Mô tả thời gian sử dụng</div>
                  </div>
                </div>

                {/* Table 4: qr_scans_log */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-400">4. qr_scans_log</span>
                    <span className="text-[10px] text-stone-400">Nhật ký quét</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Lưu lịch sử mỗi lần du khách quét QR nghe thuyết minh để phân tích lưu lượng tham quan.
                  </p>
                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800/80 font-mono text-[11px] text-stone-300 space-y-1">
                    <div>• <strong>id</strong>: SERIAL [PRIMARY KEY]</div>
                    <div>• <strong>poi_id / poi_code</strong>: Điểm di tích được quét</div>
                    <div>• <strong>scanned_at</strong>: TIMESTAMP WITH TIME ZONE</div>
                    <div>• <strong>device_lang</strong>: Ngôn ngữ thiết bị du khách</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Docker Commands Quick Start */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2 mb-3">
                <Terminal className="w-4 h-4 text-amber-500" />
                <span>Hướng Dẫn Chạy Docker Để Tạo Bảng Dữ Liệu Mới</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-stone-300 font-semibold mb-1">
                    1. Khởi chạy cơ sở dữ liệu PostgreSQL & giao diện Adminer:
                  </div>
                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-emerald-400 select-all">
                    docker compose up -d db adminer
                  </div>
                </div>

                <div>
                  <div className="text-stone-300 font-semibold mb-1">
                    2. Xem bảng dữ liệu và chỉnh sửa trực tiếp qua trình duyệt web:
                  </div>
                  <p className="text-stone-400 mb-1">
                    Mở trình duyệt truy cập: <code className="text-sky-400 font-mono">http://localhost:8080</code>
                  </p>
                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-stone-300 space-y-0.5">
                    <div>• Hệ quản trị: <strong>PostgreSQL</strong></div>
                    <div>• Máy chủ (Server): <strong>db</strong></div>
                    <div>• Người dùng (Username): <strong>admin</strong></div>
                    <div>• Mật khẩu (Password): <strong>adminpassword</strong></div>
                    <div>• Cơ sở dữ liệu (Database): <strong>linhung_pagoda</strong></div>
                  </div>
                </div>

                <div>
                  <div className="text-stone-300 font-semibold mb-1">
                    3. Kiểm tra nhật ký container database:
                  </div>
                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-amber-400 select-all">
                    docker compose logs -f db
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal to scan QR code on mobile phone */}
      <MobileAppQrModal
        isOpen={isMobileQrOpen}
        onClose={() => setIsMobileQrOpen(false)}
        initialRoute="admin"
      />
    </div>
  );
};
