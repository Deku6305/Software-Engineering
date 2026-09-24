import { eventBus } from './eventBus.ts';

export interface MultilingualText {
  vi: string;
  en: string;
  zh: string;
  ko: string;
  ja: string;
  fr: string;
}

export interface MonumentPOI {
  id: string;
  code: string; // QR code key
  name: MultilingualText;
  titleTag: MultilingualText;
  category: 'monument' | 'temple' | 'nature' | 'viewpoint' | 'relic';
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // 0-100% on pagoda interactive SVG map
    mapY: number; // 0-100%
    elevationMeters: number;
    compassBearing: number; // degrees for AR
  };
  audioDurationSeconds: number;
  audioVoiceFile: string;
  image: string;
  brief: MultilingualText;
  fullHistory: MultilingualText;
  spiritualMeaning: MultilingualText;
  architecturalHighlights: MultilingualText[];
  visitingTips: MultilingualText;
  arModelType: 'lotus_halo' | 'sacred_stupa' | 'dragon_eaves' | 'arhat_relic' | 'viewpoint_portal';
}

class PoiAudioService {
  private pois: MonumentPOI[] = [
    {
      id: 'poi_quanam_67m',
      code: 'LU-QUANAM-01',
      name: {
        vi: 'Tượng Phật Bà Quan Thế Âm 67m',
        en: '67m Lady Buddha Bodhisattva Statue',
        zh: '67米观世音菩萨圣像',
        ko: '67m 해수관음상',
        ja: '67m 観世音菩薩像',
        fr: 'Statue de la Bodhisattva Guanyin (67m)'
      },
      titleTag: {
        vi: 'Biểu tượng tâm linh cao nhất Việt Nam',
        en: 'Highest Buddhist landmark in Vietnam',
        zh: '越南最高观音像与岘港守护标志',
        ko: '베트남 최대 높이의 자비의 상징',
        ja: 'ベトナム最高峰の慈悲のシンボル',
        fr: 'Plus haute statue bouddhique du Vietnam'
      },
      category: 'monument',
      coordinates: {
        lat: 16.1001,
        lng: 108.2778,
        mapX: 62,
        mapY: 38,
        elevationMeters: 135,
        compassBearing: 85
      },
      audioDurationSeconds: 195,
      audioVoiceFile: 'audio_quanam_narration.mp3',
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
      brief: {
        vi: 'Tượng Phật Bà Quan Thế Âm cao 67m, đường kính tòa sen 35m, hướng mặt nhìn ra biển Đông bao bọc bình yên cho ngư dân Đà Nẵng.',
        en: 'Standing at 67 meters on a 35-meter lotus pedestal, Lady Buddha faces the East Sea, watching over fishermen and guarding the city.',
        zh: '高67米，伫立在直径35米的莲花宝座之上，俯瞰东海，护佑岘港渔民与苍生风调雨顺。',
        ko: '높이 67m, 35m 연꽃 좌대 위에 서서 동해 바다를 바라보며 어민들의 평안과 다낭 도시를 수호합니다.',
        ja: '高さ67メートル、直径35メートルの蓮華座に立ち、東シナ海を見守りダナンの人々に平安をもたらします。',
        fr: 'Culminant à 67 mètres sur un piédestal en lotus de 35 mètres, la Bodhisattva veille sur les marins de Da Nang.'
      },
      fullHistory: {
        vi: 'Được khởi công xây dựng vào ngày 19 tháng 6 năm 2004 và hoàn thành năm 2010 dưới sự chủ trì của Cố Thượng tọa Thích Thiện Nguyện. Tượng đứng tựa lưng vào đỉnh Sơn Trà hùng vĩ, một tay bắt ấn tam muội, tay kia cầm bình nước cam lộ như rưới an lành cho nhân gian. Bên trong lòng tượng gồm 17 tầng, mỗi tầng đều có bàn thờ 21 bức tượng Phật với hình dáng và vẻ mặt khác nhau gọi là "Phật trung hữu Phật". Trên mũ tượng có tượng Phật Tổ cao 2m.',
        en: 'Construction began on June 19, 2004 and completed in 2010 under the guidance of Venerable Thich Thien Nguyen. Backed by Son Tra Mountain and overlooking the vast ocean, one hand holds the nectar bottle while the other forms the fear-dispelling mudra. The statue interior contains 17 storeys, each housing altars with 21 Buddha statues in varied spiritual aspects.',
        zh: '于2004年6月19日奠基，2010年竣工，由释善愿上座主持兴建。佛像背依苍翠山麓，面向浩瀚东海，一手结三昧印，一手持甘露宝瓶。雕像内部共有17层，每层供奉21尊姿态各异的佛像，冠冕顶端更矗立一尊2米高的释迦牟尼佛像。',
        ko: '2004년 6월 착공되어 2010년에 완공되었으며 고 틱 티엔 응우옌 스님의 원력으로 조성되었습니다. 거대한 산을 등지고 바다를 품으며, 한 손에는 감로수 병을, 다른 손은 인을 맺고 있습니다. 내부에는 17층이 조성되어 각 층마다 21위의 불상이 모셔져 있습니다.',
        ja: '2004年に着工し2010年に落慶しました。ソンチャ半島の霊峰を背にし、海を見下ろす慈愛の姿。右手には甘露の壺を持ち、衆生に平和を降り注ぎます。胎内は17階層に分かれ、各階に21体の仏像が安置されています。',
        fr: 'Commencée en 2004 et inaugurée en 2010 sous l\'égide du Vénérable Thich Thien Nguyen. Adossée à la montagne de Son Tra, elle verse la rosée de bienveillance sur l\'océan. La structure intérieure abrite 17 étages avec 21 autels dédiés.'
      },
      spiritualMeaning: {
        vi: 'Quan Thế Âm biểu trưng cho hạnh nguyện đại từ đại bi, lắng nghe mọi âm thanh thống khổ của chúng sinh để cứu độ. Ngư dân trước mỗi chuyến ra khơi đều nhìn lên tượng để cầu sóng yên biển lặng.',
        en: 'The Bodhisattva of Compassion embodies selfless benevolence, hearing the cries of all beings and granting safe voyages across treacherous ocean storms.',
        zh: '观世音菩萨寻声救苦，慈悲无碍。出海渔民每逢启航皆合十仰望，祈求海不扬波、一帆风顺。',
        ko: '대자대비한 마음으로 고통받는 중생의 소리를 듣고 구제한다는 깊은 서원을 담고 있습니다.',
        ja: '大慈大悲の心で衆生の苦しみを聞き届け、荒海を渡る船乗りたちの航海安全を見守ります。',
        fr: 'Incarnation de la compassion universelle, elle écoute les tourments du monde et protège les marins.'
      },
      architecturalHighlights: [
        {
          vi: 'Độ cao 67m tương đương tòa nhà 30 tầng hiện đại',
          en: '67m height comparable to a modern 30-story skyscraper',
          zh: '67米高度相当于30层现代大楼',
          ko: '현대식 30층 건물에 필적하는 67m 웅장함',
          ja: '現代の30階建てビルに匹敵する67メートルの威容',
          fr: 'Hauteur majestueuse de 67m équivalente à 30 étages'
        },
        {
          vi: '17 tầng bên trong với 357 vị Phật và Bồ Tát tôn kính',
          en: '17 internal floors housing 357 distinct Buddha manifestations',
          zh: '内部17层供奉357尊庄严佛菩萨塑像',
          ko: '내부 17개 층에 모셔진 357위의 불보살',
          ja: '胎内17層に安置された357体の諸仏諸菩薩',
          fr: '17 étages intérieurs abritant 357 statues bouddhiques'
        },
        {
          vi: 'Tòa sen nở rộ 35m chạm khắc cánh sen trắng tinh xảo',
          en: '35m blooming lotus throne intricately sculpted in white granite',
          zh: '直径35米盛开白莲花基座，雕琢绝伦',
          ko: '정교하게 조각된 지름 35m 백색 연화대좌',
          ja: '精緻に彫り込まれた直径35mの白蓮華台座',
          fr: 'Socle en lotus épanoui de 35 mètres de diamètre'
        }
      ],
      visitingTips: {
        vi: 'Nên ghé thăm vào sáng sớm (6:30 - 8:30) hoặc lúc hoàng hôn (17:00 - 18:30) để ngắm trọn vẹn hào quang phản chiếu trên biển Đông.',
        en: 'Best visited during early morning (6:30 - 8:30 AM) or sunset (5:00 - 6:30 PM) for the magnificent reflection on the water.',
        zh: '建议清晨6:30-8:30或日落17:00-18:30前瞻仰，光影洒在东海波光之上格外神圣。',
        ko: '이른 아침(6:30-8:30)이나 일몰 무렵(17:00-18:30)에 방문하시면 동해의 장엄한 바다빛과 함께 감상할 수 있습니다.',
        ja: '早朝（6:30〜8:30）または夕暮れ時（17:00〜18:30）の参拝が最も光彩に満ちてお勧めです。',
        fr: 'Privilégiez le lever du soleil ou le crépuscule pour une atmosphère spirituelle baignée de lumière dorée.'
      },
      arModelType: 'lotus_halo'
    },
    {
      id: 'poi_chanhdien',
      code: 'LU-CHANHDIEN-02',
      name: {
        vi: 'Đại Hùng Bảo Điện (Chánh Điện)',
        en: 'Main Sanctuary (Dai Hung Bao Dien)',
        zh: '大雄宝殿（主正殿）',
        ko: '대웅보전 (본당)',
        ja: '大雄宝殿（本堂）',
        fr: 'Grand Sanctuaire Principal'
      },
      titleTag: {
        vi: 'Trái tim kiến trúc tâm linh chùa Linh Ứng',
        en: 'Spiritual heart of the pagoda complex',
        zh: '灵应寺最具规模的核心殿堂',
        ko: '사찰의 중심을 이루는 신성한 전각',
        ja: '霊応寺の中核を成す荘厳なる大殿',
        fr: 'Le cœur architectural et dévotionnel du temple'
      },
      category: 'temple',
      coordinates: {
        lat: 16.1006,
        lng: 108.2770,
        mapX: 48,
        mapY: 42,
        elevationMeters: 140,
        compassBearing: 45
      },
      audioDurationSeconds: 160,
      audioVoiceFile: 'audio_chanhdien_narration.mp3',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      brief: {
        vi: 'Chánh điện thiết kế mái ngói âm dương uốn cong hình rồng, thờ cúng Đức Thích Ca Mâu Ni, Bồ Tát Quán Âm và Bồ Tát Địa Tạng.',
        en: 'Constructed with dragon-curved roof tiles, enshrining Shakyamuni Buddha, Avalokiteshvara, and Ksitigarbha.',
        zh: '重檐歇山顶屋面，飞檐雕龙，殿内正中供奉释迦牟尼佛，两侧分侍观世音与地藏王菩萨。',
        ko: '용마루가 휘어진 전통 지붕 양식 아래 석가모니불과 관세음보살, 지장보살이 봉안되어 있습니다.',
        ja: '竜が刻まれた伝統の反り屋根が美しく、釈迦如来、観音菩薩、地蔵菩薩が厳かに祀られています。',
        fr: 'Sanctuaire aux toits recourbés décorés de dragons, dédié à Shakyamuni, Guanyin et Ksitigarbha.'
      },
      fullHistory: {
        vi: 'Chánh điện là công trình rộng lớn nhất trong khuôn viên chùa, kết hợp hài hòa giữa lối kiến trúc chùa chiền cổ truyền Việt Nam và phong cách hiện đại kiên cố. Gian giữa tôn trí tượng Phật Thích Ca Mâu Ni bằng đồng nguyên khối thếp vàng uy nghi, bên phải thờ Quan Thế Âm Bồ Tát và bên trái thờ Địa Tạng Vương Bồ Tát. Bốn cột trụ chính được chạm khắc hình rồng uốn lượn tinh xảo biểu trưng cho tứ đại hộ pháp.',
        en: 'The grandest hall of Linh Ung, blending classical Vietnamese temple vernacular with reinforced stone durability. The central altar houses a majestic gilded bronze Shakyamuni Buddha, flanked by Avalokiteshvara and Ksitigarbha. Four mighty columns adorned with coiled dragons represent cosmic protection.',
        zh: '大殿气势恢宏，融汇越南李陈时期古制佛寺风韵与近代石木工艺。正中安坐金身释迦世尊，左右分奉观音菩萨与地藏菩萨。殿内四根盘龙巨柱栩栩如生，气魄非凡。',
        ko: '사찰 내 가장 웅장한 전각으로 전통 양식과 현대적 미학이 조화를 이룹니다. 중앙에는 석가모니 금불상이 안치되어 있고, 좌우로 관음보살과 지장보살이 협시합니다.',
        ja: '寺院内で最も広大な建造物であり、金色の釈迦如来坐像が中心に座します。竜が巻き付く四本の大柱が荘厳な空間を支えています。',
        fr: 'Le plus grand édifice du complexe, associant toitures cintrées et colonnes sculptées de dragons impériaux.'
      },
      spiritualMeaning: {
        vi: 'Nơi đại chúng tịnh tâm, tụng kinh sám hối và đón nhận nguồn năng lượng từ bi của Tam Bảo.',
        en: 'A sanctuary for meditation, chanting, and attuning to the three jewels of Buddhist peace.',
        zh: '信众礼佛忏悔、诵经祈福的清净宝地，滋养慈悲清净菩提心。',
        ko: '참배객들이 마음을 정화하고 참회와 기도를 올리는 중심 참배 공간입니다.',
        ja: '心を静め、仏法僧の三宝の加護と平穏を祈る祈りの中心地です。',
        fr: 'Lieu de recueillement sacré propice à la méditation et aux prières paisibles.'
      },
      architecturalHighlights: [
        {
          vi: 'Mái ngói tráng men xanh ngọc uốn lượn phong cách cung đình',
          en: 'Imperial jade-glazed curved roof tiles with mythical chimera',
          zh: '碧绿色琉璃瓦重檐，飞龙凌云',
          ko: '푸른 청기와와 용 조각이 어우러진 지붕선',
          ja: '青緑の瑠璃瓦と天に昇る昇龍の棟飾り',
          fr: 'Tuiles vernissées vert émeraude et crêtes de dragons'
        },
        {
          vi: 'Trụ đá nguyên khối chạm khắc rồng nổi thời Lý - Trần',
          en: 'Monolithic pillars with high-relief dragon carvings',
          zh: '整石雕刻龙纹立柱，刀法古拙雄健',
          ko: '통돌을 깎아 만든 역동적인 용각 기둥',
          ja: '一枚岩から彫り出された躍動感あふれる雲龍柱',
          fr: 'Colonnes massives gravées de motifs royaux'
        }
      ],
      visitingTips: {
        vi: 'Bỏ giày dép bên ngoài trước khi bước vào, giữ im lặng và không chụp ảnh chính diện nơi Đức Phật đang hành lễ.',
        en: 'Remove shoes before entering, speak softly, and avoid flash photography facing the altar.',
        zh: '入殿请脱鞋履，保持肃静，殿内中央坛前请勿开启闪光灯拍摄。',
        ko: '입장 전 신발을 벗어주시고 정숙을 유지하며 제단 정면 촬영은 삼가주세요.',
        ja: '堂内へは靴を脱いでお入りいただき、静粛に手を合わせましょう。',
        fr: 'Retirez vos chaussures à l\'entrée, gardez le silence et respectez les prières.'
      },
      arModelType: 'dragon_eaves'
    },
    {
      id: 'poi_18_lahan',
      code: 'LU-18LAHAN-05',
      name: {
        vi: 'Vườn Tượng 18 Vị La Hán',
        en: 'Garden of 18 Arhats',
        zh: '十八罗汉白石雕塑园',
        ko: '18 나한상 정원',
        ja: '十八羅漢石像庭園',
        fr: 'Jardin des 18 Arhats'
      },
      titleTag: {
        vi: 'Kiệt tác điêu khắc đá Non Nước nguyên khối',
        en: 'Masterpiece of solid Non Nuoc marble sculptures',
        zh: '岘港五行山天然白大理石巨构',
        ko: '논느억 천연 대리석으로 조성된 18나한 군상',
        ja: 'ノンヌオック白大理石による迫真の羅漢群像',
        fr: 'Chef-d\'œuvre en marbre blanc de Non Nuoc'
      },
      category: 'monument',
      coordinates: {
        lat: 16.1004,
        lng: 108.2764,
        mapX: 38,
        mapY: 52,
        elevationMeters: 132,
        compassBearing: 30
      },
      audioDurationSeconds: 150,
      audioVoiceFile: 'audio_18lahan_narration.mp3',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      brief: {
        vi: '18 pho tượng La Hán bằng đá cẩm thạch trắng nguyên khối, biểu cảm sống động mô tả hỷ nộ ái ố của cõi thế tục.',
        en: '18 Arhat statues sculpted from pure white Non Nuoc marble, depicting vivid human emotions and spiritual transcendence.',
        zh: '由岘港五行山整块白大理石雕凿，十八位尊者喜怒哀乐神态活脱，栩栩如生。',
        ko: '순백의 대리석에 희로애락의 인간 감정을 초월한 18나한의 표정이 생생히 담겨 있습니다.',
        ja: 'ダナン名産の白大理石で彫られた十八羅漢像。喜怒哀楽を超越した表情が並びます。',
        fr: '18 statues d\'Arhats sculptées dans le marbre blanc pur de Non Nuoc, aux expressions expressives.'
      },
      fullHistory: {
        vi: 'Được chế tác công phu bởi các nghệ nhân làng đá mỹ nghệ Non Nước trứ danh dưới chân núi Ngũ Hành Sơn. Mỗi vị La Hán cao gần 3m, cưỡi trên những con vật linh thiêng như kỳ lân, rồng, hổ, nai hoặc ngồi trầm tư với từng pháp bảo riêng biệt (Tọa Lộc La Hán, Hàng Long La Hán, Phục Hổ La Hán, Quá Giang La Hán...). Dọc hai bên đường dẫn vào chánh điện, hàng tượng tạo nên một không gian thiền định trầm mặc.',
        en: 'Hand-carved over years by master artisans of the historic Non Nuoc stone craft village. Each Arhat stands nearly 3 meters tall, seated upon mythical beasts like dragons, tigers, deer, or in deep dhyana meditation holding their sacred attributes.',
        zh: '出自岘港五行山石雕名匠之手，每尊高达近3米。降龙、伏虎、坐鹿等尊者跨乘灵兽，手持法器，威仪庄严。两侧整齐列阵，护卫殿堂圣域。',
        ko: '오행산 논느억 석조 장인들의 손에서 탄생한 걸작입니다. 각 나한상은 약 3m 크기로 호랑이, 용, 사슴 등 영수 위에 오르거나 좌선에 든 모습을 하고 있습니다.',
        ja: '五行山の伝統工芸士たちによって長年かけて彫刻された羅漢像。降龍、伏虎、騎鹿などそれぞれの持ち物と乗り物が精巧に再現されています。',
        fr: 'Sculptés par les maîtres tailleurs de pierre de Non Nuoc. Chaque Arhat mesure 3 mètres de haut, assis sur un animal sacré.'
      },
      spiritualMeaning: {
        vi: 'Lời nhắc nhở người tu hành và du khách rằng mọi cảm xúc trần gian đều có thể chuyển hóa thành sự an lạc và trí tuệ nếu biết quán chiếu tự tâm.',
        en: 'A reminder that human emotions can be transformed into enlightenment through mindful contemplation.',
        zh: '寓意世间千般烦恼情愫，皆可通过觉照修持转化为如来清净大智慧。',
        ko: '세속의 번뇌와 감정 역시 깊은 통찰을 통해 깨달음으로 승화될 수 있음을 보여줍니다.',
        ja: '日常の喜怒哀楽も、省察によって澄んだ悟りの境地へと変容できることを説いています。',
        fr: 'Symbole de transformation spirituelle des émotions humaines en paix intérieure.'
      },
      architecturalHighlights: [
        {
          vi: 'Đá cẩm thạch trắng tự nhiên không chắp vá với vân ngọc mờ',
          en: 'Seamless single-block natural white marble with subtle jade veining',
          zh: '整块天然白大理石无拼接，玉质温润',
          ko: '이음매 없는 천연 백옥석 대리석 원석',
          ja: '継ぎ目のない天然白大理石の一本造り',
          fr: 'Blocs uniques de marbre blanc immaculé'
        }
      ],
      visitingTips: {
        vi: 'Du khách có thể đi chậm dọc lối đi giữa hai hàng tượng để cảm nhận sự chuyển đổi biểu cảm từ suy tư đến giác ngộ.',
        en: 'Walk slowly down the central pathway between the rows to observe the subtle emotional transitions.',
        zh: '漫步于两行尊者之间，细品从深思苦索到超然顿悟的神韵变化。',
        ko: '두 열 사이의 길을 천천히 걸으며 번뇌에서 해탈로 나아가는 표정의 변화를 감상해보세요.',
        ja: '二列の像の間をゆっくり歩き、苦悩から悟りへと至る表情のグラデーションを感じてください。',
        fr: 'Promenez-vous le long de l\'allée centrale pour observer le passage de la contemplation à la paix.'
      },
      arModelType: 'arhat_relic'
    },
    {
      id: 'poi_thap_xaloi',
      code: 'LU-THAPXALOI-03',
      name: {
        vi: 'Tháp Xá Lợi 9 Tầng',
        en: '9-Story Sarira Relic Pagoda Stupa',
        zh: '九层佛舍利宝塔',
        ko: '9층 사리탑',
        ja: '九重仏舎利宝塔',
        fr: 'Stupa des Reliques Sacrées à 9 Étages'
      },
      titleTag: {
        vi: 'Nơi lưu giữ linh thiêng xá lợi Phật',
        en: 'Sacred depository of revered Buddha relics',
        zh: '庄严供奉佛陀真身舍利的清净宝塔',
        ko: '부처님의 진신사리를 모신 성스러운 탑',
        ja: '尊い仏舎利が安置された多宝塔',
        fr: 'Dépôt sacré abritant les reliques du Bouddha'
      },
      category: 'relic',
      coordinates: {
        lat: 16.1009,
        lng: 108.2785,
        mapX: 74,
        mapY: 28,
        elevationMeters: 148,
        compassBearing: 115
      },
      audioDurationSeconds: 140,
      audioVoiceFile: 'audio_thapxaloi_narration.mp3',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
      brief: {
        vi: 'Tháp Xá Lợi cao 9 tầng sừng sững bên triền dốc, nơi phụng thờ xá lợi của Đức Phật và chư vị cao tăng đắc đạo.',
        en: 'A towering 9-storey pagoda standing gracefully against the mountainside, enshrining sacred relics of the Buddha.',
        zh: '高耸入云的九层宝塔，临崖而建，恭奉佛陀与历代高僧圆寂遗留之神圣舍利。',
        ko: '산비탈에 우뚝 솟은 9층 탑으로, 부처님과 고승들의 진신사리가 엄숙히 봉안되어 있습니다.',
        ja: '崖沿いに凛とそびえる九重の塔。仏陀および高僧の聖なる舎利が大切に祀られています。',
        fr: 'Tour octogonale à 9 étages surplombant la falaise, abritant les reliques bouddhiques.'
      },
      fullHistory: {
        vi: 'Tháp Xá Lợi được thiết kế theo hình bát giác thu nhỏ dần lên đỉnh tháp, trên cùng là búp sen và đĩa ngọc tỏa ánh hoàng kim. Tầng cao nhất là nơi thờ xá lợi Phật nghìn năm, các tầng kế tiếp thờ xá lợi của các bậc tổ sư và thánh tăng. Chuông gió treo ở các góc mái reo vang thanh thoát theo từng cơn gió biển Sơn Trà.',
        en: 'Constructed as an octagonal pagoda tapering gracefully toward a golden lotus spire. The uppermost sanctuary houses authentic ancient sarira relics, while wind chimes suspended from each roof tier produce celestial chimes with the ocean breeze.',
        zh: '八角飞檐形制，层层递收，塔刹冠以金莲甘露顶。塔内每层绘有精美佛传本生壁画，檐角悬挂风铎，山风海浪相和，清音回荡。',
        ko: '팔각형 구조로 위로 갈수록 좁아지는 우아한 실루엣을 뽐냅니다. 처마 끝에 달린 풍경이 바닷바람에 맑게 울려 퍼집니다.',
        ja: '八角形の塔身が天に向かって美しく伸び、屋根の風鈴が海風を受けて心地よい音色を響かせます。',
        fr: 'Stupa octogonal orné d\'une flèche en lotus doré, résonnant au vent marin grâce à ses clochettes de bronze.'
      },
      spiritualMeaning: {
        vi: 'Đi nhiễu 3 vòng quanh bảo tháp (hành hương theo chiều kim đồng hồ) mang lại phước báu vô lượng, tiêu trừ chướng ngại tinh thần.',
        en: 'Circumambulating the stupa clockwise three times brings blessings of clarity and peaceful energy.',
        zh: '右绕宝塔三匝，能除宿世挂碍，培植无上福田资粮。',
        ko: '탑을 시계 방향으로 세 바퀴 도는 탑돌이를 통해 평온과 축복을 기원합니다.',
        ja: '塔の周りを時計回りに三周する右遶（うにょう）は、平穏と功徳をもたらすといわれます。',
        fr: 'La circumambulation en trois tours dans le sens horaire est source de sérénité et bénédiction.'
      },
      architecturalHighlights: [
        {
          vi: 'Cấu trúc bát giác truyền thống cao hơn 30 mét',
          en: 'Traditional octagonal geometry exceeding 30 meters height',
          zh: '传统八角重檐楼阁式结构，通高超30米',
          ko: '높이 30m가 넘는 전통 팔각 누각탑',
          ja: '30メートルを超える伝統の八角楼閣様式',
          fr: 'Architecture octogonale traditionnelle de plus de 30m'
        }
      ],
      visitingTips: {
        vi: 'Giữ trang nghiêm tuyệt đối, không trèo lên lan can đá và có thể thắp nến hoa đăng dâng cúng tại chân tháp.',
        en: 'Maintain solemn respect, do not climb stone balustrades, and offerings can be made at the base.',
        zh: '请保持庄严肃穆，勿攀爬石质栏杆，可在塔前基座合十献花礼敬。',
        ko: '경건한 태도를 지키고 난간에 기대지 마시며, 탑 앞에서 조용히 묵상하실 수 있습니다.',
        ja: '静寂を保ち、石の欄干には登らず、基壇の前で静かに祈りを捧げましょう。',
        fr: 'Conservez une attitude recueillie et respectez la sainteté du lieu.'
      },
      arModelType: 'sacred_stupa'
    },
    {
      id: 'poi_cong_tamquan',
      code: 'LU-TAMQUAN-04',
      name: {
        vi: 'Cổng Tam Quan Hướng Biển',
        en: 'Seaside Triple Gate (Tam Quan)',
        zh: '面海三门（山门三关）',
        ko: '바다를 마주한 일주문 (삼문)',
        ja: '海を望む三門（山門）',
        fr: 'Porte Triple des Trois Libérations (Tam Quan)'
      },
      titleTag: {
        vi: 'Cửa ngõ dẫn vào cõi Phật thanh tịnh',
        en: 'The gateway from mundane world to sacred calm',
        zh: '跨越俗世步入清凉佛境的庄严山门',
        ko: '세속의 번뇌를 벗고 불계로 들어서는 관문',
        ja: '俗世を離れ聖域へと導く堂々たる三門',
        fr: 'Le seuil spirituel entre le monde profane et le sacré'
      },
      category: 'temple',
      coordinates: {
        lat: 16.0998,
        lng: 108.2755,
        mapX: 25,
        mapY: 65,
        elevationMeters: 110,
        compassBearing: 10
      },
      audioDurationSeconds: 125,
      audioVoiceFile: 'audio_tamquan_narration.mp3',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      brief: {
        vi: 'Cổng Tam Quan vững chãi mở ra ba lối đi: Không môn, Giả môn và Trung môn, phóng tầm nhìn ngút ngàn ra vịnh Đà Nẵng.',
        en: 'The grand triple entrance symbolizing Emptiness, Form, and the Middle Way, framing an infinite panorama of Da Nang Bay.',
        zh: '宏伟三门象征空门、无相门与无愿门，穿门而入，即可鸟瞰海天一色的岘港湾全貌。',
        ko: '공문, 가문, 중문을 상징하는 3개의 문으로, 다낭 해안의 눈부신 절경이 한눈에 펼쳐집니다.',
        ja: '空門・無相門・無願門の三解脱門を象徴し、美しいダナン湾の青海を一望できます。',
        fr: 'Porte monumentale à trois arcs ouvrant sur une vue panoramique époustouflante de la baie.'
      },
      fullHistory: {
        vi: 'Cổng Tam Quan chùa Linh Ứng được dựng theo thế "Tiền án hậu chẩm", lưng tựa đỉnh Sơn Trà còn mặt hướng thẳng ra biển Đông. Ba vòm cổng tượng trưng cho Tam Giải Thoát Môn trong đạo Phật: Không Môn (nhận thức vạn vật vô ngã), Vô Tướng Môn (không chấp trước hình tướng), và Vô Tác Môn (không mưu cầu vụ lợi). Qua khỏi cổng, những ồn ào đô thị dường như lùi lại phía sau, chỉ còn tiếng chuông chùa và gió biển.',
        en: 'Erected along the sacred geomantic axis: backed by mountain and facing ocean. The three portals represent the Three Gates of Liberation: Sunyata (Emptiness), Animitta (Signlessness), and Apranihita (Wishlessness). Once crossing this threshold, city commotion fades into serene temple bells.',
        zh: '山门依风水正脉而筑，负山面海。三道门洞暗喻佛家“三解脱门”：空解脱、无相解脱与无愿解脱。过此门者，万缘放下，海风拂面，唯留禅音。',
        ko: '산을 등지고 바다를 향한 배산임수의 풍수 명당에 자리잡았습니다. 세 개의 아치는 불교의 삼해탈문을 상징하며 번잡한 세속을 벗어나 평온으로 들어서는 관문입니다.',
        ja: '山を背に海を望む風水の名処に建立。三つの門は仏教の「三解脱門」を表し、この門をくぐれば海風とともに心が解き放たれます。',
        fr: 'Bâtie selon les règles du Feng Shui, adossée au mont Son Tra et face à l\'immensité océanique.'
      },
      spiritualMeaning: {
        vi: 'Bước qua Tam Quan là buông xả muộn phiền, bước vào không gian của sự tỉnh thức và thanh tịnh.',
        en: 'Walking through this gate signifies stepping out of earthly stress into mindful peace.',
        zh: '跨入山门即象征放下俗世执着，身心归于自在清净。',
        ko: '문을 넘는 순간 세상의 모든 근심을 내려놓고 깨어있는 평화에 닿게 됩니다.',
        ja: '門をくぐることは、日常の執着を手放し心の安らぎへと足を踏み入れることを意味します。',
        fr: 'Franchir ce seuil symbolise le lâcher-prise et l\'entrée dans l\'éveil intérieur.'
      },
      architecturalHighlights: [
        {
          vi: 'Trụ biểu bằng đá xanh chạm khắc câu đối chữ Hán thếp vàng',
          en: 'Blue stone pillars inscribed with gold-leaf Buddhist couplets',
          zh: '青石门柱铭刻鎏金佛家楹联，书法苍劲',
          ko: '황금 글씨가 새겨진 묵직한 청석 기둥',
          ja: '金文字で漢詩が刻まれた青石の門柱',
          fr: 'Piliers en pierre bleue gravés de distiques dorés'
        }
      ],
      visitingTips: {
        vi: 'Vị trí chụp ảnh toàn cảnh vịnh biển đẹp nhất khi trời trong xanh, bậc đá cẩm thạch có thể hơi trơn khi trời sương ẩm.',
        en: 'Prime viewpoint for panoramic sea photos; step carefully on marble stairs in morning mist.',
        zh: '晴日眺望岘港海岸线的极佳摄影点，晨雾或雨后石阶略滑，请留心脚下。',
        ko: '맑은 날 바다 전경을 담기에 가장 좋은 사진 명소입니다. 비 온 뒤에는 돌계단을 조심하세요.',
        ja: '晴れた日には絶景のパノラマ写真が撮影できます。朝露で濡れた石段にはご注意ください。',
        fr: 'Point de vue idéal pour photographier la baie; attention aux marches par temps humide.'
      },
      arModelType: 'viewpoint_portal'
    },
    {
      id: 'poi_vong_canh',
      code: 'LU-VONGCANH-06',
      name: {
        vi: 'Vọng Cảnh Bãi Bụt & Biển Đông',
        en: 'Bai But Sea-View Pavilion',
        zh: '佛滩东海观景台',
        ko: '바이붓 동해 전망대',
        ja: 'バイブット東シナ海展望台',
        fr: 'Belvédère Panoramique de Bai But'
      },
      titleTag: {
        vi: 'Nơi ngắm toàn cảnh Sơn Trà và Cù Lao Chàm',
        en: 'Panoramas of Son Tra and Cham Islands',
        zh: '俯瞰山茶半岛翠岭与占婆群岛之胜景',
        ko: '손트라 반도와 참섬이 어우러진 비경',
        ja: 'ソンチャ半島とチャム島を一望する景勝地',
        fr: 'Vue panoramique sur la péninsule et les îles Cham'
      },
      category: 'viewpoint',
      coordinates: {
        lat: 16.0995,
        lng: 108.2788,
        mapX: 82,
        mapY: 55,
        elevationMeters: 105,
        compassBearing: 140
      },
      audioDurationSeconds: 110,
      audioVoiceFile: 'audio_vongcanh_narration.mp3',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      brief: {
        vi: 'Vọng Cảnh Bãi Bụt với góc nhìn 180 độ bao quát đại dương, nơi bắt nguồn truyền thuyết pho tượng Phật dạt vào bờ cát.',
        en: 'A 180-degree ocean overlook where legend says a sacred Buddha statue drifted ashore centuries ago.',
        zh: '180度开阔海景，相传明命年间曾有神圣佛像随波漂泊至此沙滩，“佛滩”由此得名。',
        ko: '180도 파노라마 오션뷰와 함께 과거 불상이 해안가로 밀려왔다는 전설이 깃든 장소입니다.',
        ja: '180度の大海原が広がり、波打ち際に仏像が流れ着いたという伝説の地「バイブット（仏の浜）」。',
        fr: 'Terrasse avec vue à 180 degrés sur l\'océan, liée à la légende de la statue échouée.'
      },
      fullHistory: {
        vi: 'Theo truyền ngôn dân gian triều vua Minh Mạng (thế kỷ 19), ngư dân vùng bán đảo Sơn Trà bất ngờ phát hiện một pho tượng Phật trôi dạt vào bờ cát. Xem đó là điềm lành, bà con lập am thờ tự, từ đó sóng yên biển lặng, ngư dân vượt qua phong ba. Vùng đất ấy được đặt tên là Bãi Bụt (nghĩa là "Cõi Phật giữa nhân gian"), tiền đề cho sự ra đời của chùa Linh Ứng sau này.',
        en: 'During the reign of Emperor Minh Mang in the 19th century, coastal fishermen discovered a Buddha statue washed ashore on this pristine sandbar. Believing it was an auspicious divine omen, they built a shrine, and maritime storms miraculously ceased. The beach was christened Bai But ("Realm of the Buddha on Earth").',
        zh: '据传十九世纪阮朝明命年间，当地渔民在海滩偶得一尊漂流而来的佛像，遂结茅筑庵供奉。自此海浪平息、渔获丰收，百姓称此地为“佛滩”，亦为今日灵应寺之缘起。',
        ko: '19세기 민망 황제 시절, 어민들이 파도에 실려온 불상을 발견하고 사당을 세우자 거친 파도가 잠잠해졌다는 전설에서 유래하여 \'부처의 해변\'이라 불리게 되었습니다.',
        ja: '19世紀初頭、この砂浜に仏像が漂着し村人が祠を建てて祀ったところ、嵐が静まり豊漁が続いたという伝説から「仏の浜」と名付けられました。',
        fr: 'Au XIXe siècle sous Minh Mang, des pêcheurs découvrirent une statue échouée. Un sanctuaire fut érigé, apaisant les tempêtes.'
      },
      spiritualMeaning: {
        vi: 'Chiêm nghiệm sự hòa hợp giữa con người, thiên nhiên hùng vĩ và tâm từ bi của cõi Phật.',
        en: 'Contemplating the timeless harmony between humanity, majestic sea, and Buddhist goodwill.',
        zh: '感悟人与浩瀚自然、苍茫烟波间的和谐共生与心灵归宿。',
        ko: '자연의 광활함 앞에서 마음을 비우고 겸허한 평화를 되찾는 공간입니다.',
        ja: '広大な海を前にして心を解き放ち、自然と仏の慈悲への感謝を深める場所です。',
        fr: 'Un moment d\'harmonie totale entre la mer infinie et la sérénité bouddhiste.'
      },
      architecturalHighlights: [
        {
          vi: 'Lan can đá cẩm thạch trắng chạm hoa sen uốn quanh vách đá',
          en: 'White marble lotus balustrade curving along coastal cliff edges',
          zh: '依悬崖自然走势修筑的白石莲纹曲折护栏',
          ko: '절벽을 따라 유려하게 곡선을 그리는 연꽃 조각 석조 난간',
          ja: '断崖に沿って白大理石の蓮彫刻欄干が弧を描く',
          fr: 'Balustrades en marbre blanc longeant les falaises'
        }
      ],
      visitingTips: {
        vi: 'Nơi đón gió biển rất mát, có kính viễn vọng ngắm xa tàu thuyền ra khơi và chim rừng Sơn Trà.',
        en: 'Breezy and relaxing; telescope available for spotting ships and native bird species.',
        zh: '海风拂面极为惬意，设有远眺望远镜，可遥观渔帆点点与林间飞鸟。',
        ko: '바람이 시원하게 불며 망원경으로 항해하는 선박과 손트라 원시림을 관찰할 수 있습니다.',
        ja: '心地よい海風が吹き抜け、双眼鏡で遠くの漁船や森の野鳥を観察できます。',
        fr: 'Air marin rafraîchissant, parfait pour contempler les navires au large.'
      },
      arModelType: 'viewpoint_portal'
    },
    {
      id: 'poi_cay_da',
      code: 'LU-CAYDA-07',
      name: {
        vi: 'Cội Cây Đa Ngàn Năm Sơn Trà',
        en: 'Millennial Banyan Tree of Son Tra',
        zh: '山茶千年古榕树圣境',
        ko: '손트라 천년 가구마 반얀트리',
        ja: 'ソンチャ千年のガジュマル巨木',
        fr: 'Banyan Millénaire de Son Tra'
      },
      titleTag: {
        vi: 'Cổ mộc thiêng liêng biểu tượng trường thọ',
        en: 'Sacred ancient heritage tree of longevity',
        zh: '山茶原始森林中庇佑灵性的千载神木',
        ko: '장수와 영험함을 상징하는 천연기념수',
        ja: '神秘なる生命力と長寿を象徴する御神木',
        fr: 'Arbre millénaire sacré, symbole de longévité'
      },
      category: 'nature',
      coordinates: {
        lat: 16.1030,
        lng: 108.2810,
        mapX: 88,
        mapY: 15,
        elevationMeters: 175,
        compassBearing: 340
      },
      audioDurationSeconds: 130,
      audioVoiceFile: 'audio_cayda_narration.mp3',
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
      brief: {
        vi: 'Cây đa cổ thụ hơn 800 năm tuổi với hàng chục rễ phụ cắm sâu vào lòng đất tạo thành mạng lưới rễ kỳ vĩ.',
        en: 'An ancient banyan tree aged over 800 years with dozens of secondary aerial root trunks forming a magical natural temple.',
        zh: '逾800年树龄古榕，数十条气生根直垂大地化作支柱，宛如大自然鬼斧神工的苍翠绿殿。',
        ko: '800년 이상의 수령을 자랑하며, 수십 개의 공기뿌리가 대지에 뿌리내려 웅장한 숲을 이룹니다.',
        ja: '樹齢800年を超える巨木。気根が無数に地へ伸びて幹となり、まるで自然の大聖堂のようです。',
        fr: 'Arbre colossal de plus de 800 ans dont les racines aériennes forment une forêt cathédrale.'
      },
      fullHistory: {
        vi: 'Được các nhà khoa học ước tính có niên đại ngàn năm, cây đa sừng sững trên đỉnh rừng Sơn Trà với chu vi tán lá xòe rộng hàng trăm mét vuông. Trong hai cuộc kháng chiến, đây từng là nơi trú ẩn bí mật của các chiến sĩ cách mạng. Quanh cây đa là môi trường sống của loài Voọc chà vá chân nâu quý hiếm – "nữ hoàng linh trưởng" của bán đảo Sơn Trà.',
        en: 'Estimated by botanists to be around 800-1000 years old, its colossal canopy covers hundreds of square meters. During past struggles, its vast root chambers provided covert shelter. The surrounding forest canopy is home to the endangered Red-shanked douc langur.',
        zh: '经植物学家考证树龄近千年，繁茂树冠遮天蔽日。其周围生态完好，是世界极危物种白臀叶猴（被誉为“灵长类皇后”）的重要栖息觅食乐土。',
        ko: '수백 년 동안 자생해온 거목으로 산림 캐노피를 넓게 펼치고 있습니다. 인근 원시림은 붉은정강이두크원숭이의 보금자리이기도 합니다.',
        ja: '樹冠は数百平方メートルに広がり、周囲の原生林には世界的に希少なアカアシドゥクラングールが生息しています。',
        fr: 'Arbre monumental abritant la canopée où vit le douc à pattes rousses, trésor de Son Tra.'
      },
      spiritualMeaning: {
        vi: 'Đại diện cho sức sống bất diệt, sự trường thọ và mối giao hòa linh thiêng giữa rừng già và tâm thức con người.',
        en: 'Symbolizes vitality, resilience, endurance, and deep communion with primal nature.',
        zh: '象征生生不息的坚韧生机与人与万物灵性相通之长寿安康。',
        ko: '끝없는 생명력과 끈기, 숲과 인간의 조화로운 공존을 상징합니다.',
        ja: '不屈の生命力と長寿、そして森と人との神聖な調和を物語ります。',
        fr: 'Symbole de longévité, de résilience et de connexion sacrée avec la nature.'
      },
      architecturalHighlights: [
        {
          vi: 'Hệ thống rễ phụ hóa thân thành hơn 26 thân phụ vững chãi',
          en: 'Secondary root matrix forming over 26 secondary supportive trunks',
          zh: '数十条支柱根盘根错节深入岩层，独木成林',
          ko: '26개 이상의 굵은 지주근이 이룬 신비로운 숲',
          ja: '26本以上の支柱根が支える「一本の森」',
          fr: 'Réseau de plus de 26 troncs secondaires soutenant l\'arbre'
        }
      ],
      visitingTips: {
        vi: 'Không bẻ cành hái lá hoặc cho khỉ hoang dã ăn thức ăn có gia vị để bảo tồn hệ sinh thái tự nhiên.',
        en: 'Do not feed the wild monkeys and respect the quiet sanctuary of the ancient forest.',
        zh: '严禁折枝攀爬及投喂野生猴群，请共同守护大自然宝贵生态。',
        ko: '나뭇가지를 훼손하지 마시고 야생 원숭이에게 음식을 주지 말아주세요.',
        ja: '枝を折らず、野生のサルには絶対に餌を与えないようご協力ください。',
        fr: 'Ne nourrissez pas les singes sauvages et préservez ce sanctuaire intact.'
      },
      arModelType: 'viewpoint_portal'
    }
  ];

  public getAllPois(lang: string = 'vi'): any[] {
    const l = this.resolveLang(lang);
    eventBus.publish('PoiAudioService', 'POI_LIST_ACCESSED', { lang: l }, {
      targetService: 'ClientApp',
      latencyMs: 9
    });

    return this.pois.map(poi => this.localizePoi(poi, l));
  }

  public getPoiById(id: string, lang: string = 'vi'): any | null {
    const poi = this.pois.find(p => p.id === id);
    if (!poi) return null;
    const l = this.resolveLang(lang);

    eventBus.publish('PoiAudioService', 'POI_ACCESSED', { id, code: poi.code }, {
      targetService: 'AnalyticsService',
      latencyMs: 6
    });

    return this.localizePoi(poi, l);
  }

  public getPoiByQrCode(code: string, lang: string = 'vi'): any | null {
    const cleanCode = code.trim().toUpperCase();
    const poi = this.pois.find(p => p.code.toUpperCase() === cleanCode || p.id === code.toLowerCase());
    if (!poi) return null;
    const l = this.resolveLang(lang);

    eventBus.publish('PoiAudioService', 'QR_SCANNED', { code: cleanCode, poiId: poi.id }, {
      targetService: 'NavigationService',
      latencyMs: 12
    });

    return this.localizePoi(poi, l);
  }

  public getRegisteredQrList(): { code: string; name: string; poiId: string }[] {
    return this.pois.map(p => ({
      code: p.code,
      name: p.name.vi,
      poiId: p.id
    }));
  }

  private resolveLang(lang: string): keyof MultilingualText {
    const supported: (keyof MultilingualText)[] = ['vi', 'en', 'zh', 'ko', 'ja', 'fr'];
    if (supported.includes(lang as any)) {
      return lang as keyof MultilingualText;
    }
    return 'vi';
  }

  private localizePoi(poi: MonumentPOI, l: keyof MultilingualText) {
    return {
      id: poi.id,
      code: poi.code,
      name: poi.name[l] || poi.name.vi,
      titleTag: poi.titleTag[l] || poi.titleTag.vi,
      category: poi.category,
      coordinates: poi.coordinates,
      audioDurationSeconds: poi.audioDurationSeconds,
      audioVoiceFile: poi.audioVoiceFile,
      image: poi.image,
      brief: poi.brief[l] || poi.brief.vi,
      fullHistory: poi.fullHistory[l] || poi.fullHistory.vi,
      spiritualMeaning: poi.spiritualMeaning[l] || poi.spiritualMeaning.vi,
      architecturalHighlights: poi.architecturalHighlights.map(h => h[l] || h.vi),
      visitingTips: poi.visitingTips[l] || poi.visitingTips.vi,
      arModelType: poi.arModelType,
      currentLanguage: l
    };
  }
}

export const poiAudioService = new PoiAudioService();
