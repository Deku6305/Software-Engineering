
**Dự án:** Hệ Sinh Thái Hướng Dẫn Tham Quan & Thuyết Minh Di Tích Thông Minh Chùa Linh Ứng Bãi Bụt — Sơn Trà, TP. Đà Nẵng  
**Tên sản phẩm:** Linh Ứng Pagoda Smart Guide & Narration  
**Môn học:** Công nghệ Phần mềm (Software Engineering)  
**Tác giả / Nhóm phát triển:** Đồ án Công nghệ Phần mềm — Repository: `Deku6305/Software-Engineering`  
**Phiên bản tài liệu:** v1.0.0 (Release)  
**Ngày phát hành:** Tháng 10/2026  
**Trạng thái:** Approved & Production-Ready  

---

## MỤC LỤC
1. [Tổng Quan Sản Phẩm & Bối Cảnh Dự Án (Executive Summary & Background)](#1-tổng-quan-sản-phẩm--bối-cảnh-dự-án)
2. [Mục Tiêu & Chỉ Số Đóng Góp (Product Vision, Goals & OKRs)](#2-mục-tiêu--chỉ-số-đóng-góp)
3. [Chân Dung Người Dùng & Các Bên Liên Quan (User Personas & Stakeholders)](#3-chân-dung-người-dùng--các-bên-liên-quan)
4. [Kiến Trúc Tổng Thể & Luồng Hoạt Động (System Architecture & Workflows)](#4-kiến-trúc-tổng-thể--luồng-hoạt-động)
5. [Yêu Cầu Chức Năng Chi Tiết (Functional Requirements - FR)](#5-yêu-cầu-chức-năng-chi-tiết)
   - [FR-1: Danh mục & Chi tiết Di tích (POI & Monuments)](#fr-1-danh-mục--chi-tiết-di-tích-poi--monuments)
   - [FR-2: Quét Mã QR Di Tích Tức Thời (QR Code Scanner)](#fr-2-quét-mã-qr-di-tích-tức-thời-qr-code-scanner)
   - [FR-3: Động Cơ Thuyết Minh Đa Ngôn Ngữ (Multilingual Audio Narration Engine)](#fr-3-động-cơ-thuyết-minh-đa-ngôn-ngữ-multilingual-audio-narration-engine)
   - [FR-4: Bản Đồ Tương Tác & Lộ Trình Chống Lạc (Interactive Map & Turn-by-Turn Navigation)](#fr-4-bản-đồ-tương-tác--lộ-trình-chống-lạc-interactive-map--turn-by-turn-navigation)
   - [FR-5: Trải Nghiệm Thực Tế Tăng Cường Định Vị (AR Spatial Wayfinding Experience)](#fr-5-trải-nghiệm-thực-tế-tăng-cường-định-vị-ar-spatial-wayfinding-experience)
   - [FR-6: Đặt Vé Dịch Vụ & Cổng Thanh Toán Đa Kênh (Booking & Multi-channel Payment)](#fr-6-đặt-vé-dịch-vụ--cổng-thanh-toán-đa-kênh-booking--multi-channel-payment)
   - [FR-7: Trợ Lý Ảo Chatbot AI Tâm Linh (Gemini 2.5 Flash & Domain Knowledge)](#fr-7-trợ-lý-ảo-chatbot-ai-tâm-linh-gemini-25-flash--domain-knowledge)
   - [FR-8: Bảng Điều Khiển Giám Sát Vi Dịch Vụ & CI/CD Mesh (Microservices & CI/CD Dashboard)](#fr-8-bảng-điều-khiển-giám-sát-vi-dịch-vụ--cicd-mesh-microservices--cicd-dashboard)
6. [Yêu Cầu Phi Chức Năng (Non-Functional Requirements - NFR)](#6-yêu-cầu-phi-chức-năng)
7. [Mô Hình Dữ Liệu & Thiết Kế Thực Thể (Database Schema & ERD)](#7-mô-hình-dữ-liệu--thiết-kế-thực-thể)
8. [Đặc Tả Giao Diện Lập Trình (REST API Specification)](#8-đặc-tả-giao-diện-lập-trình-rest-api-specification)
9. [Chiến Lược Tự Động Hóa CI/CD & Hạ Tầng Triển Khai (DevOps & Deployment Architecture)](#9-chiến-lược-tự-động-hóa-cicd--hạ-tầng-triển-khai)
10. [Kế Hoạch Phát Triển & Quản Trị Rủi Ro (Roadmap & Risk Management)](#10-kế-hoạch-phát-triển--quản-trị-rủi-ro)

---

## 1. TỔNG QUAN SẢN PHẨM & BỐI CẢNH DỰ ÁN

### 1.1. Bối cảnh (Background)
Chùa Linh Ứng Bãi Bụt (bán đảo Sơn Trà, TP. Đà Nẵng) là một trong những trung tâm Phật giáo và điểm đến tâm linh - danh thắng hàng đầu của miền Trung Việt Nam, sở hữu tượng Phật Bà Quan Thế Âm cao 67m ngự trên tòa sen 35m hướng ra biển Đông. Với diện tích khuôn viên rộng lớn hơn 12 hecta tọa lạc trên sườn núi dốc và đón hàng triệu lượt du khách trong và ngoài nước mỗi năm, công tác hướng dẫn tham quan hiện gặp nhiều thách thức:
- **Rào cản ngôn ngữ:** Lượng lớn khách quốc tế đến từ các quốc gia (Hàn Quốc, Trung Quốc, Nhật Bản, Pháp, các nước nói tiếng Anh) thiếu nguồn thuyết minh chính thống, dẫn đến việc hiểu sai lệch ý nghĩa tôn giáo, kiến trúc và phong thủy.
- **Dễ thất lạc và khó định hướng:** Khuôn viên chùa phân tầng với nhiều bậc tam cấp bằng đá, nhiều ngả rẽ giữa Chánh Điện, Tháp Xá Lợi, Vườn 18 Vị La Hán, Đài Vọng Cảnh, gây khó khăn cho việc đi lại, đặc biệt đối với người cao tuổi và trẻ em.
- **Chi phí thiết bị truyền thống cao:** Việc trang bị máy audio guide vật lý tiêu tốn chi phí bảo trì, mất vệ sinh khi dùng chung và phụ thuộc vào nhân sự trực tại quầy.
- **Ùn ứ quầy vé dịch vụ:** Nhu cầu đặt xe điện buggy trung chuyển và các dịch vụ trải nghiệm (thả hoa đăng, ẩm thực chay) thường tập trung đông đúc vào các khung giờ cao điểm hoàng hôn và ngày rằm/lễ hội.

### 1.2. Giải pháp (Proposed Solution)
Đồ án **Linh Ứng Pagoda Smart Guide & Narration** xây dựng một hệ thống Web App thế hệ mới, chạy trực tiếp trên trình duyệt điện thoại của du khách mà **không yêu cầu cài đặt ứng dụng native từ App Store / Google Play**. Hệ thống tích hợp toàn diện:
1. **Quét mã QR tại bia di tích:** Tự động nhận diện điểm tham quan và phát bài thuyết minh đa ngôn ngữ.
2. **Thuyết minh giọng đọc thông minh (Text-to-Speech - TTS):** Kết hợp Web Speech API trên thiết bị và luồng audio stream từ server để phát âm chuẩn xác 6 ngôn ngữ.
3. **Bản đồ số vector tương tác & thuật toán dẫn đường turn-by-turn:** Giúp du khách không bị lạc, ước tính số bước, thời gian và địa hình di chuyển.
4. **Thực tế tăng cường (AR Spatial):** Dựa trên cảm biến con quay hồi chuyển (gyroscope) và camera để tạo bảng chỉ hướng ảo 3D nổi trên không gian thực tế.
5. **Cổng thanh toán & vé điện tử:** Cho phép đặt dịch vụ xe điện, hoa đăng và nhận vé điện tử QR check-in tiện lợi qua chuẩn VietQR / ví điện tử.
6. **Trợ lý ảo AI đàm thoại:** Tích hợp mô hình Google Gemini 2.5 Flash cùng bộ cơ sở tri thức Phật giáo bản địa độc quyền.
7. **Hạ tầng vi dịch vụ (Microservices Mesh) & CI/CD tự động hóa:** Đảm bảo độ sẵn sàng cao, phục vụ giám sát kỹ thuật chuyên nghiệp.

---

## 2. MỤC TIÊU & CHỈ SỐ ĐÓNG GÓP

### 2.1. Mục tiêu sản phẩm (Product Objectives)
- Cung cấp trải nghiệm tham quan số hóa "All-in-One", chuẩn xác, tôn nghiêm và thân thiện với người dùng.
- Giảm thiểu 80% thời gian tìm đường và tình trạng du khách bị lạc tại các điểm di tích vùng cao của chùa.
- Tự động hóa 100% quy trình thuyết minh qua mã QR và công nghệ giọng nói AI không cần hướng dẫn viên đi kèm.
- Chuẩn hóa quy trình đặt dịch vụ xe điện và quản lý thanh toán không dùng tiền mặt minh bạch.

### 2.2. Chỉ số thành công chính (Key Metrics / OKRs)

| Nhóm chỉ số | Chỉ số cụ thể (KPI) | Mục tiêu kỳ vọng |
|---|---|---|
| **Trải nghiệm du khách** | Thời gian phản hồi phát âm thanh sau khi quét QR | < 600 ms |
| | Tỷ lệ người dùng hoàn thành nghe thuyết minh POI | ≥ 75% thời lượng bài nói |
| | Đánh giá mức độ hài lòng về chỉ đường chống lạc | ≥ 4.7 / 5.0 sao |
| **Độ phủ ngôn ngữ** | Số ngôn ngữ chính thức hỗ trợ | 6 ngôn ngữ: Tiếng Việt (vi), Tiếng Anh (en), Tiếng Trung (zh), Tiếng Hàn (ko), Tiếng Nhật (ja), Tiếng Pháp (fr) |
| **Kỹ thuật & Vận hành** | Uptime hạ tầng hệ thống backend | ≥ 99.9% |
| | Tỷ lệ lỗi kiểm thử tự động trong CI/CD Pipeline | 0 lỗi nghiêm trọng (Zero breaking build) |
| | Tốc độ phản hồi API trung bình (Average Latency) | ≤ 150 ms |

---

## 3. CHÂN DUNG NGƯỜI DÙNG & CÁC BÊN LIÊN QUAN

### 3.1. Phân khúc người dùng (User Personas)

#### Persona 1: Du khách quốc tế (International Tourist)
- **Đại diện:** John Smith (34 tuổi, du khách Mỹ) / Kim Min-ji (28 tuổi, du khách Hàn Quốc).
- **Hành vi:** Đến Đà Nẵng tự túc, muốn tìm hiểu sâu sắc về kiến trúc Tượng Phật Bà Quan Thế Âm và văn hóa tâm linh nhưng không biết tiếng Việt.
- **Nhu cầu cốt lõi:** Quét QR để nghe ngay thuyết minh bằng ngôn ngữ mẹ đẻ; cần hỏi nhanh các quy định (ăn mặc, chụp ảnh, giờ đóng cửa).

#### Persona 2: Phật tử & Du khách gia đình nội địa (Domestic Pilgrim & Family)
- **Đại diện:** Cô Mai Hương (55 tuổi, hành hương từ Hà Nội cùng gia đình gồm mẹ già 78 tuổi).
- **Hành vi:** Đi viếng chùa đầu năm, quan tâm đến các điểm tâm linh linh thiêng như Tháp Xá Lợi, Mộ Cá Ông, Chánh Điện.
- **Nhu cầu cốt lõi:** Bản đồ chỉ đường có cảnh báo dốc bậc thang đá; đặt vé xe điện buggy đưa đón mẹ già từ chân cổng lên Chánh Điện; thanh toán nhanh qua quét mã VietQR ngân hàng.

#### Persona 3: Ban Quản lý Chùa & Nhân viên Vận hành (Pagoda Operations Staff)
- **Đại diện:** Thầy quản lý ban trật tự & nhân viên điều phối xe điện Bãi Bụt.
- **Nhu cầu cốt lõi:** Kiểm soát luồng khách check-in bằng mã QR vé điện tử; nắm bắt tình trạng các điểm di tích có đông khách hay không; nội dung thuyết minh được kiểm duyệt chặt chẽ.

#### Persona 4: Kỹ sư DevOps & Quản trị Hệ thống (DevOps Engineer)
- **Nhu cầu cốt lõi:** Giám sát trạng thái 6 vi dịch vụ, lượng sự kiện đẩy qua EventBus trung tâm, kiểm soát đường ống CI/CD tự động khi có commit mới.

---

## 4. KIẾN TRÚC TỔNG THỂ & LUỒNG HOẠT ĐỘNG

### 4.1. Kiến trúc phân tầng (Layered Microservice Architecture)

Hệ thống được thiết kế theo mô hình lai (Hybrid Full-Stack SPA & Event-Driven Microservices Mesh):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER (React 19 SPA)                           │
│  ┌───────────────┬──────────────┬──────────────┬─────────────┬───────────┐  │
│  │ POI & Audio   │  QR Scanner  │ Vector Map   │ AR Spatial  │ Ticketing │  │
│  │ Player Bar    │  (WebRTC)    │ Navigation   │ (Gyroscope) │ & VietQR  │  │
│  └───────┬───────┴──────┬───────┴──────┬───────┴──────┬──────┴─────┬─────┘  │
│          │              │              │              │            │        │
│          ▼              ▼              ▼              ▼            ▼        │
│    Web Speech API  MediaDevices   Geolocation    DeviceMotion   LocalCache  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (JSON & Streams)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 BACKEND SERVICE LAYER (Node.js 22 + Express 4)              │
│                                                                             │
│  ┌───────────────────────┐  publish / subscribe  ┌───────────────────────┐  │
│  │   PoiAudioService     │◄─────────────────────►│  MicroserviceEventBus │  │
│  │   (8 POIs / 6 Langs)  │                       │  (In-Memory Ring Buf) │  │
│  └───────────────────────┘                       └───────────┬───────────┘  │
│  ┌───────────────────────┐                                   │              │
│  │   NavigationService   │◄──────────────────────────────────┤              │
│  │   (Dijkstra / Routes) │                                   │              │
│  └───────────────────────┘                                   │              │
│  ┌───────────────────────┐                                   │              │
│  │   BookingService      │◄──────────────────────────────────┤              │
│  │   (Tickets & Orders)  │                                   │              │
│  └───────────────────────┘                                   │              │
│  ┌───────────────────────┐                                   │              │
│  │   PaymentService      │◄──────────────────────────────────┤              │
│  │   (VietQR / Webhooks) │                                   │              │
│  └───────────────────────┘                                   │              │
│  ┌───────────────────────┐                                   │              │
│  │   ChatAiService       │◄──────────────────────────────────┤              │
│  │   (Gemini + Fallback) │                                   │              │
│  └───────────────────────┘                                   │              │
│  ┌───────────────────────┐                                   │              │
│  │   TtsService          │◄──────────────────────────────────┤              │
│  │   (Chunks & MP3 Cache)│                                   │              │
│  └───────────────────────┘                                   │              │
│  ┌───────────────────────┐                                   │              │
│  │   Cicd & Metrics      │◄──────────────────────────────────┘              │
│  │   (Prometheus format) │                                                  │
│  └───────────────────────┘                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. YÊU CẦU CHỨC NĂNG CHI TIẾT (FUNCTIONAL REQUIREMENTS)

### FR-1: Danh mục & Chi tiết Di tích (POI & Monuments)
- **Mã yêu cầu:** `FR-POI-01`
- **Mô tả:** Hệ thống cung cấp danh bạ số hóa của 8 địa điểm di tích trọng điểm tại Chùa Linh Ứng:
  1. `LU-QUANAM-01`: Tượng Phật Bà Quan Thế Âm cao 67m (Biểu tượng linh thiêng bậc nhất).
  2. `LU-CHANHDIEN-02`: Chánh Điện Linh Ứng Bãi Bụt (Trung tâm hành lễ tâm linh).
  3. `LU-THAPXALOI-03`: Tháp Xá Lợi 9 Tầng (Kiến trúc tháp cao 30m nhìn ra biển).
  4. `LU-18LAHAN-04`: Vườn 18 Vị La Hán (Tượng đá cẩm thạch trắng biểu đạt cảm xúc nhân gian).
  5. `LU-CONGTAMQUAN-05`: Cổng Tam Quan Bãi Bụt (Lối vào chính với ngói âm dương).
  6. `LU-CATHUVO-06`: Mộ Cá Ông / Cá Voi (Tín ngưỡng che chở vạn chài miền Trung).
  7. `LU-VONGCANH-07`: Đài Vọng Cảnh Biển Đông (Góc quan sát toàn cảnh vịnh Đà Nẵng).
  8. `LU-TRAMXEDIEN-08`: Trạm Xe Điện Buggy Bãi Bụt (Trung tâm đón tiếp và xe điện).
- **Tiêu chí chấp nhận:**
  - Mỗi POI hiển thị đầy đủ: Tên, thẻ danh hiệu (tag), thể loại (monument, temple, nature, viewpoint, relic), tọa độ (lat, lng, mapX, mapY), độ cao so với mặt nước biển, góc la bàn (bearing), hình ảnh sắc nét, đoạn văn thuyết minh ngắn gọn và kịch bản thuyết minh chi tiết.
  - Cho phép người dùng lọc theo danh mục hoặc tìm kiếm theo từ khóa.
  - Nhấp vào nút "Nghe thuyết minh" sẽ tự động mở Audio Player và phát bài nói.
  - Nhấp vào "Chỉ đường" sẽ điều hướng sang Bản đồ và tự động đặt điểm đến.

### FR-2: Quét Mã QR Di Tích Tức Thời (QR Code Scanner)
- **Mã yêu cầu:** `FR-QR-02`
- **Mô tả:** Cung cấp giao diện quét mã QR thời gian thực thông qua camera của thiết bị hoặc tải ảnh mã QR từ máy.
- **Quy trình hoạt động:**
  1. Người dùng mở tab "Quét QR" -> Trình duyệt yêu cầu quyền truy cập Camera thiết bị.
  2. Camera hiển thị khung ngắm định vị và tia laser quét động.
  3. Khi nhận diện được chuỗi mã QR chuẩn (ví dụ `LU-QUANAM-01`), hệ thống tự động gọi API `GET /api/pois/qr/{code}`.
  4. Hệ thống tải dữ liệu POI tương ứng và kích hoạt ngay trình phát âm thanh bài thuyết minh.
  5. Cung cấp 8 nút mã QR mô phỏng (Sample QR Codes) để người dùng dễ dàng thử nghiệm ngay trên máy tính/laptop khi không có camera.
- **Xử lý ngoại lệ:** Nếu mã QR không tồn tại trong hệ sinh thái chùa, hệ thống hiển thị thông báo lỗi (Toast Notification) đa ngôn ngữ thân thiện, không làm gián đoạn ứng dụng.

### FR-3: Động Cơ Thuyết Minh Đa Ngôn Ngữ (Multilingual Audio Narration Engine)
- **Mã yêu cầu:** `FR-AUDIO-03`
- **Mô tả:** Động cơ phát thanh thông minh hỗ trợ 6 ngôn ngữ chuẩn quốc tế:
  - `vi`: Tiếng Việt
  - `en`: English
  - `zh`: 中文 (Tiếng Trung)
  - `ko`: 한국어 (Tiếng Hàn)
  - `ja`: 日本語 (Tiếng Nhật)
  - `fr`: Français (Tiếng Pháp)
- **Cơ chế âm thanh kép (Hybrid Audio Engine):**
  - **Chế độ 1 (Web Speech Synthesis Client-side):** Sử dụng giọng đọc tích hợp của hệ điều hành trên điện thoại du khách, mang lại phản hồi ngay lập tức, hỗ trợ đọc văn bản tự do.
  - **Chế độ 2 (Server Audio Stream API `/api/tts`):** Máy chủ chia nhỏ nội dung thành các phân đoạn an toàn (< 160 ký tự), gọi động cơ sinh âm thanh chuẩn và lưu vào bộ đệm cache MP3 in-memory (tối đa 100 mục gần nhất).
- **Thanh điều khiển âm thanh nổi (Floating Audio Player Bar):**
  - Nút Play/Pause, tua lại 10s, tua tới 10s.
  - Điều chỉnh tốc độ giọng đọc linh hoạt theo chu kỳ: `0.8x -> 1.0x -> 1.25x -> 1.5x`.
  - Thanh trượt tiến trình (Progress Scrubber) cho phép kéo thả để nghe lại đoạn tùy ý.
  - Nút chuyển đổi nhanh ngôn ngữ giọng đọc riêng biệt (Narration Voice Selector) mà không làm thay đổi ngôn ngữ giao diện của ứng dụng.

### FR-4: Bản Đồ Tương Tác & Lộ Trình Chống Lạc (Interactive Map & Navigation)
- **Mã yêu cầu:** `FR-NAV-04`
- **Mô tả:** Bản đồ trực quan hóa khuôn viên chùa với sơ đồ tọa độ và hệ thống đường mòn kết nối giữa các điểm di tích.
- **Tính năng chi tiết:**
  - **Chọn điểm xuất phát và điểm đến:** Người dùng chọn điểm hiện tại và điểm muốn đến trong danh sách 8 POI.
  - **Thuật toán tìm đường ngắn nhất:** `NavigationService` tính toán tổng khoảng cách thực tế (mét) và thời gian đi bộ dự tính (phút).
  - **Chỉ dẫn từng bước (Turn-by-turn Instructions):** Cung cấp danh sách các bước chỉ đường chi tiết bằng ngôn ngữ hiện tại, kèm loại địa hình thực tế (`flat_stone`: đường lát đá bằng phẳng, `marble_stairs`: bậc thang đá dốc, `gentle_slope`: dốc thoải, `coastal_boardwalk`: đường ven biển ngắm cảnh).
  - **Cảnh báo địa hình (Terrain Safety Warning):** Tự động phát cảnh báo nếu lộ trình có nhiều bậc thang dốc đứng, nhắc nhở du khách mang giày thể thao và hỗ trợ người cao tuổi chuyển sang xe điện buggy.
  - **Lộ trình tham quan gợi ý (Suggested Itineraries):**
    + *Hành trình Tâm linh Tinh hoa (30 phút)*: Cổng Tam Quan -> Chánh Điện -> Tượng Phật Bà Quan Âm.
    + *Hành trình Chiêm bái Trọn vẹn (60 phút)*: Cổng Tam Quan -> Vườn 18 La Hán -> Chánh Điện -> Tượng Phật Bà -> Tháp Xá Lợi.
    + *Hành trình Thưởng ngoạn Bãi Bụt & Thiên nhiên Sơn Trà (90 phút)*: Khám phá toàn diện 8 điểm tham quan kết hợp Đài Vọng Cảnh và Mộ Cá Ông.

### FR-5: Trải Nghiệm Thực Tế Tăng Cường Định Vị (AR Spatial Wayfinding)
- **Mã yêu cầu:** `FR-AR-05`
- **Mô tả:** Ứng dụng công nghệ Web AR để chiếu các bảng chỉ dẫn nổi 3D (3D spatial markers) trong không gian thực tế qua camera điện thoại.
- **Tính năng chi tiết:**
  - Kết nối luồng Camera WebRTC làm nền (live camera feed).
  - Sử dụng sự kiện `deviceorientation` để tính toán góc phương vị la bàn (Compass Bearing: 0 - 360°), góc nghiêng ngẩng (pitch) và góc xoay ngang (roll).
  - Thuật toán AR tính toán góc lệch giữa hướng nhìn thực tế của người dùng và phương vị của các POI trọng điểm (đặc biệt là Tượng Phật Bà Quan Thế Âm 67m tại góc 135° Đông Nam và Chánh Điện tại góc 90° Đông).
  - Hiển thị Marker 3D bay bổng mượt mà trên màn hình khi người dùng xoay camera về đúng hướng di tích, kèm khoảng cách thực tế và nút chạm nhanh để nghe thuyết minh.
  - Tích hợp radar la bàn mini (Mini Radar HUD) ở góc màn hình hiển thị trực quan các chấm di tích xung quanh người dùng.

### FR-6: Đặt Vé Dịch Vụ & Cổng Thanh Toán Đa Kênh (Booking & Payment)
- **Mã yêu cầu:** `FR-PAY-06`
- **Mô tả:** Hệ thống hỗ trợ đặt trước và thanh toán không dùng tiền mặt cho các dịch vụ tiện ích tại Chùa Linh Ứng.
- **Danh mục gói dịch vụ khả dụng:**
  1. `ticket_buggy_shuttle`: Vé Xe Điện Buggy Bãi Bụt & Sơn Trà (Khứ hồi) — 50.000 VNĐ.
  2. `ticket_audio_device`: Bộ Thu Thuyết Minh Không Dây Chuẩn Bảo Tàng — 40.000 VNĐ.
  3. `ticket_sunset_lantern`: Combo Hoàng Hôn & Thả Hoa Đăng Cầu Bình An — 80.000 VNĐ.
  4. `ticket_chay_buffet`: Phiếu Trải Nghiệm Ẩm Thực Chay Thiền Viện — 65.000 VNĐ.
- **Quy trình đặt vé và thanh toán (Booking & Payment Flow):**
  1. Du khách chọn gói dịch vụ, số lượng vé và ngày tham quan.
  2. Nhập thông tin liên hệ: Họ tên, Số điện thoại, Email (tùy chọn).
  3. Nhấn "Tiến hành thanh toán" -> `BookingService` sinh mã đơn `BKG-xxxxxx`.
  4. Hệ thống chuyển sang giao diện cổng thanh toán và hỗ trợ 5 phương thức:
     - `VIETQR`: Sinh mã QR chuẩn Ngân hàng Việt Nam kèm số tài khoản nhà chùa, số tiền và nội dung chuyển khoản tự động.
     - `MOMO`: Cổng ví điện tử MoMo.
     - `VNPAY`: Cổng thanh toán quốc gia VNPay.
     - `ZALOPAY`: Ví điện tử ZaloPay.
     - `CREDIT_CARD`: Thẻ quốc tế Visa / MasterCard.
  5. Sau khi quét mã thanh toán, nhấn "Xác nhận đã chuyển khoản thành công" -> `PaymentService` kích hoạt chữ ký số giao dịch và chuyển trạng thái đơn hàng sang `CONFIRMED`.
  6. Màn hình vé điện tử (Digital Boarding Pass) hiển thị mã QR Check-in độc quyền, thông tin chuyến đi và nút lưu vé về máy.

### FR-7: Trợ Lý Ảo Chatbot AI Tâm Linh (Gemini 2.5 Flash & Domain Knowledge)
- **Mã yêu cầu:** `FR-AI-07`
- **Mô tả:** Trợ lý ảo AI đàm thoại tự nhiên, am hiểu sâu sắc về giáo lý, lịch sử và văn hóa Phật giáo tại chùa Linh Ứng.
- **Kiến trúc hoạt động:**
  - **Mô hình AI đám mây:** Tích hợp SDK `@google/genai` gọi mô hình `gemini-2.5-flash` trên môi trường máy chủ.
  - **System Instruction chuyên biệt:** Định hình phong thái trợ lý thông thái, khiêm nhường, ấm áp ("Nam Mô A Di Đà Phật", "Kính chào quý khách"), am hiểu sâu sắc về cố Thượng tọa Thích Thiện Nguyện, kiến trúc 17 tầng tháp thờ 357 vị Phật, và thiên nhiên Sơn Trà.
  - **Bộ dự phòng tri thức ngoại tuyến (Offline Knowledge Base Fallback):** Nếu không có kết nối Internet hoặc chưa cấu hình API Key, hệ thống tự động kích hoạt bộ tri thức xử lý ngôn ngữ tự nhiên bản địa:
    + Giờ mở cửa: 06:00 - 21:00 hàng ngày, miễn phí vé vào cổng 100%.
    + Quy tắc trang phục: Quần/váy dài qua đầu gối, áo có tay, tháo giày khi vào Chánh Điện.
    + Thắp hương an toàn: Khuyến khích chỉ thắp 1 nén nhang ngoài sân để tránh ngột ngạt và phòng chống cháy rừng.
    + Bảo tồn động vật hoang dã: Tuyệt đối không cho khỉ và Voọc chà vá chân nâu ăn thức ăn của con người.
    + Hướng dẫn di chuyển: Taxi, Grab, xe máy, xe buggy dọc đường ven biển Hoàng Sa.
  - Hỗ trợ chuyển đổi câu trả lời của Chatbot thành giọng đọc phát ra loa.

### FR-8: Bảng Điều Khiển Giám Sát Vi Dịch Vụ & CI/CD Mesh (Backend & DevOps)
- **Mã yêu cầu:** `FR-OPS-08`
- **Mô tả:** Phân hệ giám sát kỹ thuật chuyên sâu phục vụ chấm điểm đồ án Công nghệ Phần mềm và vận hành hệ thống.
- **Tính năng chi tiết:**
  - **Sơ đồ cấu trúc mạng vi dịch vụ (Microservices Topology):** Hiển thị trực quan trạng thái vận hành của 6 dịch vụ độc lập (`PoiAudioService`, `NavigationService`, `BookingService`, `PaymentService`, `ChatAiService`, `CicdService`).
  - **Lịch sử sự kiện luân chuyển (Central EventBus Log Stream):** Theo dõi luồng sự kiện Pub/Sub thời gian thực (Event Type, Source Service, Target Service, Correlation ID, Payload, Latency).
  - **Giám sát đường ống CI/CD (Pipeline Execution Engine):** Theo dõi chi tiết 6 giai đoạn kiểm thử tự động của GitHub Actions (`Lint & Static Analysis`, `Unit & Integration Tests`, `Security Scan & SAST`, `Docker Container Build`, `Canary Deployment`, `Production Rollout`).
  - Cung cấp nút "Kích hoạt Pipeline thủ công" (Trigger Pipeline) để mô phỏng quy trình kiểm thử và triển khai phiên bản mới tức thời.

---

## 6. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFR)

### 6.1. Hiệu năng & Tốc độ phản hồi (Performance)
- **NFR-PERF-01 (Thời gian tải ban đầu):** First Contentful Paint (FCP) dưới 1.2 giây trên mạng 4G di động.
- **NFR-PERF-02 (Độ trễ API):** 95% số yêu cầu API RESTful có thời gian phản hồi (P95 latency) dưới 150 ms.
- **NFR-PERF-03 (Bộ nhớ & CPU):** Ứng dụng client duy trì tốc độ khung hình 60 FPS khi render bản đồ SVG và radar AR, không gây nóng máy hoặc hao pin bất thường trên thiết bị di động.

### 6.2. Tính sẵn sàng & Khả năng mở rộng (Availability & Scalability)
- **NFR-SCA-01 (Mô hình mở rộng):** Các vi dịch vụ backend được thiết kế dạng stateless, cho phép mở rộng ngang (horizontal auto-scaling) qua cụm Kubernetes (K8s) từ 3 đến 10 bản sao (replicas).
- **NFR-SCA-02 (Khả năng chịu lỗi - Fault Tolerance):** Nếu dịch vụ AI bên ngoài gặp sự cố mạng, dịch vụ Chatbot tự động chuyển đổi sang bộ tri thức nội bộ trong thời gian dưới 50 ms mà không làm sập giao diện người dùng.

### 6.3. Tính bảo mật & Quyền riêng tư (Security & Privacy)
- **NFR-SEC-01 (Bảo mật thanh toán):** Mọi giao dịch đặt vé đều được sinh mã băm chữ ký (Signature Hash) kiểm tra tính toàn vẹn, ngăn chặn việc giả mạo số tiền chuyển khoản.
- **NFR-SEC-02 (Quyền truy cập phần cứng):** Ứng dụng chỉ xin cấp quyền Camera và Vị trí (Geolocation) khi người dùng chủ động mở tab Quét QR, AR hoặc Bản đồ; không lưu trữ hình ảnh hay video của người dùng lên máy chủ.
- **NFR-SEC-03 (An toàn khóa API):** Khóa `GEMINI_API_KEY` được bảo mật 100% tại biến môi trường máy chủ, tuyệt đối không lộ ra mã nguồn frontend.

### 6.4. Tính tương thích & Trải nghiệm di động (Compatibility & Responsiveness)
- **NFR-COMP-01 (Mobile-First):** Giao diện được tối ưu chuẩn xác cho màn hình cảm ứng di động từ 360px đến máy tính bảng và màn hình máy tính bàn 4K.
- **NFR-COMP-02 (Trình duyệt):** Tương thích hoàn toàn với Google Chrome, Apple Safari (iOS 15+), Mozilla Firefox, Microsoft Edge và Samsung Internet.
- **NFR-COMP-03 (Không phụ thuộc Alert):** Loại bỏ hoàn toàn các hộp thoại chặn màn hình (`window.alert`, `window.confirm`) để đảm bảo vận hành mượt mà bên trong iFrame và WebView di động.

---

## 7. MÔ HÌNH DỮ LIỆU & THIẾT KẾ THỰC THỂ (DATA MODELING & ERD)

Dựa trên sơ đồ thiết kế hệ thống trong tài liệu `CNPM-thanhtoan-POI.drawio`, cơ sở dữ liệu của dự án được chuẩn hóa thành các thực thể quan hệ sau:

```
┌─────────────────────────┐         1:N          ┌─────────────────────────┐
│          Staff          ├─────────────────────►│   PaymentTransaction    │
│  (Nhân viên / Admin)    │  (Ghi nhận tiền mặt) │  (Giao dịch thanh toán) │
├─────────────────────────┤                      ├─────────────────────────┤
│ + staff_id (PK)         │                      │ + transaction_id (PK)   │
│   username              │                      │ - session_id (FK)       │
│   password_hash         │                      │ - staff_id (FK, nullable│
│   role                  │                      │   payment_method        │
│   created_at            │                      │   payment_status        │
└─────────────────────────┘                      │   amount                │
                                                 │   transaction_ref       │
                                                 │   created_at            │
                                                 └────────────▲────────────┘
                                                              │ 1:1
                                                              │
┌─────────────────────────┐         1:N          ┌────────────┴────────────┐
│         ChatLog         │◄─────────────────────┤      AccessSession      │
│  (Hỏi đáp RAG Chatbot)  │                      │  (Phiên truy cập khách) │
├─────────────────────────┤                      ├─────────────────────────┤
│ + chat_id (PK)          │                      │ + session_id (PK)       │
│ - session_id (FK)       │                      │   auth_code             │
│   user_query            │                      │   shorted_code          │
│   bot_response          │                      │   access_token          │
│   language_code         │                      │   status                │
│   created_at            │                      │   expires_at            │
└─────────────────────────┘                      │   created_at            │
                                                 └─────────────────────────┘

┌─────────────────────────┐         1:N          ┌─────────────────────────┐
│          Route          ├─────────────────────►│        RoutePOI         │
│     (Tuyến gợi ý)       │                      │   (Thứ tự điểm đến)     │
├─────────────────────────┤                      ├─────────────────────────┤
│ + route_id (PK)         │                      │ + id (PK)               │
│   route_name            │                      │ - route_id (FK)         │
│   estimated_duration    │                      │ - poi_id (FK)           │
│   is_active             │                      │   order_index           │
└─────────────────────────┘                      │   direction_instruction │
                                                 └────────────▲────────────┘
                                                              │ 1:N
                                                              │
┌─────────────────────────┐         1:N          ┌────────────┴────────────┐
│      POITranslation     │◄─────────────────────┤           POI           │
│ (Đa ngôn ngữ & Audio)   │                      │    (Điểm tham quan)     │
├─────────────────────────┤                      ├─────────────────────────┤
│ + translation_id (PK)   │                      │ + poi_id (PK)           │
│ - poi_id (FK)           │                      │   name_default          │
│   language_code         │                      │   latitude              │
│   title                 │                      │   longitude             │
│   description_text      │                      │   trigger_radius        │
│   audio_url             │                      │   thumbnail_url         │
└─────────────────────────┘                      │   is_active             │
                                                 └─────────────────────────┘
```

### 7.1. Bảng `POI` (Điểm di tích)
- `poi_id` (VARCHAR - Khóa chính): Định danh duy nhất (ví dụ: `poi_quanam_67m`).
- `name_default` (VARCHAR): Tên tiếng Việt mặc định của di tích.
- `latitude`, `longitude` (DECIMAL): Tọa độ định vị GPS toàn cầu.
- `map_x`, `map_y` (DECIMAL): Tọa độ phần trăm (0 - 100%) hiển thị trên bản đồ số đồ họa.
- `trigger_radius` (INTEGER): Bán kính kích hoạt tự động tính theo mét khi du khách tiếp cận.
- `category` (VARCHAR): Phân loại di tích (`monument`, `temple`, `nature`, `viewpoint`, `relic`).
- `thumbnail_url` (VARCHAR): Đường dẫn hình ảnh đại diện.
- `is_active` (BOOLEAN): Trạng thái hoạt động.

### 7.2. Bảng `POITranslation` (Bản dịch & Âm thanh thuyết minh)
- `translation_id` (VARCHAR - Khóa chính): Mã định danh bản dịch.
- `poi_id` (VARCHAR - Khóa ngoại): Liên kết đến bảng `POI`.
- `language_code` (VARCHAR): Mã ngôn ngữ (`vi`, `en`, `zh`, `ko`, `ja`, `fr`).
- `title` (VARCHAR): Tên di tích đã được chuyển ngữ.
- `title_tag` (VARCHAR): Thẻ mô tả ngắn gọn.
- `description_text` (TEXT): Văn bản tóm tắt nhanh.
- `full_narration` (TEXT): Toàn văn kịch bản thuyết minh chi tiết cho giọng đọc.
- `audio_url` (VARCHAR): Đường dẫn tệp âm thanh hoặc API stream.

### 7.3. Bảng `PaymentTransaction` & `BookingOrder` (Đơn vé & Giao dịch thanh toán)
- `transaction_id` (VARCHAR - Khóa chính): Mã định danh giao dịch (`txn_xxxxxx`).
- `booking_id` (VARCHAR - Khóa ngoại): Mã đơn đặt vé (`BKG-xxxxxx`).
- `amount` (DECIMAL): Số tiền giao dịch tính bằng VNĐ.
- `payment_method` (VARCHAR): Kênh thanh toán (`VIETQR`, `MOMO`, `VNPAY`, `ZALOPAY`, `CREDIT_CARD`).
- `payment_status` (VARCHAR): Trạng thái giao dịch (`PENDING`, `SUCCESS`, `FAILED`).
- `transaction_ref` (VARCHAR): Mã đối soát chuyển khoản ngân hàng.
- `signature` (VARCHAR): Chữ ký mã hóa xác thực toàn vẹn đơn hàng.
- `created_at`, `completed_at` (TIMESTAMP): Thời gian khởi tạo và hoàn tất.

---

## 8. ĐẶC TẢ GIAO DIỆN LẬP TRÌNH (REST API SPECIFICATION)

| STT | Phương thức | Endpoint URI | Tham số (Query / Body) | Chức năng nghiệp vụ | Mã phản hồi |
|:---:|:---:|---|---|---|:---:|
| 1 | `GET` | `/api/health` | Không | Kiểm tra trạng thái máy chủ, uptime, bộ nhớ RAM, phiên bản Node | 200 OK |
| 2 | `GET` | `/api/pois` | `lang` (tùy chọn: `vi`, `en`, ...) | Lấy danh sách toàn bộ 8 di tích theo ngôn ngữ yêu cầu | 200 OK |
| 3 | `GET` | `/api/pois/qr/:code` | `code` (ví dụ `LU-QUANAM-01`), `lang` | Truy vấn di tích tức thời từ mã QR bia đá | 200 OK / 404 |
| 4 | `GET` | `/api/tts` | `text` (văn bản cần đọc), `lang` | Stream trực tiếp luồng âm thanh MP3 phục vụ giọng đọc tự nhiên | 200 OK (audio/mpeg) |
| 5 | `GET` | `/api/navigation/route` | `from`, `to`, `lang` | Tính toán lộ trình ngắn nhất giữa 2 di tích, khoảng cách và các bước chỉ dẫn | 200 OK |
| 6 | `GET` | `/api/navigation/itineraries` | `lang` | Danh sách 3 lộ trình tham quan gợi ý (30p, 60p, 90p) | 200 OK |
| 7 | `GET` | `/api/tickets` | `lang` | Danh mục các gói vé dịch vụ xe điện, hoa đăng, ẩm thực chay | 200 OK |
| 8 | `POST` | `/api/bookings` | `{ customerName, customerPhone, ticketId, quantity, visitDate, lang }` | Khởi tạo đơn đặt vé mới trong hệ thống | 201 Created |
| 9 | `POST` | `/api/payment/initiate` | `{ bookingId, amountVnd, channel }` | Khởi tạo thanh toán VietQR ngân hàng hoặc ví điện tử | 200 OK |
| 10 | `POST` | `/api/payment/confirm` | `{ transactionId }` | Xác thực thanh toán thành công và kích hoạt mã vé điện tử | 200 OK |
| 11 | `POST` | `/api/chat` | `{ question, history, lang }` | Gửi câu hỏi đến trợ lý ảo thông minh (Gemini AI / Fallback) | 200 OK |
| 12 | `GET` | `/api/cicd/services` | Không | Kiểm tra sức khỏe chi tiết của từng vi dịch vụ trong hệ thống | 200 OK |
| 13 | `GET` | `/api/cicd/events` | `limit` (mặc định: 30) | Xem danh sách các sự kiện luân chuyển qua EventBus | 200 OK |
| 14 | `POST` | `/api/cicd/pipelines/trigger` | `{ branch, commitMessage }` | Kích hoạt quy trình kiểm thử và build CI/CD tự động | 200 OK |

---

## 9. CHIẾN LƯỢC TỰ ĐỘNG HÓA CI/CD & HẠ TẦNG TRIỂN KHAI

### 9.1. Đường ống tự động hóa GitHub Actions (`.github/workflows/ci-cd.yml`)
Quy trình CI/CD được kích hoạt tự động mỗi khi có lệnh `push` hoặc `pull_request` vào nhánh `main` với 6 giai đoạn nghiêm ngặt:

1. **Stage 1 - Lint & Static Analysis:** Chạy kiểm tra kiểu tĩnh TypeScript (`tsc --noEmit`) và ESLint để phát hiện sớm các lỗi cú pháp.
2. **Stage 2 - Unit & Integration Testing:** Khởi chạy bộ kiểm thử đơn vị cho thuật toán tìm đường `NavigationService`, dịch vụ phân chia phân đoạn `TtsService` và tính toàn vẹn chữ ký thanh toán.
3. **Stage 3 - Security Audit & SAST:** Quét lỗ hổng bảo mật các thư viện phụ thuộc (`npm audit`), kiểm tra rò rỉ khóa bí mật và mã độc.
4. **Stage 4 - Docker Container Build:** Đóng gói ứng dụng thành Docker Image tiêu chuẩn trên nền `node:22-alpine` đa tầng (multi-stage build) để giảm dung lượng file xuống dưới 150MB.
5. **Stage 5 - Canary Deployment:** Triển khai thử nghiệm phiên bản mới cho 10% lưu lượng truy cập để kiểm thử thực tế.
6. **Stage 6 - Production Rollout & Smoke Test:** Triển khai toàn diện lên hạ tầng máy chủ chính và tự động gọi endpoint `/api/health` kiểm tra chất lượng.

### 9.2. Cấu hình Docker Compose (`docker-compose.yml`)
- Dịch vụ `app`: Chạy máy chủ `linhung-app-service` cổng 3000, tích hợp cơ chế tự kiểm tra sức khỏe `healthcheck` mỗi 30 giây.
- Dịch vụ `redis-cache`: Khởi chạy `linhung-redis-bus` (Redis 7) làm bộ nhớ đệm phân tán và hàng đợi sự kiện.
- Mạng nội bộ: `pagoda-internal-mesh` đảm bảo kết nối bảo mật cách ly giữa các container.

### 9.3. Kiến trúc Kubernetes (`k8s/deployment.yaml`)
- **Deployment:** Cấu hình 3 bản sao (replicas = 3) chạy song song với chiến lược `RollingUpdate` (tối đa 1 pod gián đoạn trong khi cập nhật), đảm bảo ứng dụng không bao giờ bị downtime.
- **Service:** Định tuyến tải qua dịch vụ nội bộ `linhung-app-service` cổng 80 -> 3000.
- **Probes:** Thiết lập đầy đủ `livenessProbe` và `readinessProbe` liên tục giám sát endpoint `/api/health`.
- **Resource Limits:** Giới hạn tài nguyên an toàn cho mỗi Pod (Request: 256Mi RAM, 100m CPU; Limit: 512Mi RAM, 500m CPU).

---

## 10. KẾ HOẠCH PHÁT TRIỂN & QUẢN TRỊ RỦI RO (ROADMAP & RISK MANAGEMENT)

### 10.1. Lộ trình phát triển (Product Roadmap)

| Giai đoạn | Thời gian | Hạng mục công việc chính | Trọng tâm |
|---|---|---|---|
| **Phase 1: Foundation (Đã hoàn thành)** | Tuần 1 - 4 | Xây dựng kiến trúc SPA React 19 + Express, số hóa 8 POI di tích, tích hợp Web Speech đa ngôn ngữ, thiết kế bản đồ vector tương tác. | Core MVP |
| **Phase 2: Advanced Features (Hiện tại)** | Tuần 5 - 8 | Tích hợp WebRTC QR Scanner, mô phỏng AR Spatial Wayfinding, cổng thanh toán VietQR & ví điện tử, Chatbot AI với Gemini 2.5 Flash, thiết lập CI/CD Pipeline. | Feature Complete |
| **Phase 3: Real Integration & Testing** | Tuần 9 - 12 | Thử nghiệm thực địa tại Chùa Linh Ứng Sơn Trà; kết nối cổng thanh toán ngân hàng thật; tối ưu hóa tín hiệu GPS tại khu vực cây rừng rậm rạp. | Field Trial |
| **Phase 4: Ecosystem & Expansion** | Tương lai | Mở rộng số hóa các danh thắng lân cận tại Đà Nẵng (Ngũ Hành Sơn, Cầu Rồng, Bảo tàng Chăm); tích hợp mô hình 3D tương tác của Tượng Phật Bà Quan Âm. | Scaled Ecosystem |

### 10.2. Ma trận Quản trị Rủi ro (Risk Matrix & Mitigation)

| Rủi ro tiềm ẩn | Mức độ | Khả năng xảy ra | Giải pháp giảm thiểu (Mitigation Strategy) |
|---|:---:|:---:|---|
| **Sóng di động yếu / mất mạng tại bán đảo Sơn Trà** | Cao | Cao | Thiết kế kiến trúc Offline-First: Lưu trữ cache toàn bộ dữ liệu 8 di tích và bộ tri thức Phật giáo ngay trên thiết bị; sử dụng Web Speech Synthesis không phụ thuộc mạng. |
| **Độ chính xác GPS bị trôi dạt do vách núi** | Trung bình | Cao | Kết hợp định vị GPS với quét mã QR vật lý tại bia di tích làm mốc hiệu chuẩn (Ground Truth Anchor); cho phép người dùng chọn điểm xuất phát thủ công trên bản đồ. |
| **Hạn mức (Quota) hoặc nghẽn mạng API AI Gemini** | Trung bình | Trung bình | Xây dựng cơ chế dự phòng hai lớp: Tự động chuyển đổi sang bộ tri thức Phật giáo bản địa độc quyền tức thời mà không gây gián đoạn phiên trò chuyện. |
| **Khách du lịch quốc tế không có tài khoản ngân hàng Việt Nam** | Cao | Trung bình | Bổ sung phương thức thanh toán thẻ tín dụng quốc tế (Visa/Mastercard) và cơ chế hỗ trợ thanh toán tiền mặt trực tiếp tại quầy thông tin Bãi Bụt. |

---

## 11. KẾT LUẬN & ĐÁNH GIÁ ĐỒ ÁN

Đồ án **Linh Ứng Pagoda Smart Guide & Narration** là minh chứng tiêu biểu cho việc vận dụng toàn diện các nguyên lý cốt lõi của ngành **Công nghệ Phần mềm**: từ khảo sát nhu cầu thực tế, phân tích nghiệp vụ, mô hình hóa dữ liệu (UML & ERD), thiết kế kiến trúc phân tầng chịu tải cao (Microservices Mesh & Event-Driven Pub/Sub), đến áp dụng các công nghệ web hiện đại nhất (React 19, TypeScript, Web Speech, WebRTC, Web AR, AI LLM) và chuẩn hóa quy trình DevOps (Docker, Kubernetes, GitHub Actions CI/CD).

Sản phẩm không chỉ đáp ứng xuất sắc các tiêu chí học thuật của một đồ án kỹ thuật phần mềm mà còn sở hữu giá trị ứng dụng thực tiễn cao, góp phần số hóa và nâng tầm trải nghiệm du lịch tâm linh tại thành phố Đà Nẵng.
