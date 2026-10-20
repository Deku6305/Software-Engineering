# Linh Ứng Smart Guide — Đồ án Công nghệ Phần mềm

Đồ án môn **Công nghệ Phần mềm**, nghiên cứu và xây dựng hệ sinh thái hướng dẫn tham quan & thuyết minh thông minh tại **Chùa Linh Ứng Bãi Bụt (bán đảo Sơn Trà, TP. Đà Nẵng)**. Ứng dụng minh họa các tính năng quét mã QR di tích, thuyết minh âm thanh đa ngôn ngữ (TTS), bản đồ chỉ đường chống lạc, AR thực tế tăng cường định vị tâm linh, đặt vé dịch vụ xe điện buggy và trợ lý ảo Chatbot AI trên nền tảng kiến trúc microservices và quy trình tự động hóa CI/CD.

## Công nghệ và kiến trúc

```text
React 19 / TypeScript / Vite 8 / Tailwind CSS 4
    ├── Web Speech API + Server Audio Stream (TTS)
    ├── Device Orientation & WebRTC Camera (AR & QR Scanner)
    └── Interactive Vector & GPS Route Map (Chỉ đường chống lạc)
            ↓
Node.js 22 + Express 4 → EventBus Pub/Sub → Microservices Layer
    ├── poiAudioService: 8 di tích POI, QR registry & 6 ngôn ngữ (vi, en, zh, ko, ja, fr)
    ├── navigationService: thuật toán tìm đường ngắn nhất & gợi ý hành trình
    ├── bookingService & paymentService: quản lý vé xe điện buggy & cổng thanh toán
    ├── ttsService: phân đoạn văn bản thông minh & bộ đệm âm thanh MP3
    ├── chatAiService: Google Gemini 2.5 Flash + fallback tri thức Phật giáo bản địa
    └── cicdService & metricsService: giám sát vận hành microservices & pipeline CI/CD
```

Bảy phân hệ chính: POI & Audio Narration, QR Code Scanner, Map Navigation, AR Spatial View, Booking & Ticketing, Chatbot AI và CI/CD Operations Engine. Xem [kiến trúc ca sử dụng](img/usecase.png), [sơ đồ phân tích thanh toán & POI](CNPM-thanhtoan-POI.drawio), [cấu hình Docker Compose](docker-compose.yml) và [manifest Kubernetes](k8s/deployment.yaml).

## Cài đặt và chạy

Yêu cầu: Node.js 22+ và npm 10+. Docker Desktop là tùy chọn nếu muốn đóng gói container và Redis. Các lệnh dưới đây có thể chạy trên PowerShell (Windows) hoặc Bash (Linux/macOS), bắt đầu tại thư mục gốc của project.

**Chuẩn bị máy mới và clone**

| Công cụ | Vai trò |
| --- | --- |
| Git | Clone và quản lý source code project |
| Node.js 22+ và npm | Chạy backend Express và build frontend Vite |
| Docker & Docker Compose | Đóng gói container ứng dụng và Redis bus (tùy chọn) |
| VS Code / Trình soạn thảo | Môi trường phát triển và debug source code |
| Trình duyệt web hiện đại | Hỗ trợ WebRTC (Camera QR/AR), Geolocation và Web Speech |

```powershell
git clone https://github.com/Deku6305/Software-Engineering.git
cd Software-Engineering
node --version
npm --version
docker compose version
```

Sau khi clone, thực hiện lần lượt các bước dưới đây để khởi chạy hệ thống:

**1. Cài đặt thư viện và cấu hình môi trường**

```powershell
npm install
Copy-Item .env.example .env
# Trên Linux/macOS: cp .env.example .env
```

Tệp `.env` đã được cấu hình sẵn các giá trị mặc định (`PORT=3000`, `NODE_ENV=development`). Tùy chọn điền thêm `GEMINI_API_KEY` nếu muốn Chatbot AI kết nối trực tiếp với mô hình Gemini của Google (nếu để trống, hệ thống tự động kích hoạt bộ tri thức chuyên sâu offline có sẵn).

**2. Chạy ứng dụng phát triển (Development Mode)**

```powershell
npm run dev
```

Mở trình duyệt tại `http://localhost:3000`. Hệ thống phục vụ đồng thời cả hai phân hệ độc lập:
- **Giao diện Khách Tham Quan (Visitor):** `http://localhost:3000/` (file riêng `src/VisitorApp.tsx`)
- **Cổng Quản Trị Viên (Admin Portal):** `http://localhost:3000/admin` (file riêng `src/AdminApp.tsx`)
- Kiểm tra sức khỏe hệ thống: `http://localhost:3000/api/health`
- API Danh mục di tích & QR: `http://localhost:3000/api/pois?lang=vi`
- API Doanh thu & Đặt vé: `http://localhost:3000/api/admin/revenue`

**3. Chạy qua Docker Compose & Khởi Tạo Bảng Dữ Liệu PostgreSQL**

Hệ thống cung cấp sẵn file `sql/init.sql` và cấu hình `docker-compose.yml` để tạo đầy đủ các bảng dữ liệu (`monuments_poi`, `ticket_packages`, `booking_orders`, `qr_scans_log`):

```powershell
# Khởi chạy Database PostgreSQL và công cụ quản lý bảng dữ liệu Adminer
docker compose up -d db adminer

# Xem trạng thái các container
docker compose ps
```

- **PostgreSQL Database:** Chạy trên cổng `5432` (`linhung_pagoda`, user: `admin`, pass: `adminpassword`).
- **Trình Quản Lý Bảng Dữ Liệu Trực Quan (Adminer Web UI):** Mở `http://localhost:8080`, chọn hệ quản trị **PostgreSQL**, nhập máy chủ `db`, tài khoản `admin` / `adminpassword` để xem và thao tác trực tiếp trên các bảng dữ liệu.
- Khởi chạy toàn bộ hệ thống bao gồm app web, database và redis: `docker compose up -d`.
- Dừng container: `docker compose down`.

## Quét mã QR và Thuyết minh giọng nói (TTS)

Hệ thống cho phép du khách tiếp cận nội dung di tích nhanh chóng bằng 2 hình thức:
1. **Quét mã QR tại chỗ:** Sử dụng camera trên thiết bị hoặc tải ảnh mã QR. Mỗi bia di tích tại chùa được gắn một mã định danh (ví dụ `LU-QUANAM-01` cho Tượng Phật Bà). Sau khi quét thành công, hệ thống tự động mở bài thuyết minh và phát âm thanh.
2. **Thuyết minh đa ngôn ngữ:** Hỗ trợ 6 ngôn ngữ chuẩn quốc tế (**Tiếng Việt, English, 中文, 한국어, 日本語, Français**). Giọng đọc được sinh tự động thông qua Web Speech Synthesis kết hợp dịch vụ máy chủ `/api/tts` có cơ chế đệm cache tối ưu độ trễ. Du khách có thể tùy chỉnh tốc độ đọc (0.8x, 1.0x, 1.25x, 1.5x) và thanh tiến trình thời gian thực.

## Dữ liệu mẫu và Danh mục di tích (POI)

Hệ thống được nạp sẵn danh mục 8 điểm di tích trọng điểm và các gói dịch vụ tại Chùa Linh Ứng:

| Mã QR | Tên Di tích (POI) | Điểm nổi bật & Ý nghĩa phong thủy |
| --- | --- | --- |
| `LU-QUANAM-01` | Tượng Phật Bà Quan Thế Âm 67m | Cao 67m (tương đương 30 tầng), đài sen 35m, 17 tầng tháp thờ 357 tượng Phật |
| `LU-CHANHDIEN-02` | Chánh Điện Linh Ứng Bãi Bụt | Kiến trúc nóc uốn lượn hình rồng, tôn tượng Thích Ca, Quan Âm và Địa Tạng |
| `LU-THAPXALOI-03` | Tháp Xá Lợi 9 Tầng | Cao 30m, thờ xá lợi Phật Thích Ca và chư vị Bồ Tát linh thiêng |
| `LU-18LAHAN-04` | Vườn 18 Vị La Hán | 18 pho tượng đá trắng nguyên khối thể hiện đủ sắc thái hỷ, nộ, ái, ố |
| `LU-CONGTAMQUAN-05` | Cổng Tam Quan Bãi Bụt | Cổng chính 3 lối vào hướng ra biển Đông, lợp ngói âm dương truyền thống |
| `LU-CATHUVO-06` | Mộ Cá Ông (Cá Voi) | Biểu tượng tâm linh che chở ngư dân vạn chài miền Trung xuất phát từ thế kỷ 19 |
| `LU-VONGCANH-07` | Đài Vọng Cảnh Biển Đông | Tọa độ ngắm hoàng hôn, bình minh và trọn vẹn vịnh biển Đà Nẵng từ độ cao 150m |
| `LU-TRAMXEDIEN-08` | Trạm Xe Điện Buggy Bãi Bụt | Điểm trung chuyển đón trả khách tham quan và hỗ trợ người cao tuổi |

**Các gói dịch vụ tham quan & trải nghiệm:**
- `ticket_buggy_shuttle`: Vé Xe Điện Buggy Bãi Bụt & Sơn Trà (Khứ hồi) — 50.000 VNĐ
- `ticket_audio_device`: Bộ Thu Thuyết Minh Không Dây Chuẩn Bảo Tàng — 40.000 VNĐ
- `ticket_sunset_lantern`: Combo Hoàng Hôn & Thả Hoa Đăng Cầu Bình An — 80.000 VNĐ
- `ticket_chay_buffet`: Phiếu Trải Nghiệm Ẩm Thực Chay Thiền Viện — 65.000 VNĐ

## Hướng dẫn sử dụng

1. **Khám phá Di tích (Monuments):** Xem danh bạ các điểm tham quan, chuyển đổi ngôn ngữ linh hoạt, nhấn nút phát âm thanh để nghe thuyết minh giới thiệu lịch sử và sự tích di tích.
2. **Quét mã QR (QR Scanner):** Mở tab Quét QR, hướng camera về phía mã QR tại bia di tích hoặc chọn nút mã mẫu để trải nghiệm tự động kích hoạt bài thuyết minh tương ứng.
3. **Bản đồ & Chỉ đường chống lạc (Map & Navigation):** Xem bản đồ tương tác với các mốc tọa độ thực tế, chọn điểm xuất phát và điểm đến để thuật toán tính toán lộ trình ngắn nhất, hiển thị khoảng cách mét, số phút đi bộ và các bước chỉ dẫn turn-by-turn.
4. **Trải nghiệm AR (AR Experience):** Sử dụng camera kết hợp cảm biến con quay hồi chuyển của điện thoại để hiển thị các biển chỉ dẫn không gian nổi 3D hướng về Tượng Phật Bà Quan Âm và Chánh Điện.
5. **Đặt vé & Dịch vụ (Tickets):** Chọn gói dịch vụ xe điện buggy hoặc hoa đăng, nhập tên và số điện thoại, thanh toán qua cổng quét mã QR ngân hàng mô phỏng và nhận vé điện tử kèm mã QR check-in.
6. **Trợ lý ảo AI (Chatbot):** Đặt câu hỏi trực tiếp về lịch sử chùa, quy định trang phục kín đáo khi vào Chánh Điện, giờ mở cửa (06:00 - 21:00 miễn phí vé vào cổng) và quy tắc bảo tồn động vật hoang dã (khỉ, voọc chà vá chân nâu).

## Thử bằng REST API

Hệ thống cung cấp đầy đủ các endpoint RESTful phục vụ cho các ứng dụng client:

1. **Kiểm tra sức khỏe hệ thống:**
   - `GET /api/health` — Trả về trạng thái uptime, phiên bản Node.js và số lượng vi dịch vụ đang hoạt động.
2. **Dữ liệu di tích và thuyết minh:**
   - `GET /api/pois?lang=vi` — Danh sách toàn bộ di tích theo ngôn ngữ (`vi`, `en`, `zh`, `ko`, `ja`, `fr`).
   - `GET /api/pois/qr/LU-QUANAM-01?lang=vi` — Truy vấn chi tiết di tích từ mã QR quét được.
   - `GET /api/tts?text=Chùa Linh Ứng&lang=vi` — Sinh luồng âm thanh MP3 phục vụ thuyết minh giọng đọc tự nhiên.
3. **Chỉ đường và lộ trình:**
   - `GET /api/navigation/route?from=poi_cong_tamquan&to=poi_quanam_67m&lang=vi` — Tính toán lộ trình ngắn nhất giữa 2 điểm.
   - `GET /api/navigation/itineraries?lang=vi` — Lấy danh sách lộ trình tham quan gợi ý (30 phút, 60 phút, 90 phút).
4. **Đặt vé và thanh toán:**
   - `GET /api/tickets?lang=vi` — Danh mục các gói vé dịch vụ khả dụng.
   - `POST /api/bookings` — Tạo đơn đặt vé mới với thông tin khách hàng và số lượng.
   - `POST /api/payment/initiate` — Khởi tạo giao dịch thanh toán mã QR.
   - `POST /api/payment/confirm` — Xác nhận thanh toán thành công và kích hoạt mã vé điện tử.
5. **Trang Quản Trị Viên (Admin Portal - UC15 & UC16):**
   - `GET /api/admin/pois` — Quản lý điểm di tích, danh sách mã QR và số lượt khách đã quét.
   - `POST /api/admin/pois` — Thêm mới điểm di tích vào hệ thống thuyết minh.
   - `PUT /api/admin/pois/:id` — Chỉnh sửa thông tin di tích, tọa độ sơ đồ và nội dung thuyết minh.
   - `DELETE /api/admin/pois/:id` — Xóa điểm di tích khỏi hệ thống.
   - `GET /api/admin/revenue` — Báo cáo thống kê doanh thu theo ngày/tuần, cơ cấu gói vé và kênh thanh toán.
   - `GET /api/admin/bookings` — Quản lý danh sách đơn đặt vé, tìm kiếm và lọc trạng thái.
   - `POST /api/admin/bookings/check-in` — Soát vé check-in tại cổng chùa bằng mã đơn hoặc mã QR vé.
   - `PATCH /api/admin/bookings/:id/status` — Cập nhật trạng thái thanh toán hoặc hoàn hủy đơn vé.
6. **Chatbot AI và Vận hành CI/CD:**
   - `POST /api/chat` — Gửi câu hỏi đến trợ lý ảo thông minh.
   - `GET /api/cicd/pipelines` — Xem lịch sử các đợt build và triển khai tự động hóa.

## Kiểm thử

```powershell
# Kiểm tra định kiểu TypeScript và cú pháp toàn bộ dự án
npm run lint

# Đóng gói bản dựng production frontend
npm run build

# Khởi động và kiểm tra phản hồi API máy chủ
npm run start
```

Kiểm tra tự động kiểm chứng luồng dữ liệu microservices:
```powershell
# Kiểm tra nhanh endpoint sức khỏe hệ thống
curl http://localhost:3000/api/health

# Kiểm tra dữ liệu POI đa ngôn ngữ
curl "http://localhost:3000/api/pois?lang=vi"
```

CI/CD Pipeline trên GitHub Actions (`.github/workflows/ci-cd.yml`) tự động thực hiện 6 bước kiểm thử: Lint & Typecheck, Unit & Integration Tests, SAST Security Audit, Docker Build, Canary Deployment và Production Rollout.

## Tài liệu và giới hạn

- [Sơ đồ Ca Sử Dụng](img/usecase.png): Thiết kế tổng quan các chức năng cho du khách và hệ thống quản trị.
- [Sơ đồ Phân tích Thanh toán & POI](CNPM-thanhtoan-POI.drawio): Luồng dữ liệu nghiệp vụ vé tham quan và định vị di tích.
- [Quy trình CI/CD Pipeline](.github/workflows/ci-cd.yml): Kịch bản tự động hóa kiểm thử và phát hành phiên bản.
- [Manifest Kubernetes](k8s/deployment.yaml): Thiết lập Deployment 3 bản sao (replicas), rolling update và Service trong cụm K8s.
- [Giới hạn kỹ thuật]: Web AR chạy trên lớp canvas giả lập 3D dựa vào API con quay hồi chuyển và camera của trình duyệt; dữ liệu đơn vé và sự kiện vi dịch vụ lưu trữ in-memory phục vụ mục đích kiểm thử và demo đồ án; giọng đọc TTS tối ưu theo từng phân đoạn câu ngắn để phản hồi nhanh trên thiết bị di động.

## Xử lý sự cố

| Hiện tượng | Kiểm tra |
| --- | --- |
| Không mở được Camera quét QR / AR | Kiểm tra quyền truy cập Camera của trình duyệt tại `chrome://settings/content/camera`, đảm bảo kết nối qua `localhost` hoặc `https://` |
| Không nghe thấy giọng đọc thuyết minh | Kiểm tra âm lượng thiết bị; chuyển đổi giữa Web Speech API của trình duyệt hoặc audio stream `/api/tts` |
| Báo lỗi cổng 3000 đã bị chiếm dụng | Thay đổi biến `PORT=3001` trong file `.env` hoặc tắt tiến trình Node.js đang chạy ngầm |
| Chatbot trả về câu trả lời mẫu định sẵn | Kiểm tra biến `GEMINI_API_KEY` trong file `.env`. Nếu không có key, hệ thống vẫn hoạt động bình thường với bộ tri thức chùa Linh Ứng tích hợp sẵn |
| Bản đồ không cập nhật vị trí GPS thực tế | Cấp quyền Geolocation cho trình duyệt hoặc sử dụng chế độ chỉ đường tĩnh theo các điểm di tích |
| Không kết nối được Redis trong Docker | Kiểm tra trạng thái container bằng `docker compose ps`, đảm bảo cổng 6379 không bị xung đột |
