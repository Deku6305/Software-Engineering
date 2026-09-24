import { eventBus } from './eventBus.ts';

export interface RouteStep {
  stepNumber: number;
  instruction: {
    vi: string;
    en: string;
    zh: string;
    ko: string;
    ja: string;
    fr: string;
  };
  distanceMeters: number;
  estimatedMinutes: number;
  terrainType: 'flat_stone' | 'marble_stairs' | 'gentle_slope' | 'coastal_boardwalk';
  icon: string;
}

export interface SuggestedItinerary {
  id: string;
  name: {
    vi: string;
    en: string;
    zh: string;
    ko: string;
    ja: string;
    fr: string;
  };
  durationText: string;
  estimatedMinutes: number;
  distanceMeters: number;
  calorieBurn: number;
  recommendedTime: string;
  poiSequence: string[];
  description: {
    vi: string;
    en: string;
    zh: string;
    ko: string;
    ja: string;
    fr: string;
  };
  badge: string;
}

class NavigationService {
  private itineraries: SuggestedItinerary[] = [
    {
      id: 'tour_tinh_hoa_45m',
      name: {
        vi: 'Hành Trình Tinh Hoa (45 phút)',
        en: 'Essential Highlights Tour (45 mins)',
        zh: '精华参访之径（45分钟）',
        ko: '핵심 하이라이트 투어 (45분)',
        ja: 'エッセンシャル見どころ巡り（45分）',
        fr: 'Circuit Essentiel (45 min)'
      },
      durationText: '45 phút',
      estimatedMinutes: 45,
      distanceMeters: 650,
      calorieBurn: 110,
      recommendedTime: 'Mọi thời điểm trong ngày (Morning/Afternoon)',
      poiSequence: ['poi_cong_tamquan', 'poi_18_lahan', 'poi_chanhdien', 'poi_quanam_67m'],
      description: {
        vi: 'Dành cho du khách có thời gian ngắn, chiêm bái Cổng Tam Quan, Vườn 18 vị La Hán, Chánh Điện và chiêm ngưỡng tượng Phật Bà Quan Âm 67m.',
        en: 'Perfect for visitors with limited time: enter through Tam Quan, wander the 18 Arhats, pray at the Main Hall, and stand before Lady Buddha.',
        zh: '适合时间较紧凑的游人：历经三门、十八罗汉石像群、大雄宝殿，至67米观音大佛前祈愿。',
        ko: '시간이 촉박한 여행객에게 추천합니다. 삼문, 18나한 정원, 대웅보전 및 67m 해수관음상을 순차적으로 둘러봅니다.',
        ja: '短時間で巡りたい方に最適。三門、十八羅漢庭園、本堂、そして67mの観音像を効率よく参拝します。',
        fr: 'Idéal pour une visite rapide des symboles majeurs du sanctuaire.'
      },
      badge: 'Phổ biến nhất'
    },
    {
      id: 'tour_chiem_bai_toan_canh_2h',
      name: {
        vi: 'Chiêm Bái Toàn Cảnh & Bãi Bụt (2 giờ)',
        en: 'Panoramic Pilgrimage & Ocean Trails (2 hours)',
        zh: '全景朝拜与山海秘境（2小时）',
        ko: '파노라마 순례 및 오션뷰 탐방 (2시간)',
        ja: '霊応全景と東シナ海パノラマ（2時間）',
        fr: 'Pèlerinage Panoramique & Sentier Marin (2 heures)'
      },
      durationText: '120 phút',
      estimatedMinutes: 120,
      distanceMeters: 1450,
      calorieBurn: 240,
      recommendedTime: 'Sáng sớm (7:00 - 9:00) hoặc Buổi chiều (15:30 - 17:30)',
      poiSequence: ['poi_cong_tamquan', 'poi_18_lahan', 'poi_chanhdien', 'poi_quanam_67m', 'poi_thap_xaloi', 'poi_vong_canh'],
      description: {
        vi: 'Khám phá trọn vẹn nét văn hóa kiến trúc Phật giáo, leo Tháp Xá Lợi 9 tầng và đón gió biển ngoạn mục tại Vọng Cảnh Bãi Bụt.',
        en: 'Comprehensive tour exploring the sacred sanctum, ascending the 9-Story Stupa, and unwinding at the ocean-cliff scenic pavilion.',
        zh: '深度探索佛教建筑之美，登临九层舍利宝塔，并在佛滩观景台放眼东海辽阔胜景。',
        ko: '사찰의 모든 정취를 만끽하는 코스로 9층 사리탑과 바이붓 오션뷰 전망대까지 완벽히 감상합니다.',
        ja: '寺院の全貌を深く巡り、九重仏舎利塔やバイブット展望台からの絶景を心ゆくまで堪能します。',
        fr: 'Visite approfondie incluant le Stupa des Reliques et la terrasse dominant l\'océan.'
      },
      badge: 'Được yêu thích'
    },
    {
      id: 'tour_hoang_hon_thien_dinh_1h30',
      name: {
        vi: 'Hoàng Hôn & Thiền Định An Lạc (90 phút)',
        en: 'Sunset Meditation & Serenity Path (90 mins)',
        zh: '暮色禅风与心灵沉淀（90分钟）',
        ko: '일몰 명상과 힐링 산책로 (90분)',
        ja: '夕陽の瞑想と静寂の散策路（90分）',
        fr: 'Sérénité au Crépuscule & Méditation (90 min)'
      },
      durationText: '90 phút',
      estimatedMinutes: 90,
      distanceMeters: 1100,
      calorieBurn: 180,
      recommendedTime: 'Buổi chiều hoàng hôn (16:30 - 18:30)',
      poiSequence: ['poi_vong_canh', 'poi_thap_xaloi', 'poi_quanam_67m', 'poi_chanhdien'],
      description: {
        vi: 'Lắng nghe chuông chiều ngân vang, ngắm mặt trời lặn sau dãy Ngũ Hành Sơn và ánh đèn rực rỡ dần thắp lên khắp vịnh Đà Nẵng.',
        en: 'Hear evening temple gongs, watch twilight tint the sea golden, and witness Da Nang city sparkle in distant dusk.',
        zh: '聆听古寺暮鼓晨钟，沐浴绚烂晚霞，在海风与佛韵中寻得内心的极致宁静。',
        ko: '저녁 범종 소리를 들으며 다낭의 황홀한 노을과 야경을 맞이하는 감성 힐링 코스입니다.',
        ja: '暮れなずむ海に響く梵鐘を聞きながら、夕陽とダナンの夜景を静かに楽しむ贅沢なひととき。',
        fr: 'Admirez le coucher du soleil au son des cloches du soir avec vue sur Da Nang.'
      },
      badge: 'Hoàng hôn lãng mạn'
    }
  ];

  public getSuggestedItineraries(lang: string = 'vi'): any[] {
    eventBus.publish('NavigationService', 'ITINERARIES_ACCESSED', { lang }, {
      targetService: 'ClientApp',
      latencyMs: 7
    });

    return this.itineraries.map(it => ({
      id: it.id,
      name: it.name[lang as keyof typeof it.name] || it.name.vi,
      durationText: it.durationText,
      estimatedMinutes: it.estimatedMinutes,
      distanceMeters: it.distanceMeters,
      calorieBurn: it.calorieBurn,
      recommendedTime: it.recommendedTime,
      poiSequence: it.poiSequence,
      description: it.description[lang as keyof typeof it.description] || it.description.vi,
      badge: it.badge
    }));
  }

  public calculateRoute(fromPoiId: string, toPoiId: string, lang: string = 'vi') {
    const l = (['vi', 'en', 'zh', 'ko', 'ja', 'fr'].includes(lang) ? lang : 'vi') as 'vi' | 'en' | 'zh' | 'ko' | 'ja' | 'fr';

    const stepsMap: Record<string, RouteStep[]> = {
      default: [
        {
          stepNumber: 1,
          instruction: {
            vi: 'Bắt đầu từ vị trí hiện tại, đi thẳng theo lối đi lát đá cẩm thạch râm mát bóng cây sala.',
            en: 'Start from current position, proceed straight along the shaded marble pathway.',
            zh: '由当前位置启程，沿娑罗树荫掩映的白石甬道直行。',
            ko: '현재 위치에서 사라수 그늘이 드리워진 대리석 산책로를 따라 직진합니다.',
            ja: '現在地よりスタートし、サラの木陰が心地よい白石の小道を直進します。',
            fr: 'Partez du point actuel et avancez le long de l\'allée ombragée.'
          },
          distanceMeters: 45,
          estimatedMinutes: 1,
          terrainType: 'flat_stone',
          icon: 'Footprints'
        },
        {
          stepNumber: 2,
          instruction: {
            vi: 'Gặp ngã ba lối rẽ, rẽ phải và bước lên 18 bậc thang đá dẫn lên sân chính (chú ý giữ tay vịn đá).',
            en: 'At the fork, turn right and ascend 18 stone steps toward the main courtyard (use handrails if needed).',
            zh: '行至分岔口，右转缓步登上18级石阶通往主广场（雨天请注意防滑）。',
            ko: '갈림길에서 우회전하여 18개의 완만한 돌계단을 오릅니다.',
            ja: '分岐路を右折し、広場へと続く18段の石段を上がります。',
            fr: 'À l\'intersection, tournez à droite et montez les 18 marches de pierre.'
          },
          distanceMeters: 60,
          estimatedMinutes: 2,
          terrainType: 'marble_stairs',
          icon: 'TrendingUp'
        },
        {
          stepNumber: 3,
          instruction: {
            vi: 'Điểm đến nằm ngay phía trước bên tay phải của bạn. Bạn đã đến nơi an toàn!',
            en: 'Your destination is directly ahead on your right. You have arrived safely!',
            zh: '您的目的地即在前方右侧，顺利抵达！',
            ko: '목적지가 바로 앞 우측에 자리하고 있습니다. 안전하게 도착했습니다!',
            ja: '目的地が前方右手に見えてまいります。ご到着です。',
            fr: 'Votre destination se trouve juste devant vous à droite. Vous êtes arrivés !'
          },
          distanceMeters: 30,
          estimatedMinutes: 1,
          terrainType: 'flat_stone',
          icon: 'MapPin'
        }
      ]
    };

    const steps = stepsMap[`${fromPoiId}->${toPoiId}`] || stepsMap.default;

    const totalDistance = steps.reduce((sum, s) => sum + s.distanceMeters, 0);
    const totalMinutes = steps.reduce((sum, s) => sum + s.estimatedMinutes, 0);

    eventBus.publish('NavigationService', 'ROUTE_CALCULATED', {
      fromPoiId,
      toPoiId,
      totalDistance,
      totalMinutes
    }, {
      targetService: 'PoiAudioService',
      latencyMs: 14
    });

    return {
      fromPoiId,
      toPoiId,
      totalDistanceMeters: totalDistance,
      estimatedMinutes: totalMinutes,
      steps: steps.map(s => ({
        stepNumber: s.stepNumber,
        instruction: s.instruction[l] || s.instruction.vi,
        distanceMeters: s.distanceMeters,
        estimatedMinutes: s.estimatedMinutes,
        terrainType: s.terrainType,
        icon: s.icon
      })),
      safetyNote: {
        vi: 'Khuyến cáo: Đường dốc nhẹ, chú ý bậc đá trơn khi trời sương mù hoặc mưa nhẹ.',
        en: 'Notice: Gentle slopes, take care on marble steps during morning mist or rain.',
        zh: '温馨提示：坡度平缓，晨间云雾或雨水天气地面微湿，谨防滑倒。',
        ko: '안내: 가벼운 경사로이며 안개나 빗길에는 돌계단이 미끄러울 수 있으니 주의하세요.',
        ja: '注意：緩やかな坂道です。霧や雨の日の石段は滑りやすいためご注意ください。',
        fr: 'Attention : Pentes douces, prudence sur les marches humides.'
      }[l]
    };
  }
}

export const navigationService = new NavigationService();
