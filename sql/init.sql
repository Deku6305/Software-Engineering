-- ============================================================================
-- Hệ Thống Cơ Sở Dữ Liệu Chùa Linh Ứng Bãi Bụt - Sơn Trà (PostgreSQL Schema)
-- Phục vụ: UC15 (Quản lý điểm di tích & QR) và UC16 (Quản lý đặt vé & doanh thu)
-- ============================================================================

-- Bật extension UUID nếu cần
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG DI TÍCH & ĐIỂM THAM QUAN (UC15: Quản lý di tích & mã QR)
DROP TABLE IF EXISTS qr_scans_log CASCADE;
DROP TABLE IF EXISTS booking_orders CASCADE;
DROP TABLE IF EXISTS ticket_packages CASCADE;
DROP TABLE IF EXISTS monuments_poi CASCADE;

CREATE TABLE monuments_poi (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL, -- Mã QR nhận diện (VD: LU-QUANAM-01)
    name_vi VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    title_tag VARCHAR(255),
    category VARCHAR(50) NOT NULL DEFAULT 'monument', -- monument, temple, nature, viewpoint, relic
    lat DECIMAL(10, 6) NOT NULL,
    lng DECIMAL(10, 6) NOT NULL,
    map_x INT NOT NULL DEFAULT 50, -- Tọa độ 0-100% trên sơ đồ chùa
    map_y INT NOT NULL DEFAULT 50,
    elevation_meters INT DEFAULT 120,
    compass_bearing INT DEFAULT 90,
    audio_duration_seconds INT DEFAULT 150,
    audio_voice_file VARCHAR(255),
    image_url TEXT,
    brief_vi TEXT,
    full_history_vi TEXT,
    spiritual_meaning_vi TEXT,
    visiting_tips_vi TEXT,
    ar_model_type VARCHAR(50) DEFAULT 'lotus_halo',
    scan_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG GÓI VÉ & DỊCH VỤ THAM QUAN (UC10 & UC16)
CREATE TABLE ticket_packages (
    id VARCHAR(64) PRIMARY KEY,
    name_vi VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    price_vnd INT NOT NULL,
    original_price_vnd INT,
    category VARCHAR(50) NOT NULL, -- transport, exhibition, experience, audio_device, dining
    duration_text VARCHAR(100),
    badge VARCHAR(50),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG ĐƠN ĐẶT VÉ & THANH TOÁN (UC16: Quản lý đơn đặt vé & doanh thu)
CREATE TABLE booking_orders (
    booking_id VARCHAR(32) PRIMARY KEY, -- Mã đơn hàng (VD: LU-BKG-883192)
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_email VARCHAR(150),
    ticket_id VARCHAR(64) REFERENCES ticket_packages(id) ON DELETE RESTRICT,
    ticket_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_amount_vnd INT NOT NULL CHECK (total_amount_vnd >= 0),
    payment_method VARCHAR(50), -- VIETQR, VNPAY, MOMO, ZALOPAY, CASH
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT', -- PENDING_PAYMENT, PAID, CHECKED_IN, CANCELLED
    qr_ticket_code VARCHAR(128) UNIQUE NOT NULL, -- Mã QR vé điện tử của khách
    visit_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE,
    checked_in_at TIMESTAMP WITH TIME ZONE
);

-- 4. BẢNG NHẬT KÝ QUÉT MÃ QR (Scan Analytics)
CREATE TABLE qr_scans_log (
    id SERIAL PRIMARY KEY,
    poi_id VARCHAR(64) REFERENCES monuments_poi(id) ON DELETE CASCADE,
    poi_code VARCHAR(32) NOT NULL,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    device_lang VARCHAR(10) DEFAULT 'vi',
    ip_address VARCHAR(45)
);

-- ============================================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ============================================================================

-- Thêm các điểm di tích chính Chùa Linh Ứng Bãi Bụt
INSERT INTO monuments_poi (
    id, code, name_vi, name_en, title_tag, category,
    lat, lng, map_x, map_y, elevation_meters, compass_bearing,
    audio_duration_seconds, image_url, brief_vi, full_history_vi,
    spiritual_meaning_vi, visiting_tips_vi, scan_count
) VALUES
(
    'poi_quanam_67m', 'LU-QUANAM-01',
    'Tượng Phật Bà Quan Thế Âm 67m', '67m Lady Buddha Bodhisattva Statue',
    'Biểu tượng tâm linh cao nhất Việt Nam', 'monument',
    16.1001, 108.2778, 62, 38, 135, 85, 195,
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    'Tượng Phật Bà Quan Thế Âm cao 67m, đường kính tòa sen 35m, hướng mặt nhìn ra biển Đông bao bọc bình yên cho ngư dân Đà Nẵng.',
    'Khởi công năm 2004 và hoàn thành năm 2010 dưới sự chủ trì của Cố Thượng tọa Thích Thiện Nguyện. Bên trong tượng có 17 tầng, mỗi tầng thờ 21 bức tượng Phật.',
    'Quan Thế Âm biểu trưng cho hạnh nguyện đại từ đại bi, lắng nghe mọi âm thanh thống khổ để cứu độ chúng sinh.',
    'Nên chiêm bái lúc sáng sớm hoặc hoàng hôn; ăn mặc kín đáo lịch sự.',
    1420
),
(
    'poi_chanhdien', 'LU-CHANHDIEN-02',
    'Chánh Điện Chùa Linh Ứng', 'Main Grand Sanctuary',
    'Trung tâm thờ tự trang nghiêm thanh tịnh', 'temple',
    16.0995, 108.2771, 48, 48, 128, 90, 160,
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
    'Chánh điện lợp mái ngói uốn cong hình rồng cách điệu, thờ tượng Phật Bổn Sư Thích Ca Mâu Ni, Quan Thế Âm và Địa Tạng Vương Bồ Tát.',
    'Công trình kiến trúc Phật giáo kết hợp giữa phong cách truyền thống Đại thừa Việt Nam và nét tinh hoa hiện đại.',
    'Nơi thanh lọc tâm hồn, hướng về điều thiện và gieo mầm an lạc.',
    'Tháo giày dép để ngoài kệ đá trước khi bước vào chiêm bái; không chụp ảnh chính diện tượng Phật khi đang hành lễ.',
    985
),
(
    'poi_thap_xaloi', 'LU-THAPXALOI-03',
    'Tháp Xá Lợi 9 Tầng', '9-Storey Sacred Sarira Pagoda',
    'Bảo tháp lưu giữ ngọc xá lợi linh thiêng', 'relic',
    16.0988, 108.2764, 30, 68, 115, 110, 140,
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
    'Tháp Xá Lợi cao 9 tầng sừng sững bên triền núi Sơn Trà, lưu giữ hàng trăm pho tượng Phật và bảo vật xá lợi cổ truyền.',
    'Được xây dựng theo dáng tháp cổ truyền thống Á Đông, mỗi tầng thờ chư Phật mười phương.',
    'Biểu tượng cho sự thăng hoa tâm linh qua 9 phẩm sen giải thoát.',
    'Thích hợp đi kinh hành niệm Phật quanh chân tháp.',
    762
),
(
    'poi_18_lahan', 'LU-18LAHAN-04',
    'Vườn 18 Vị La Hán', 'Courtyard of 18 Arhat Statues',
    'Quần thể điêu khắc đá non nước tinh xảo', 'monument',
    16.0998, 108.2768, 44, 40, 125, 80, 130,
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    'Hai hàng tượng 18 vị La Hán bằng đá cẩm thạch trắng nguyên khối chạm khắc tỉ mỉ với đủ các biểu cảm hỷ nộ ái ố.',
    'Tác phẩm của các nghệ nhân làng đá mỹ nghệ Non Nước Ngũ Hành Sơn hiến cúng.',
    'Nhắc nhở con người tự soi chiếu bản thân qua các trạng thái tâm thức.',
    'Không trèo lên bệ tượng để chụp ảnh.',
    648
),
(
    'poi_cong_tamquan', 'LU-TAMQUAN-05',
    'Cổng Tam Quan Bãi Bụt', 'Triple Grand Entrance Gate',
    'Cửa ngõ thanh tịnh bước vào cõi Phật', 'monument',
    16.1008, 108.2785, 85, 20, 100, 75, 110,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'Cổng Tam Quan uy nghiêm nhìn thẳng ra bờ biển Hoàng Sa, mở lối vào chốn bồng lai thanh tịnh.',
    'Xây dựng với 3 cửa biểu trưng cho Tam Giải Thoát Môn: Không môn, Vô tướng môn và Vô nguyện môn.',
    'Gác lại muộn phiền trần thế khi bước qua ngưỡng cửa thiền môn.',
    'Điểm chụp ảnh phong cảnh biển và bình minh tuyệt đẹp.',
    534
);

-- Thêm các gói vé & dịch vụ
INSERT INTO ticket_packages (id, name_vi, name_en, price_vnd, original_price_vnd, category, duration_text, badge, image_url) VALUES
('ticket_buggy_shuttle', 'Vé Xe Điện Buggy Bãi Bụt & Sơn Trà (Khứ Hồi)', 'Electric Buggy Shuttle - Roundtrip', 50000, 60000, 'transport', 'Sử dụng trong ngày (Khứ hồi)', 'Bán chạy', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'),
('ticket_xaloi_exhibition', 'Vé Chiêm Bái Bảo Vật & Tháp Xá Lợi 9 Tầng', '9-Story Sarira Relic & Sacred Pass', 30000, NULL, 'exhibition', '45 phút tham quan', 'Linh thiêng', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80'),
('ticket_hoanghon_cau_an', 'Combo Hoàng Hôn Bãi Bụt: Hoa Đăng Cầu An & Trà Thiền', 'Sunset Spiritual Combo: Lantern & Tea', 150000, 180000, 'experience', '75 phút trải nghiệm (17:00 - 18:15)', 'Đặc sắc nhất', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),
('ticket_headset_smart', 'Thuê Thiết Bị Thuyết Minh Thông Minh (Smart Headset)', 'Smart Auto-Trigger Audio Guide', 25000, NULL, 'audio_device', 'Toàn bộ thời gian tham quan', NULL, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'),
('ticket_com_chay_tinh_tam', 'Suất Cơm Chay Tịnh Tâm Nhà Tăng Linh Ứng', 'Serenity Vegetarian Temple Lunch', 60000, NULL, 'dining', 'Phục vụ từ 11:00 - 13:30', 'Thực dưỡng', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80');

-- Thêm các đơn đặt vé mẫu
INSERT INTO booking_orders (
    booking_id, customer_name, customer_phone, customer_email,
    ticket_id, ticket_name, quantity, total_amount_vnd,
    payment_method, status, qr_ticket_code, visit_date,
    created_at, paid_at, checked_in_at
) VALUES
('LU-BKG-883192', 'Nguyễn Văn An', '0905123456', 'an.nguyen@example.com', 'ticket_buggy_shuttle', 'Vé Xe Điện Buggy Bãi Bụt & Sơn Trà (Khứ Hồi)', 2, 100000, 'VIETQR', 'CHECKED_IN', 'PASS_LU-BKG-883192_HASH8934', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours 50 minutes', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'),
('LU-BKG-771204', 'Trần Thị Mai', '0918765432', 'mai.tran@gmail.com', 'ticket_hoanghon_cau_an', 'Combo Hoàng Hôn Bãi Bụt: Hoa Đăng Cầu An & Trà Thiền', 3, 450000, 'VNPAY', 'PAID', 'PASS_LU-BKG-771204_HASH5541', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour 50 minutes', NULL),
('LU-BKG-654891', 'Lê Hoàng Long', '0983112233', 'long.le@outlook.com', 'ticket_xaloi_exhibition', 'Vé Chiêm Bái Bảo Vật & Tháp Xá Lợi 9 Tầng', 4, 120000, 'MOMO', 'CHECKED_IN', 'PASS_LU-BKG-654891_HASH3312', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '6 hours', CURRENT_TIMESTAMP - INTERVAL '5 hours 50 minutes', CURRENT_TIMESTAMP - INTERVAL '4 hours 30 minutes'),
('LU-BKG-542109', 'Park Ji-Hoon', '+82 10 5541 2399', 'jihoon.park@naver.com', 'ticket_headset_smart', 'Thuê Thiết Bị Thuyết Minh Thông Minh (Smart Headset)', 2, 50000, 'VIETQR', 'PAID', 'PASS_LU-BKG-542109_HASH9902', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '50 minutes', NULL),
('LU-BKG-439812', 'Phạm Minh Tuấn', '0935889900', 'tuan.pham@fpt.vn', 'ticket_com_chay_tinh_tam', 'Suất Cơm Chay Tịnh Tâm Nhà Tăng Linh Ứng', 5, 300000, 'VNPAY', 'PENDING_PAYMENT', 'PASS_LU-BKG-439812_HASH6621', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '30 minutes', NULL, NULL);
