import { SupportedLanguage } from '../types/index.ts';

export const TRANSLATIONS: Record<SupportedLanguage, {
  appName: string;
  appSubtitle: string;
  tabs: {
    monuments: string;
    qrScanner: string;
    map: string;
    ar: string;
    tickets: string;
    chatAi: string;
    backendCicd: string;
  };
  audioGuide: {
    play: string;
    pause: string;
    speed: string;
    nowPlaying: string;
    stop: string;
    listenNarration: string;
    readTranscript: string;
    voiceSettings: string;
  };
  scanner: {
    title: string;
    instruction: string;
    simulatedTitle: string;
    simulatedDesc: string;
    scanNow: string;
    cameraError: string;
    cameraPermission: string;
    scanSuccess: string;
  };
  map: {
    title: string;
    antiLostTitle: string;
    antiLostDesc: string;
    findRoute: string;
    fromLabel: string;
    toLabel: string;
    startRouting: string;
    itineraryTitle: string;
    distance: string;
    duration: string;
    legend: {
      poi: string;
      user: string;
      buggy: string;
      restroom: string;
      shadedRest: string;
    };
  };
  ar: {
    title: string;
    subtitle: string;
    cameraFeed: string;
    haloEffect: string;
    historicalSlider: string;
    facingDirection: string;
    distanceAway: string;
    blessingParticles: string;
    toggleCamera: string;
  };
  booking: {
    title: string;
    subtitle: string;
    bookNow: string;
    price: string;
    visitDate: string;
    fullName: string;
    phone: string;
    quantity: string;
    total: string;
    checkout: string;
    payOnline: string;
    selectPayment: string;
    eTicketTitle: string;
    eTicketSuccess: string;
    savePass: string;
  };
  chat: {
    title: string;
    welcomeMsg: string;
    inputPlaceholder: string;
    send: string;
    suggestedQuestions: string;
    listening: string;
  };
  cicd: {
    title: string;
    subtitle: string;
    runPipeline: string;
    servicesStatus: string;
    eventStream: string;
    activeServices: string;
  };
}> = {
  vi: {
    appName: 'Chùa Linh Ứng Sơn Trà',
    appSubtitle: 'Thuyết Minh Thông Minh & AR',
    tabs: {
      monuments: 'Di Tích',
      qrScanner: 'Quét QR',
      map: 'Bản Đồ',
      ar: 'Thực Tế AR',
      tickets: 'Đặt Vé & Tour',
      chatAi: 'Trợ Lý AI',
      backendCicd: 'Hệ Thống BE & CI/CD'
    },
    audioGuide: {
      play: 'Phát thuyết minh',
      pause: 'Tạm dừng',
      speed: 'Tốc độ',
      nowPlaying: 'Đang thuyết minh',
      stop: 'Dừng',
      listenNarration: 'Nghe Thuyết Minh Giọng Nói',
      readTranscript: 'Nội dung chi tiết',
      voiceSettings: 'Cài đặt giọng đọc'
    },
    scanner: {
      title: 'Quét Mã QR Tại Điểm Di Tích',
      instruction: 'Hướng camera về phía bảng mã QR đặt tại các chân tượng, tháp xá lợi hoặc chánh điện để kích hoạt thuyết minh tức thì.',
      simulatedTitle: 'Chế độ Trải nghiệm & Thử nghiệm QR',
      simulatedDesc: 'Bấm nhanh vào các thẻ di tích dưới đây để mô phỏng quét mã QR thực tế tại chùa:',
      scanNow: 'Kích hoạt Camera Quét',
      cameraError: 'Không thể truy cập camera. Vui lòng cấp quyền hoặc sử dụng thẻ thử nghiệm bên dưới.',
      cameraPermission: 'Yêu cầu quyền truy cập Camera',
      scanSuccess: 'Đã nhận diện mã QR thành công!'
    },
    map: {
      title: 'Bản Đồ Tương Tác & Chỉ Dẫn Chống Lạc',
      antiLostTitle: 'Hệ Thống Dẫn Đường Thông Minh',
      antiLostDesc: 'Tự động tính toán đường đi tối ưu, cảnh báo bậc thang trơn trượt và hỗ trợ du khách không bị lạc trong khuôn viên rộng lớn.',
      findRoute: 'Tìm đường đi',
      fromLabel: 'Điểm bắt đầu',
      toLabel: 'Điểm muốn đến',
      startRouting: 'Bắt đầu chỉ đường',
      itineraryTitle: 'Lịch trình gợi ý',
      distance: 'Khoảng cách',
      duration: 'Thời gian đi bộ',
      legend: {
        poi: 'Điểm di tích',
        user: 'Vị trí của bạn',
        buggy: 'Trạm xe buggy điện',
        restroom: 'Khu vệ sinh',
        shadedRest: 'Điểm nghỉ râm mát'
      }
    },
    ar: {
      title: 'Trải Nghiệm Thực Tế Tăng Cường (AR)',
      subtitle: 'Không gian tâm linh sống động 3D qua ống kính điện thoại',
      cameraFeed: 'Camera AR Trực Tiếp',
      haloEffect: 'Hào Quang Sen Quan Âm',
      historicalSlider: 'Dòng Thời Gian Lịch Sử',
      facingDirection: 'Hướng la bàn',
      distanceAway: 'Cách vị trí bạn',
      blessingParticles: 'Hiệu ứng Mưa Hoa Sen',
      toggleCamera: 'Bật/Tắt Camera Thật'
    },
    booking: {
      title: 'Đặt Vé Dịch Vụ & Tour Tham Quan',
      subtitle: 'Vào cổng chùa miễn phí. Đặt trước các tiện ích xe điện, bảo vật và trà đạo hoàng hôn.',
      bookNow: 'Đặt ngay',
      price: 'Giá vé',
      visitDate: 'Ngày tham quan',
      fullName: 'Họ và tên du khách',
      phone: 'Số điện thoại liên hệ',
      quantity: 'Số lượng vé',
      total: 'Tổng thanh toán',
      checkout: 'Tiến hành thanh toán',
      payOnline: 'Thanh toán trực tuyến bảo mật',
      selectPayment: 'Chọn phương thức thanh toán',
      eTicketTitle: 'Vé Điện Tử & Thẻ Check-in',
      eTicketSuccess: 'Thanh toán thành công! Vé điện tử của bạn đã sẵn sàng.',
      savePass: 'Lưu Thẻ Vào Điện Thoại'
    },
    chat: {
      title: 'Linh Ứng Trợ Lý Thuyết Minh (AI)',
      welcomeMsg: 'Nam Mô A Di Đà Phật! Tôi là trợ lý ảo Chùa Linh Ứng. Tôi có thể giải đáp lịch sử di tích, quy tắc trang phục, giờ mở cửa và hướng dẫn đường đi cho bạn.',
      inputPlaceholder: 'Hỏi về chùa Linh Ứng, tượng Phật Bà 67m, quy tắc thắp nhang...',
      send: 'Gửi',
      suggestedQuestions: 'Câu hỏi gợi ý nhanh',
      listening: 'Đang trả lời...'
    },
    cicd: {
      title: 'Trung Tâm Điều Hành Backend & CI/CD Pipeline',
      subtitle: 'Kiến trúc vi dịch vụ tương tác qua EventBus và chu trình CI/CD tự động hóa.',
      runPipeline: 'Kích Hoạt CI/CD Pipeline Mới',
      servicesStatus: 'Trạng Thái Các Microservices',
      eventStream: 'Nhật Ký Sự Kiện Giữa Các Services (EventBus)',
      activeServices: 'Các Vi Dịch Vụ Đang Chạy'
    }
  },
  en: {
    appName: 'Linh Ung Pagoda Son Tra',
    appSubtitle: 'Smart Audio Guide & AR',
    tabs: {
      monuments: 'Monuments',
      qrScanner: 'QR Scanner',
      map: 'Map & Nav',
      ar: 'AR View',
      tickets: 'Tickets & Tours',
      chatAi: 'AI Assistant',
      backendCicd: 'BE Services & CI/CD'
    },
    audioGuide: {
      play: 'Play Narration',
      pause: 'Pause',
      speed: 'Speed',
      nowPlaying: 'Now Playing',
      stop: 'Stop',
      listenNarration: 'Listen to Voice Narration',
      readTranscript: 'Historical Details',
      voiceSettings: 'Voice Settings'
    },
    scanner: {
      title: 'Scan QR Code At Monument',
      instruction: 'Point your camera at the QR plaques located at Lady Buddha, Main Hall, or Stupa to instantly launch voice narration.',
      simulatedTitle: 'Test & Simulation Mode',
      simulatedDesc: 'Click any monument card below to simulate instant on-site QR scanning:',
      scanNow: 'Activate Scanner Camera',
      cameraError: 'Camera unavailable. Please check permissions or use sample cards below.',
      cameraPermission: 'Camera Permission Required',
      scanSuccess: 'QR Code recognized successfully!'
    },
    map: {
      title: 'Interactive Map & Anti-Lost Guide',
      antiLostTitle: 'Smart Wayfinding Engine',
      antiLostDesc: 'Calculates optimal paths, warns of steep marble stairs, and prevents getting lost across the sprawling grounds.',
      findRoute: 'Find Route',
      fromLabel: 'Starting Point',
      toLabel: 'Destination',
      startRouting: 'Start Navigation',
      itineraryTitle: 'Suggested Itineraries',
      distance: 'Distance',
      duration: 'Walking Time',
      legend: {
        poi: 'Monument',
        user: 'Your Location',
        buggy: 'Buggy Stop',
        restroom: 'Restrooms',
        shadedRest: 'Shaded Rest'
      }
    },
    ar: {
      title: 'Augmented Reality (AR) Experience',
      subtitle: 'Immersive spiritual spatial experience through your smartphone camera',
      cameraFeed: 'Live AR Camera',
      haloEffect: 'Lotus Halo Aura',
      historicalSlider: 'Historical Timeline',
      facingDirection: 'Compass Heading',
      distanceAway: 'Distance away',
      blessingParticles: 'Lotus Blossom Rain',
      toggleCamera: 'Toggle Live Camera'
    },
    booking: {
      title: 'Passes, Services & Experiences',
      subtitle: 'Pagoda admission is free. Reserve electric buggy shuttles, relics pass, and sunset tea rituals.',
      bookNow: 'Book Now',
      price: 'Price',
      visitDate: 'Visit Date',
      fullName: 'Full Name',
      phone: 'Phone Number',
      quantity: 'Quantity',
      total: 'Total Amount',
      checkout: 'Proceed to Checkout',
      payOnline: 'Secure Online Payment',
      selectPayment: 'Select Payment Method',
      eTicketTitle: 'Electronic Ticket Pass',
      eTicketSuccess: 'Payment completed! Your e-ticket is ready for check-in.',
      savePass: 'Save to Phone Wallet'
    },
    chat: {
      title: 'Linh Ung Virtual Guide (AI)',
      welcomeMsg: 'Namaste! I am the Linh Ung Pagoda Smart Assistant. Ask me anything about Buddhist history, 67m Lady Buddha, visiting etiquette, or wayfinding.',
      inputPlaceholder: 'Ask about opening hours, dress code, architecture, history...',
      send: 'Send',
      suggestedQuestions: 'Quick Inquiries',
      listening: 'Thinking...'
    },
    cicd: {
      title: 'Backend Services & CI/CD Operations',
      subtitle: 'Event-driven microservices architecture with automated GitHub Actions CI/CD.',
      runPipeline: 'Trigger New CI/CD Pipeline',
      servicesStatus: 'Microservices Health Status',
      eventStream: 'Inter-Service EventBus Activity',
      activeServices: 'Active Microservices'
    }
  },
  zh: {
    appName: '山茶半岛灵应寺',
    appSubtitle: '智能多语种解说与AR',
    tabs: {
      monuments: '古迹胜景',
      qrScanner: '扫码导览',
      map: '互动地图',
      ar: 'AR实景',
      tickets: '预约订票',
      chatAi: 'AI法师导游',
      backendCicd: '微服务与CI/CD'
    },
    audioGuide: {
      play: '播放解说',
      pause: '暂停',
      speed: '语速',
      nowPlaying: '正在讲解',
      stop: '停止',
      listenNarration: '收听多语种语音讲解',
      readTranscript: '详细文史资料',
      voiceSettings: '发音偏好'
    },
    scanner: {
      title: '扫描景点二维码听讲解',
      instruction: '将镜头对准各尊佛像或殿宇前的二维码，立即聆听深度文史语音导览。',
      simulatedTitle: '模拟扫码测试模式',
      simulatedDesc: '轻点以下古迹标牌，即刻模拟在灵应寺现场扫码：',
      scanNow: '开启相机扫描',
      cameraError: '无法调取摄像头，请授予权限或点击下方卡片体验。',
      cameraPermission: '需相机使用授权',
      scanSuccess: '二维码识别成功！'
    },
    map: {
      title: '全景导览与智能防迷路指引',
      antiLostTitle: '精准寻路防迷航导航',
      antiLostDesc: '为您测算最优步道路线，提示台阶坡度，安心游览海角名刹。',
      findRoute: '路线规划',
      fromLabel: '起点',
      toLabel: '终点',
      startRouting: '开启步道导航',
      itineraryTitle: '精选朝拜路线',
      distance: '步行距离',
      duration: '预估时间',
      legend: {
        poi: '寺院景点',
        user: '当前位置',
        buggy: '观光电瓶车',
        restroom: '卫生间',
        shadedRest: '林荫休憩处'
      }
    },
    ar: {
      title: '增强现实（AR）灵性沉浸体验',
      subtitle: '透过手机镜头，瞻仰观音莲花圣光与历史光影',
      cameraFeed: 'AR实景摄像头',
      haloEffect: '观音圣莲神光',
      historicalSlider: '建寺岁月时光轴',
      facingDirection: '罗盘方位',
      distanceAway: '相距',
      blessingParticles: '天女散莲祈愿',
      toggleCamera: '切换真实相机'
    },
    booking: {
      title: '园区便民服务与禅风体验预约',
      subtitle: '入寺免费，可便捷预约环保电瓶车、舍利特展及黄昏禅茶水灯。',
      bookNow: '立即预订',
      price: '费用',
      visitDate: '参拜日期',
      fullName: '联系人姓名',
      phone: '联系电话',
      quantity: '购买张数',
      total: '合计金额',
      checkout: '前往安全支付',
      payOnline: '在线安全快捷支付',
      selectPayment: '选择支付渠道',
      eTicketTitle: '灵应寺电子通行证',
      eTicketSuccess: '支付已完成！您的电子凭证已生成。',
      savePass: '保存至手机钱包'
    },
    chat: {
      title: '灵应智能解说向导（AI）',
      welcomeMsg: '南无阿弥陀佛！我是灵应寺智能问答向导，随时为您解答寺院典故、开放时间、参拜礼仪与步道路线。',
      inputPlaceholder: '咨询观音像高度、着装要求、开门时间...',
      send: '发送',
      suggestedQuestions: '常见问题速查',
      listening: '正在回复中...'
    },
    cicd: {
      title: '后端微服务集群与CI/CD运管中心',
      subtitle: '基于EventBus事件驱动通信与Kubernetes金丝雀自动发布流。',
      runPipeline: '触发最新CI/CD流水线',
      servicesStatus: '各微服务健康监控',
      eventStream: '服务间通信事件流（EventBus）',
      activeServices: '运行中的后端服务'
    }
  },
  ko: {
    appName: '손트라 영응사 (린응사)',
    appSubtitle: '스마트 오디오 가이드 & AR',
    tabs: {
      monuments: '유적지',
      qrScanner: 'QR 스캔',
      map: '지도 및 길안내',
      ar: 'AR 체험',
      tickets: '예약 및 투어',
      chatAi: 'AI 안내원',
      backendCicd: 'BE 서비스 & CI/CD'
    },
    audioGuide: {
      play: '음성 해설 재생',
      pause: '일시정지',
      speed: '배속',
      nowPlaying: '해설 진행 중',
      stop: '정지',
      listenNarration: '한국어 음성 해설 듣기',
      readTranscript: '상세 역사 해설',
      voiceSettings: '음성 설정'
    },
    scanner: {
      title: '유적지 QR 코드 스캔',
      instruction: '해수관음상, 대웅보전, 사리탑 앞 QR 코드를 비추면 즉시 한국어 음성 해설이 시작됩니다.',
      simulatedTitle: '테스트 및 시뮬레이션 모드',
      simulatedDesc: '아래 유적지를 탭하여 현장 QR 스캔을 즉시 체험해보세요:',
      scanNow: '스캐너 카메라 활성화',
      cameraError: '카메라를 실행할 수 없습니다. 권한을 확인하거나 아래 버튼을 이용하세요.',
      cameraPermission: '카메라 권한 필요',
      scanSuccess: 'QR 코드를 성공적으로 인식했습니다!'
    },
    map: {
      title: '인터랙티브 지도 및 길 잃음 방지',
      antiLostTitle: '스마트 길안내 엔진',
      antiLostDesc: '넓은 사찰 경내에서 최적의 이동 동선과 미끄럼 주의 계단을 안내합니다.',
      findRoute: '길 찾기',
      fromLabel: '출발지',
      toLabel: '목적지',
      startRouting: '내비게이션 시작',
      itineraryTitle: '추천 순례 코스',
      distance: '거리',
      duration: '도보 시간',
      legend: {
        poi: '사찰 유적',
        user: '내 위치',
        buggy: '전동 버기 정류장',
        restroom: '화장실',
        shadedRest: '그늘 쉼터'
      }
    },
    ar: {
      title: '증강현실 (AR) 생생한 영적 체험',
      subtitle: '스마트폰 카메라로 감상하는 3D 관음보살 연꽃 광배와 역사 여행',
      cameraFeed: 'AR 실시간 뷰',
      haloEffect: '관음 연꽃 광배 효과',
      historicalSlider: '사찰 건립 타임라인',
      facingDirection: '나침반 방위',
      distanceAway: '현재 거리',
      blessingParticles: '연꽃 꽃잎 비 효과',
      toggleCamera: '실제 카메라 전환'
    },
    booking: {
      title: '편의 서비스 & 투어 예약',
      subtitle: '사찰 입장료는 무료입니다. 전동 버기카, 사리탑 유물전, 선셋 유등 체험을 예약하세요.',
      bookNow: '예약하기',
      price: '금액',
      visitDate: '방문 일자',
      fullName: '예약자 성함',
      phone: '연락처',
      quantity: '수량',
      total: '총 결제 금액',
      checkout: '결제 진행하기',
      payOnline: '안전한 온라인 간편 결제',
      selectPayment: '결제 수단 선택',
      eTicketTitle: '전자 티켓 패스',
      eTicketSuccess: '결제가 완료되었습니다! 모바일 티켓이 발급되었습니다.',
      savePass: '티켓 저장하기'
    },
    chat: {
      title: '영응사 AI 버추얼 가이드',
      welcomeMsg: '나무아미타불! 다낭 영응사 스마트 안내 챗봇입니다. 사찰 역사, 67m 해수관음상, 복장 규정, 길안내를 도와드립니다.',
      inputPlaceholder: '개방 시간, 복장 규정, 사진 촬영 규정 문의...',
      send: '전송',
      suggestedQuestions: '자주 묻는 질문',
      listening: '답변 작성 중...'
    },
    cicd: {
      title: '백엔드 마이크로서비스 & CI/CD 관제 센터',
      subtitle: '이벤트 버스(EventBus) 기반 통신 및 쿠버네티스 카나리 자동 배포 파이프라인.',
      runPipeline: '새 CI/CD 파이프라인 실행',
      servicesStatus: '마이크로서비스 상태 모니터링',
      eventStream: '서비스 간 실시간 이벤트 로그',
      activeServices: '활성화된 서비스'
    }
  },
  ja: {
    appName: 'ダナン ソンチャ霊応寺',
    appSubtitle: 'スマート音声解説＆AR',
    tabs: {
      monuments: '見どころ',
      qrScanner: 'QRスキャン',
      map: '案内地図',
      ar: 'AR体験',
      tickets: '予約＆ツアー',
      chatAi: 'AI案内',
      backendCicd: 'BEサービス＆CI/CD'
    },
    audioGuide: {
      play: '解説を再生',
      pause: '一時停止',
      speed: '速度',
      nowPlaying: '再生中',
      stop: '停止',
      listenNarration: '日本語音声解説を聞く',
      readTranscript: '詳細な歴史解説',
      voiceSettings: '音声設定'
    },
    scanner: {
      title: '名所QRコードをスキャン',
      instruction: '観音像や本堂前のQRコードにカメラを向けると、直ちに日本語音声解説が始まります。',
      simulatedTitle: '体験・テストモード',
      simulatedDesc: '下の各スポットをクリックして、現地でのQRスキャンをシミュレートできます：',
      scanNow: 'カメラを起動',
      cameraError: 'カメラを起動できませんでした。権限を確認するか下のカードをお試しください。',
      cameraPermission: 'カメラの使用許可が必要です',
      scanSuccess: 'QRコードを認識しました！'
    },
    map: {
      title: 'インタラクティブ境内地図＆迷子防止ナビ',
      antiLostTitle: 'スマート案内エンジン',
      antiLostDesc: '広大な敷地内での最適な散策ルートを計算し、足元の石段注意などをガイドします。',
      findRoute: 'ルート案内',
      fromLabel: '出発地',
      toLabel: '目的地',
      startRouting: '案内開始',
      itineraryTitle: 'おすすめ参拝コース',
      distance: '距離',
      duration: '所要時間',
      legend: {
        poi: '名所・仏堂',
        user: '現在地',
        buggy: '電動カート乗り場',
        restroom: 'お手洗い',
        shadedRest: '木陰の休憩所'
      }
    },
    ar: {
      title: '拡張現実（AR）スピリチュアル体験',
      subtitle: 'スマートフォンの画面越しに広がる3D蓮華光背と歴史の旅',
      cameraFeed: 'ARライブビュー',
      haloEffect: '観音蓮華のオーラ',
      historicalSlider: '建立タイムライン',
      facingDirection: 'コンパス方位',
      distanceAway: '現在地からの距離',
      blessingParticles: '蓮華の花びらの雨',
      toggleCamera: 'カメラのオン/オフ'
    },
    booking: {
      title: 'サービス＆体験予約',
      subtitle: '拝観料は無料です。電動カート、舎利塔特別拝観、夕暮れの灯籠流しを予約できます。',
      bookNow: '予約する',
      price: '料金',
      visitDate: '拝観予定日',
      fullName: 'お名前',
      phone: '電話番号',
      quantity: '枚数',
      total: '合計金額',
      checkout: 'お支払いへ進む',
      payOnline: '安全なオンライン決済',
      selectPayment: '決済方法の選択',
      eTicketTitle: '電子チケットパス',
      eTicketSuccess: 'お支払いが完了しました！電子チケットが発行されました。',
      savePass: 'スマホに保存'
    },
    chat: {
      title: '霊応寺 AIバーチャルガイド',
      welcomeMsg: '南無阿弥陀仏！霊応寺の案内AIです。67mの観音像の歴史、参拝マナー、服装規定などお気軽にご質問ください。',
      inputPlaceholder: '拝観時間、服装ルール、アクセスなど...',
      send: '送信',
      suggestedQuestions: 'よくある質問',
      listening: '回答を生成中...'
    },
    cicd: {
      title: 'バックエンドマイクロサービス＆CI/CD管制',
      subtitle: 'EventBusイベント駆動通信とKubernetesカナリア自動デプロイ。',
      runPipeline: '最新CI/CDパイプラインを実行',
      servicesStatus: '各サービスの稼働状況',
      eventStream: 'サービス間通信ログ（EventBus）',
      activeServices: '稼働中サービス'
    }
  },
  fr: {
    appName: 'Pagode Linh Ung Son Tra',
    appSubtitle: 'Guide Vocal Intelligent & AR',
    tabs: {
      monuments: 'Monuments',
      qrScanner: 'Scanner QR',
      map: 'Carte & Nav',
      ar: 'Mode AR',
      tickets: 'Billetterie',
      chatAi: 'Guide IA',
      backendCicd: 'BE Services & CI/CD'
    },
    audioGuide: {
      play: 'Écouter l\'audio',
      pause: 'Pause',
      speed: 'Vitesse',
      nowPlaying: 'En cours de lecture',
      stop: 'Arrêter',
      listenNarration: 'Écouter l\'explication vocale',
      readTranscript: 'Détails historiques',
      voiceSettings: 'Voix'
    },
    scanner: {
      title: 'Scanner le Code QR du Monument',
      instruction: 'Visez les plaques QR situées aux pieds de la statue géante, du sanctuaire ou du stupa pour lancer la narration.',
      simulatedTitle: 'Mode Démonstration & Test',
      simulatedDesc: 'Cliquez sur l\'une des plaques ci-dessous pour simuler le scan instantané sur place :',
      scanNow: 'Activer la Caméra',
      cameraError: 'Caméra indisponible. Vérifiez les permissions ou essayez les cartes ci-dessous.',
      cameraPermission: 'Autorisation caméra requise',
      scanSuccess: 'Code QR reconnu avec succès !'
    },
    map: {
      title: 'Carte Interactive & Guidage Anti-Égarement',
      antiLostTitle: 'Système d\'Orientation Intelligent',
      antiLostDesc: 'Calcule l\'itinéraire optimal et signale les marches pour éviter de vous égarer.',
      findRoute: 'Trouver un itinéraire',
      fromLabel: 'Départ',
      toLabel: 'Arrivée',
      startRouting: 'Démarrer le guidage',
      itineraryTitle: 'Circuits conseillés',
      distance: 'Distance',
      duration: 'Temps de marche',
      legend: {
        poi: 'Monument',
        user: 'Votre position',
        buggy: 'Navette buggy',
        restroom: 'Toilettes',
        shadedRest: 'Espace ombragé'
      }
    },
    ar: {
      title: 'Expérience en Réalité Augmentée (AR)',
      subtitle: 'Immersion spirituelle 3D à travers la caméra de votre smartphone',
      cameraFeed: 'Vue Caméra AR',
      haloEffect: 'Aura du Lotus Sacré',
      historicalSlider: 'Chronologie Historique',
      facingDirection: 'Cap boussole',
      distanceAway: 'Distance',
      blessingParticles: 'Pluie de pétales de lotus',
      toggleCamera: 'Basculer Caméra Réelle'
    },
    booking: {
      title: 'Réservation de Services & Visites',
      subtitle: 'Entrée gratuite. Réservez la navette électrique, l\'accès aux reliques et la cérémonie du thé.',
      bookNow: 'Réserver',
      price: 'Tarif',
      visitDate: 'Date de visite',
      fullName: 'Nom complet',
      phone: 'Téléphone',
      quantity: 'Quantité',
      total: 'Montant total',
      checkout: 'Procéder au paiement',
      payOnline: 'Paiement en ligne sécurisé',
      selectPayment: 'Mode de paiement',
      eTicketTitle: 'Billet Électronique Pass',
      eTicketSuccess: 'Paiement confirmé ! Votre pass numérique est prêt.',
      savePass: 'Enregistrer le pass'
    },
    chat: {
      title: 'Assistant Spirituel Linh Ung (IA)',
      welcomeMsg: 'Namasté ! Je suis le guide virtuel de Linh Ung. Posez-moi vos questions sur la statue de 67m, les horaires ou les règles vestimentaires.',
      inputPlaceholder: 'Horaires, tenue vestimentaire, histoire bouddhiste...',
      send: 'Envoyer',
      suggestedQuestions: 'Questions fréquentes',
      listening: 'Réflexion en cours...'
    },
    cicd: {
      title: 'Supervision Backend & Pipeline CI/CD',
      subtitle: 'Architecture microservices pilotée par EventBus et déploiement continu Kubernetes.',
      runPipeline: 'Déclencher un nouveau pipeline',
      servicesStatus: 'État des microservices',
      eventStream: 'Journal des événements EventBus',
      activeServices: 'Microservices actifs'
    }
  }
};
