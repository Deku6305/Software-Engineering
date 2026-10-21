-- Lưu ý: nội dung thuyết minh / tọa độ / giá là DỮ LIỆU MẪU, cần kiểm chứng trước khi dùng thật.

-- Tài khoản demo (mật khẩu 123456)
INSERT INTO accounts (email, password_hash, full_name, role) VALUES
 ('admin1@demo.com', crypt('123456', gen_salt('bf')), 'Admin Demo', 'admin'),
 ('staff1@demo.com', crypt('123456', gen_salt('bf')), 'Staff Demo', 'staff');

INSERT INTO languages (code, name) VALUES
 ('vi','Tiếng Việt'), ('en','English'), ('zh','中文'), ('ko','한국어');

-- POI (bán kính kích hoạt 10m)
INSERT INTO pois (code, category, latitude, longitude, trigger_radius_m, sort_order) VALUES
 ('LU_GATE',     'gate',      16.100300, 108.277400, 10, 1),
 ('LU_COURT',    'garden',    16.100000, 108.277700, 10, 2),
 ('LU_STATUE',   'statue',    16.099500, 108.278100, 10, 3),
 ('LU_MAINHALL', 'hall',      16.099800, 108.278400, 10, 4),
 ('LU_ARHAT',    'garden',    16.099300, 108.278500, 10, 5),
 ('LU_VIEW',     'viewpoint', 16.099200, 108.277900, 10, 6);

INSERT INTO poi_translations (poi_id, language_code, title, short_description, narration_text)
SELECT p.id, v.lang, v.title, v.sd, v.nar
FROM pois p JOIN (VALUES
 ('LU_GATE','vi','Cổng Tam Quan','Lối vào chính của chùa Linh Ứng Sơn Trà.',
  'Chào mừng quý khách đến với chùa Linh Ứng Sơn Trà. Cổng Tam Quan là lối vào chính, mang ý nghĩa ba cửa giải thoát: không, vô tướng và vô nguyện. Khi bước qua cổng, mời quý khách thư thái tâm hồn, nhẹ nhàng bước vào không gian thanh tịnh của chùa.'),
 ('LU_GATE','en','Tam Quan Gate','Main entrance of Linh Ung Pagoda, Son Tra.',
  'Welcome to Linh Ung Pagoda on Son Tra Peninsula. The Tam Quan Gate is the main entrance and symbolizes the three gates of liberation. As you walk through, please quiet your mind and enjoy the serene atmosphere of the pagoda.'),
 ('LU_COURT','vi','Sân chùa và hoa viên','Khuôn viên rộng với cây xanh và cảnh quan nhìn ra biển.',
  'Khuôn viên chùa được bố trí hài hòa giữa cây cối, hoa viên và các tiểu cảnh, nằm trên sườn núi nhìn ra biển Đông. Quý khách có thể dạo chậm, hít thở không khí trong lành trước khi đến với điểm nhấn nổi bật nhất của chùa.'),
 ('LU_COURT','en','Courtyard and Gardens','Spacious grounds with greenery and sea views.',
  'The pagoda grounds blend gardens, trees and small landscapes on the mountainside overlooking the East Sea. Take a slow walk and enjoy the fresh air before reaching the most iconic feature of the pagoda.'),
 ('LU_STATUE','vi','Tượng Phật Bà Quan Thế Âm','Tượng Quan Thế Âm cao 67 mét hướng ra biển.',
  'Đây là tượng Phật Bà Quan Thế Âm cao 67 mét, được xem là một trong những tượng Quán Thế Âm cao nhất Việt Nam, đứng hướng ra biển như che chở cho ngư dân và cư dân thành phố. Tượng gồm nhiều tầng bên trong, mỗi tầng thờ các tượng Phật và Bồ Tát. Tượng được hoàn thành vào khoảng năm 2010, là biểu tượng tâm linh nổi bật của Đà Nẵng.'),
 ('LU_STATUE','en','Lady Buddha (Quan The Am) Statue','67-meter Avalokiteshvara statue facing the sea.',
  'This is the 67-meter statue of Lady Buddha, Quan The Am, among the tallest of its kind in Vietnam. She faces the sea, symbolically protecting fishermen and the residents of the city. The statue is hollow with multiple floors housing Buddha and Bodhisattva images, and was completed around 2010.'),
 ('LU_MAINHALL','vi','Chánh điện','Nơi thờ tự chính của chùa.',
  'Chánh điện là nơi thờ Đức Phật và là không gian hành lễ chính của chùa. Kiến trúc mang đậm phong cách Phật giáo Việt Nam với mái cong, họa tiết tinh xảo. Mời quý khách giữ trang phục lịch sự và giữ yên lặng khi vào tham quan, lễ Phật.'),
 ('LU_MAINHALL','en','Main Hall','The main place of worship of the pagoda.',
  'The Main Hall enshrines the Buddha and is the main place of worship. Its architecture reflects Vietnamese Buddhist style with curved roofs and detailed ornamentation. Please dress modestly and keep quiet while visiting.'),
 ('LU_ARHAT','vi','Vườn tượng La Hán','Khu vườn có các tượng La Hán.',
  'Khu vườn này có các tượng La Hán với nhiều dáng vẻ khác nhau, thể hiện hình ảnh các vị đệ tử giác ngộ của Đức Phật. Mỗi pho tượng là một câu chuyện nhắc nhở về từ bi, trí tuệ và sự tinh tấn.'),
 ('LU_ARHAT','en','Arhat Statue Garden','Garden of Arhat statues.',
  'This garden features statues of Arhats, enlightened disciples of the Buddha, each in a different posture. Every statue carries a story that reminds visitors of compassion, wisdom and diligence.'),
 ('LU_VIEW','vi','Điểm ngắm toàn cảnh biển và thành phố','Tầm nhìn ra vịnh Đà Nẵng.',
  'Từ vị trí này, quý khách có thể phóng tầm mắt ra vịnh Đà Nẵng, biển Đông và một phần thành phố phía xa. Đây là nơi lý tưởng để chụp ảnh lưu niệm và kết thúc hành trình tham quan.'),
 ('LU_VIEW','en','Panoramic Viewpoint','View over Da Nang Bay.',
  'From here you can enjoy a wide view of Da Nang Bay, the East Sea and part of the city in the distance. It is a perfect place for photos and for concluding your visit.')
) AS v(code, lang, title, sd, nar) ON v.code = p.code;

-- Tuyến tham quan
INSERT INTO tours (code, duration_minutes) VALUES ('TOUR_FULL', 90), ('TOUR_QUICK', 45), ('TOUR_SPIRIT', 60);
INSERT INTO tour_translations (tour_id, language_code, name, description)
SELECT t.id, v.lang, v.name, v.descr FROM tours t JOIN (VALUES
 ('TOUR_FULL','vi','Tuyến toàn cảnh','Tham quan đầy đủ các điểm nổi bật.'),
 ('TOUR_FULL','en','Full journey','Visit all the highlights.'),
 ('TOUR_FULL','zh','全景路线','参观所有亮点。'),
 ('TOUR_FULL','ko','전체 코스','모든 명소를 둘러봅니다.'),
 ('TOUR_QUICK','vi','Tuyến nhanh 45 phút','Tam Quan, tượng Quan Âm, Chánh điện.'),
 ('TOUR_QUICK','en','Quick 45-minute route','Tam Quan, Lady Buddha, Main Hall.'),
 ('TOUR_QUICK','zh','45分钟快速路线','三关门、观音像、正殿。'),
 ('TOUR_QUICK','ko','45분 빠른 코스','삼관문, 관세음보살상, 본전.'),
 ('TOUR_SPIRIT','vi','Tuyến tâm linh','Chiêm bái yên tĩnh: Chánh điện, vườn La Hán, tượng Quan Âm.'),
 ('TOUR_SPIRIT','en','Spiritual route','Main Hall, Arhat Garden, Lady Buddha.'),
 ('TOUR_SPIRIT','zh','朝圣路线','正殿、罗汉园、观音像。'),
 ('TOUR_SPIRIT','ko','순례 코스','본전, 나한 정원, 관세음보살상.')
) AS v(code, lang, name, descr) ON v.code = t.code;

INSERT INTO tour_pois (tour_id, poi_id, stop_order)
SELECT t.id, p.id, v.o FROM (VALUES
 ('TOUR_FULL','LU_GATE',1),('TOUR_FULL','LU_COURT',2),('TOUR_FULL','LU_STATUE',3),
 ('TOUR_FULL','LU_MAINHALL',4),('TOUR_FULL','LU_ARHAT',5),('TOUR_FULL','LU_VIEW',6),
 ('TOUR_QUICK','LU_GATE',1),('TOUR_QUICK','LU_STATUE',2),('TOUR_QUICK','LU_MAINHALL',3),
 ('TOUR_SPIRIT','LU_MAINHALL',1),('TOUR_SPIRIT','LU_ARHAT',2),('TOUR_SPIRIT','LU_STATUE',3)
) AS v(tc, pc, o) JOIN tours t ON t.code = v.tc JOIN pois p ON p.code = v.pc;

-- Dịch vụ
INSERT INTO services (code, unit_price) VALUES ('LUNCH', 80000), ('ECART', 50000), ('GUIDE', 150000);
INSERT INTO service_translations (service_id, language_code, name, description, unit)
SELECT s.id, v.lang, v.name, v.descr, v.unit FROM services s JOIN (VALUES
 ('LUNCH','vi','Cơm chay trưa','Suất cơm chay 4 món do nhà chùa chuẩn bị.','suất'),
 ('LUNCH','en','Vegetarian lunch','Four-dish vegetarian set prepared by the pagoda.','set'),
 ('LUNCH','zh','素食午餐','寺院准备的四道素食套餐。','份'),
 ('LUNCH','ko','채식 점심','사찰에서 준비한 4가지 채식 세트.','인분'),
 ('ECART','vi','Xe điện tham quan','Xe điện đưa đón quanh khuôn viên chùa.','lượt'),
 ('ECART','en','Electric cart','Electric cart ride around the pagoda grounds.','ride'),
 ('ECART','zh','观光电瓶车','寺院园区内电瓶车接送。','次'),
 ('ECART','ko','전기차 투어','사찰 경내를 순환하는 전기차.','회'),
 ('GUIDE','vi','Hướng dẫn viên','Hướng dẫn viên đi cùng nhóm tham quan.','nhóm'),
 ('GUIDE','en','Tour guide','A guide accompanies your group.','group'),
 ('GUIDE','zh','导游服务','导游陪同团队参观。','团'),
 ('GUIDE','ko','가이드','그룹과 함께하는 가이드.','그룹')
) AS v(code, lang, name, descr, unit) ON v.code = s.code;

-- Dữ liệu doanh thu mẫu 10 ngày gần đây (đã thanh toán)
WITH g AS (SELECT n FROM generate_series(1, 45) n),
     sv AS (SELECT id, unit_price, row_number() OVER (ORDER BY id) AS rn FROM services)
INSERT INTO orders (order_code, qr_token, device_id, service_id, quantity, unit_price, total_amount,
                    customer_name, customer_phone, visit_date, status, created_at, paid_at, used_at, confirmed_by)
SELECT 'LUS' || lpad(g.n::text, 4, '0'), md5('seed' || g.n), 'seed-device', sv.id,
       1 + (g.n % 4), sv.unit_price, (1 + (g.n % 4)) * sv.unit_price,
       'Khách mẫu ' || g.n, '090' || lpad((1000000 + g.n * 7919)::text, 7, '0'),
       (current_date - (g.n % 10)),
       CASE WHEN g.n % 10 > 1 THEN 'used'::order_status ELSE 'paid'::order_status END,
       (current_date - (g.n % 10))::timestamp + time '08:00' + (g.n % 8) * interval '1 hour',
       (current_date - (g.n % 10))::timestamp + time '08:10' + (g.n % 8) * interval '1 hour',
       CASE WHEN g.n % 10 > 1 THEN (current_date - (g.n % 10))::timestamp + time '09:30' END,
       1
FROM g JOIN sv ON sv.rn = (g.n % 3) + 1;

-- Một đơn đang chờ thanh toán để demo
INSERT INTO orders (order_code, qr_token, device_id, service_id, quantity, unit_price, total_amount,
                    customer_name, customer_phone, visit_date, status)
SELECT 'LUDEMO01', md5('demo-pending'), 'seed-device', id, 2, unit_price, 2 * unit_price,
       'Nguyễn Văn A', '0905123456', current_date, 'pending'
FROM services WHERE code = 'LUNCH';

-- Một vài lượt nghe mẫu
INSERT INTO poi_listens (poi_id, language_code, device_id, source, created_at)
SELECT p.id, (ARRAY['vi','en','vi','zh','ko'])[1 + (n % 5)], 'seed-device', 'manual', now() - (n % 9) * interval '1 day'
FROM pois p CROSS JOIN generate_series(1, 12) n WHERE (n + p.id) % 3 <> 0;
