-- =====================================================================
--  Linh Ứng Pagoda – Audio guide + Dịch vụ (ăn trưa, xe điện) – PostgreSQL 16
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE account_role AS ENUM ('admin', 'staff');
CREATE TYPE poi_category AS ENUM ('gate', 'statue', 'hall', 'garden', 'viewpoint', 'other');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'used', 'cancelled');

-- ---------- Tài khoản admin / staff ----------
CREATE TABLE accounts (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  full_name     VARCHAR(100) NOT NULL,
  role          account_role NOT NULL,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ---------- Ngôn ngữ ----------
CREATE TABLE languages (
  code      VARCHAR(5) PRIMARY KEY,
  name      VARCHAR(50) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ---------- POI ----------
CREATE TABLE pois (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code             VARCHAR(40)  NOT NULL UNIQUE,
  category         poi_category NOT NULL DEFAULT 'other',
  latitude         NUMERIC(9,6) NOT NULL CHECK (latitude  BETWEEN -90  AND 90),
  longitude        NUMERIC(9,6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  trigger_radius_m INT          NOT NULL DEFAULT 10 CHECK (trigger_radius_m > 0),
  image_url        TEXT,
  sort_order       INT          NOT NULL DEFAULT 0,
  is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE poi_translations (
  poi_id             BIGINT      NOT NULL REFERENCES pois(id) ON DELETE CASCADE,
  language_code      VARCHAR(5)  NOT NULL REFERENCES languages(code),
  title              VARCHAR(200) NOT NULL,
  short_description  TEXT,
  narration_text     TEXT        NOT NULL,
  audio_url          TEXT,                       -- /audio/xxx.wav (sinh bởi Gemini TTS hoặc upload tay)
  is_auto_translated BOOLEAN     NOT NULL DEFAULT FALSE,
  PRIMARY KEY (poi_id, language_code)
);

-- ---------- Tuyến tham quan ----------
CREATE TABLE tours (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code             VARCHAR(30) NOT NULL UNIQUE,
  duration_minutes INT NOT NULL,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE tour_translations (
  tour_id       BIGINT NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  PRIMARY KEY (tour_id, language_code)
);
CREATE TABLE tour_pois (
  tour_id    BIGINT NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  poi_id     BIGINT NOT NULL REFERENCES pois(id)  ON DELETE CASCADE,
  stop_order INT    NOT NULL CHECK (stop_order > 0),
  PRIMARY KEY (tour_id, poi_id)
);

-- ---------- Dịch vụ (ăn trưa, xe điện, ...) ----------
CREATE TABLE services (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code       VARCHAR(30) NOT NULL UNIQUE,         -- LUNCH, ECART, ...
  unit_price NUMERIC(12,0) NOT NULL CHECK (unit_price >= 0),
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE service_translations (
  service_id    BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  name          VARCHAR(150) NOT NULL,
  description   TEXT,
  unit          VARCHAR(50),
  PRIMARY KEY (service_id, language_code)
);

-- ---------- Người dùng ẩn danh (không cần đăng nhập) ----------
CREATE TABLE app_sessions (
  device_id  VARCHAR(64) PRIMARY KEY,
  lang       VARCHAR(5),
  platform   VARCHAR(20),
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Lượt nghe thuyết minh ----------
CREATE TABLE poi_listens (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poi_id        BIGINT NOT NULL REFERENCES pois(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL,
  device_id     VARCHAR(64),
  source        VARCHAR(10) NOT NULL DEFAULT 'manual',   -- auto (geofence) | manual
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_listens_poi ON poi_listens (poi_id, language_code);

-- ---------- Đơn dịch vụ ----------
CREATE TABLE orders (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_code     VARCHAR(20) NOT NULL UNIQUE,
  qr_token       VARCHAR(40) NOT NULL UNIQUE,
  device_id      VARCHAR(64),
  service_id     BIGINT NOT NULL REFERENCES services(id),
  quantity       INT NOT NULL CHECK (quantity BETWEEN 1 AND 100),
  unit_price     NUMERIC(12,0) NOT NULL,
  total_amount   NUMERIC(12,0) NOT NULL,
  customer_name  VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20)  NOT NULL,
  visit_date     DATE NOT NULL,
  note           TEXT,
  status         order_status NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(30) NOT NULL DEFAULT 'bank_transfer',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at        TIMESTAMPTZ,
  confirmed_by   BIGINT REFERENCES accounts(id) ON DELETE SET NULL,
  used_at        TIMESTAMPTZ,
  checked_by     BIGINT REFERENCES accounts(id) ON DELETE SET NULL
);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_device ON orders (device_id);
CREATE INDEX idx_orders_paid   ON orders (paid_at);
