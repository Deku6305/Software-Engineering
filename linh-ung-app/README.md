# Linh Ứng Pagoda – App thuyết minh tự động (React Native / Expo)

```
linh-ung-app/
├─ docker-compose.yml     # PostgreSQL + API (Node) + Adminer
├─ .env.example           # copy thành .env
├─ database/initdb/       # 01_schema.sql, 02_seed.sql (tự chạy lần đầu)
├─ backend/               # Express API (JWT, Gemini, routing proxy)
└─ frontend/              # Expo (React Native) – 3 khu vực tách biệt
   ├─ app/user/           # Trang khách (không đăng nhập)
   ├─ app/admin/          # Trang admin (đăng nhập)
   ├─ app/staff/          # Trang staff (đăng nhập, quét QR)
   └─ src/                # code dùng chung (api, i18n, ui) + src/user
```

## 1. Chạy backend + database (Docker)
```bash
cp .env.example .env          # điền GEMINI_API_KEY (https://aistudio.google.com/apikey)
docker compose up -d --build
curl http://localhost:4000/api/health
```
- Adminer: http://localhost:8080 (server `db`, user/pass/db trong `.env`)
- Reset dữ liệu: `docker compose down -v && docker compose up -d --build`

## 2. Chạy app (hiện mã QR ở terminal)
```bash
cd frontend
npm install
npm run setup        # cài đúng phiên bản thư viện theo Expo SDK hiện hành
npm start            # => terminal hiện mã QR
```
Cài **Expo Go** trên điện thoại (cùng Wi-Fi với máy tính), quét QR → vào thẳng **trang khách**.
App tự lấy IP máy chạy Expo để gọi API cổng 4000. Nếu dùng tunnel/backend máy khác:
`EXPO_PUBLIC_API_URL=http://<ip>:4000 npm start`.

## 3. Ba trang tách biệt
| Trang | Đường dẫn | Đăng nhập |
|---|---|---|
| Khách | `/user` (mặc định khi quét QR) | không |
| Staff | `/staff` | `staff1@demo.com` / `123456` |
| Admin | `/admin` | `admin1@demo.com` / `123456` |

Link staff/admin nằm ở cuối trang Khám phá; hoặc mở trực tiếp `exp://<ip>:8081/--/staff`, `exp://<ip>:8081/--/admin`.

## Tính năng
**Khách**: thuyết minh đa ngôn ngữ (vi/en/zh/ko) – audio kéo từ API `/api/pois/:id/narration` (file WAV do Gemini TTS sinh & cache, nếu chưa có thì dùng giọng đọc của máy); tự bật popup thuyết minh khi vào bán kính POI (mặc định 10 m, dùng nút *Giả lập* để thử trong nhà); bản đồ + chỉ đường đi bộ (OSRM) + tuyến gợi ý; đặt cơm chay / xe điện / hướng dẫn viên kèm SĐT → nhận mã QR; chatbot Gemini trả lời theo ngôn ngữ đang chọn.
Nếu ngôn ngữ chưa có bản thuyết minh, backend nhờ Gemini dịch từ bản gốc rồi lưu vào DB.

**Staff**: quét QR check-in (hoặc nhập mã đơn), xem đơn chờ thanh toán (có SĐT bấm gọi), bấm "Đã nhận tiền" để kích hoạt QR.

**Admin**: số người đang truy cập (heartbeat 2 phút), tổng lượt nghe từng thuyết minh theo ngôn ngữ, doanh thu theo dịch vụ & theo ngày, danh sách đơn, thêm/xoá POI (tự thêm vào tuyến toàn cảnh).

## Luồng đặt dịch vụ
Khách đặt (SĐT bắt buộc) → đơn `pending` hiện ngay ở tab *Đơn* của staff/admin (tự làm mới 8 giây) → khách chuyển khoản theo `BANK_INFO` với nội dung = mã đơn → staff xác nhận → `paid` → quét QR → `used`. Doanh thu chỉ tính đơn `paid`/`used`.

## Lưu ý
- Nội dung thuyết minh, toạ độ, giá là **dữ liệu mẫu** – cần kiểm chứng/chỉnh bằng toạ độ thực tế.
- GPS trong khuôn viên có sai số vài mét; bán kính 10 m có thể chỉnh khi thêm POI.
- Đổi `JWT_SECRET`, mật khẩu DB và mật khẩu demo trước khi triển khai thật.
- Tên model Gemini/TTS đặt trong `.env` (`GEMINI_MODEL`, `GEMINI_TTS_MODEL`) – đổi nếu Google đổi tên model.
