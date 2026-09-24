import { eventBus } from './eventBus.ts';

export interface TicketPackage {
  id: string;
  name: {
    vi: string;
    en: string;
    zh: string;
    ko: string;
    ja: string;
    fr: string;
  };
  priceVnd: number;
  originalPriceVnd?: number;
  category: 'transport' | 'exhibition' | 'experience' | 'audio_device' | 'dining';
  includes: {
    vi: string[];
    en: string[];
    zh: string[];
    ko: string[];
    ja: string[];
    fr: string[];
  };
  durationText: string;
  badge?: string;
  image: string;
}

export interface BookingOrder {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  visitDate: string;
  ticketId: string;
  ticketName: string;
  quantity: number;
  totalAmountVnd: number;
  paymentMethod?: string;
  status: 'PENDING_PAYMENT' | 'PAID' | 'CHECKED_IN' | 'CANCELLED';
  qrTicketCode: string;
  createdAt: string;
  paidAt?: string;
}

class BookingService {
  private ticketPackages: TicketPackage[] = [
    {
      id: 'ticket_buggy_shuttle',
      name: {
        vi: 'Vé Xe Điện Buggy Bãi Bụt & Sơn Trà (Khứ Hồi)',
        en: 'Electric Buggy Shuttle - Roundtrip',
        zh: '山茶佛滩环保观光电动车（往返）',
        ko: '손트라 바이붓 전동 버기카 (왕복)',
        ja: 'ソンチャ観光エコ電気カート（往復）',
        fr: 'Navette Buggy Électrique (Aller-Retour)'
      },
      priceVnd: 50000,
      originalPriceVnd: 60000,
      category: 'transport',
      durationText: 'Sử dụng trong ngày (All-day valid)',
      badge: 'Bán chạy',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      includes: {
        vi: ['Đưa đón 2 chiều bến xe Sơn Trà - Chùa Linh Ứng', 'Ưu tiên lên xe không cần xếp hàng lâu', 'Miễn phí trẻ em dưới 1 mét'],
        en: ['2-way transfer Son Tra Hub - Linh Ung Pagoda', 'Priority fast-track boarding', 'Free for children under 1m'],
        zh: ['山茶游客中心至灵应寺双向接驳', '快速通道免排队登车', '身高1米以下儿童免费'],
        ko: ['손트라 허브 - 영응사 왕복 탑승권', '대기 없는 우선 탑승 혜택', '1m 미만 아동 무료'],
        ja: ['ソンチャハブ〜霊応寺 往復送迎', 'スムーズな優先搭乗', '1m未満のお子様無料'],
        fr: ['Navette aller-retour Son Tra - Pagode Linh Ung', 'Accès prioritaire sans attente', 'Gratuit pour les enfants < 1m']
      }
    },
    {
      id: 'ticket_xaloi_exhibition',
      name: {
        vi: 'Vé Chiêm Bái Bảo Vật & Tháp Xá Lợi 9 Tầng',
        en: '9-Story Sarira Relic & Sacred Treasures Pass',
        zh: '九层佛舍利塔与传世圣物特展门票',
        ko: '9층 사리탑 진신사리 및 불교 유물 특별전',
        ja: '九重舎利塔 聖遺物・仏宝特別拝観券',
        fr: 'Billet Découverte des Reliques Sacrées du Stupa'
      },
      priceVnd: 30000,
      category: 'exhibition',
      durationText: '45 phút tham quan',
      badge: 'Linh thiêng',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
      includes: {
        vi: ['Chiêm bái ngọc xá lợi Phật cổ truyền', 'Bộ thuyết minh tự động qua tai nghe', 'Tặng 1 thẻ bình an chùa Linh Ứng'],
        en: ['View sacred ancient Buddha sarira pearls', 'Complimentary headset audio guide', 'Blessed amulet souvenir keepsake'],
        zh: ['近距离瞻仰千年佛陀真身舍利', '专属多语种导览耳机讲解', '获赠灵应寺吉祥平安祈福卡'],
        ko: ['천년 부처님 진신사리 친견', '한국어 음성 가이드 헤드셋 지원', '영응사 길상 평안 부적 기념품 증정'],
        ja: ['古代仏舎利の特別拝観', '専用オーディオガイド貸出', '開運厄除お守りカード進呈'],
        fr: ['Admiration des reliques du Bouddha', 'Casque d\'audioguide inclus', 'Carte talisman bénie offerte']
      }
    },
    {
      id: 'ticket_hoanghon_cau_an',
      name: {
        vi: 'Combo Hoàng Hôn Bãi Bụt: Hoa Đăng Cầu An & Trà Thiền',
        en: 'Sunset Spiritual Combo: Floating Lantern & Zen Tea',
        zh: '暮光禅修套餐：水灯祈愿与高山禅茶',
        ko: '선셋 힐링 콤보: 소원 유등 띄우기 & 다도 체험',
        ja: '黄昏の癒しセット：祈願灯籠流しと禅茶体験',
        fr: 'Combo Crépuscule : Lanterne des Vœux & Cérémonie du Thé'
      },
      priceVnd: 150000,
      originalPriceVnd: 180000,
      category: 'experience',
      durationText: '75 phút trải nghiệm (17:00 - 18:15)',
      badge: 'Đặc sắc nhất',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      includes: {
        vi: ['1 bộ hoa đăng sen thả hồ nguyện ước an lành', 'Thưởng thức trà thảo mộc sương mù Sơn Trà', 'Vị trí ghế ngồi ngắm hoàng hôn vịnh biển đẹp nhất', 'Hướng dẫn viên thuyết minh phong tục tâm linh'],
        en: ['1 Lotus flower floating lantern for prayer', 'Artisanal mist tea tasting session', 'Reserved panoramic sunset terrace seat', 'Dedicated cultural guide commentary'],
        zh: ['一盏亲手点燃祈福许愿荷花水灯', '品鉴山茶半岛云雾有机禅茶', '观景天台专属夕阳落日雅座', '专业文史导师随行导览解说'],
        ko: ['소원 성취 연꽃 유등 1세트', '손트라 운무 유기농 전통차 시음', '일몰 파노라마 테라스 전용 좌석', '전문 해설사의 문화재 심층 해설'],
        ja: ['祈願ロータス灯籠流し 1基', 'ソンチャ名産オーガニック茶の試飲', '絶景サンセット特等席のご案内', '専任ガイドによる歴史・仏教解説'],
        fr: ['Une lanterne de lotus pour les vœux', 'Dégustation de thé montagnard', 'Siège panoramique réservé au crépuscule', 'Accompagnement par un guide culturel']
      }
    },
    {
      id: 'ticket_headset_smart',
      name: {
        vi: 'Thuê Thiết Bị Thuyết Minh Thông Minh Tự Động (Smart Headset)',
        en: 'Smart Auto-Trigger Audio Guide Device',
        zh: '智能位置感知无线导览机租赁',
        ko: '위치기반 스마트 오디오 가이드 대여',
        ja: '位置感知式スマート音声ガイド機器レンタル',
        fr: 'Location d\'Audioguide Géolocalisé Intelligent'
      },
      priceVnd: 25000,
      category: 'audio_device',
      durationText: 'Toàn bộ thời gian tham quan',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      includes: {
        vi: ['Tự động phát thuyết minh khi bước tới gần di tích', '6 ngôn ngữ chuẩn giọng đọc chuyên nghiệp', 'Khử ồn gió biển tuyệt đối'],
        en: ['Auto-plays stories when approaching monuments', 'Studio-recorded 6 language tracks', 'Active wind noise reduction'],
        zh: ['靠近景点自动感应播放讲解', '6国语言录音棚级母语播音', '强效过滤强劲海风环境杂音'],
        ko: ['유적지 접근 시 자동 음성 재생', '6개 언어 전문 성우 녹음', '바닷바람 완벽 노이즈 캔슬링'],
        ja: ['各見どころへの接近時に自動解説再生', '6言語対応のプロナレーション', '海風を防ぐノイズキャンセリング'],
        fr: ['Déclenchement automatique près des monuments', '6 langues en voix studio professionnelle', 'Réduction du bruit du vent']
      }
    },
    {
      id: 'ticket_com_chay_tinh_tam',
      name: {
        vi: 'Suất Cơm Chay Tịnh Tâm Nhà Tăng Linh Ứng',
        en: 'Serenity Vegetarian Temple Lunch Voucher',
        zh: '灵应寺清心禅味素斋套餐券',
        ko: '영응사 청심 사찰 채식 식사권',
        ja: '霊応寺 精進料理（寺院ヴィーガンランチ）',
        fr: 'Repas Végétarien Zen au Réfectoire du Temple'
      },
      priceVnd: 60000,
      category: 'dining',
      durationText: 'Phục vụ từ 11:00 - 13:30',
      badge: 'Thực dưỡng',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      includes: {
        vi: ['5 món chay truyền thống theo mùa', 'Canh dưỡng sinh nấm hạt sen', 'Trà vối ấm thanh lọc cơ thể'],
        en: ['5 seasonal gourmet temple dishes', 'Lotus seed and wild mushroom wellness soup', 'Herbal cleansing detox tea'],
        zh: ['五道时令禅风精进素食佳肴', '莲子鲜蕈养生炖汤', '暖心清润草本禅茶'],
        ko: ['제철 사찰식 5찬 정식', '연자육 버섯 보양 맑은 국', '몸을 맑게 하는 따뜻한 허브차'],
        ja: ['季節の精進料理5品', '蓮の実と茸の養生スープ', '体に優しい温かい野草茶'],
        fr: ['5 mets végétariens de saison', 'Soupe bienfaisante graines de lotus et champignons', 'Thé détoxifiant purifiant']
      }
    }
  ];

  private orders: Map<string, BookingOrder> = new Map();

  constructor() {
    // Seed sample completed order
    const sampleId = 'LU-BKG-883192';
    this.orders.set(sampleId, {
      bookingId: sampleId,
      customerName: 'Nguyễn Văn An',
      customerPhone: '0905123456',
      customerEmail: 'an.nguyen@example.com',
      visitDate: new Date().toISOString().split('T')[0],
      ticketId: 'ticket_buggy_shuttle',
      ticketName: 'Vé Xe Điện Buggy Bãi Bụt & Sơn Trà (Khứ Hồi)',
      quantity: 2,
      totalAmountVnd: 100000,
      paymentMethod: 'VIETQR',
      status: 'PAID',
      qrTicketCode: `PASS_${sampleId}_HASH8934`,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      paidAt: new Date(Date.now() - 3500000).toISOString()
    });
  }

  public getPackages(lang: string = 'vi') {
    const l = (['vi', 'en', 'zh', 'ko', 'ja', 'fr'].includes(lang) ? lang : 'vi') as 'vi' | 'en' | 'zh' | 'ko' | 'ja' | 'fr';

    eventBus.publish('BookingService', 'PACKAGES_FETCHED', { lang }, {
      targetService: 'ClientApp',
      latencyMs: 8
    });

    return this.ticketPackages.map(pkg => ({
      id: pkg.id,
      name: pkg.name[l] || pkg.name.vi,
      priceVnd: pkg.priceVnd,
      originalPriceVnd: pkg.originalPriceVnd,
      category: pkg.category,
      includes: pkg.includes[l] || pkg.includes.vi,
      durationText: pkg.durationText,
      badge: pkg.badge,
      image: pkg.image
    }));
  }

  public createBooking(data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    ticketId: string;
    quantity: number;
    visitDate: string;
  }): BookingOrder {
    const pkg = this.ticketPackages.find(p => p.id === data.ticketId);
    if (!pkg) {
      throw new Error(`Ticket package not found: ${data.ticketId}`);
    }

    const bookingId = `LU-BKG-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalAmount = pkg.priceVnd * data.quantity;
    const qrTicketCode = `LU_PASS_${bookingId}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const order: BookingOrder = {
      bookingId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || 'khach.thamquan@chualinhung.vn',
      visitDate: data.visitDate,
      ticketId: pkg.id,
      ticketName: pkg.name.vi,
      quantity: data.quantity,
      totalAmountVnd: totalAmount,
      status: 'PENDING_PAYMENT',
      qrTicketCode,
      createdAt: new Date().toISOString()
    };

    this.orders.set(bookingId, order);

    eventBus.publish('BookingService', 'BOOKING_CREATED', {
      bookingId,
      ticketId: pkg.id,
      totalAmountVnd: totalAmount,
      customerName: data.customerName
    }, {
      targetService: 'PaymentService',
      latencyMs: 12
    });

    return order;
  }

  public getBookingById(bookingId: string): BookingOrder | null {
    return this.orders.get(bookingId) || null;
  }

  public updateBookingStatus(
    bookingId: string,
    status: 'PENDING_PAYMENT' | 'PAID' | 'CHECKED_IN' | 'CANCELLED',
    paymentMethod?: string
  ): BookingOrder | null {
    const order = this.orders.get(bookingId);
    if (!order) return null;

    order.status = status;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (status === 'PAID') order.paidAt = new Date().toISOString();

    this.orders.set(bookingId, order);

    eventBus.publish('BookingService', 'BOOKING_STATUS_UPDATED', {
      bookingId,
      status,
      paymentMethod
    }, {
      targetService: 'AnalyticsService',
      latencyMs: 10
    });

    return order;
  }
}

export const bookingService = new BookingService();
