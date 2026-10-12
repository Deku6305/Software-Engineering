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
    scannerSubtitle: string;
    instruction: string;
    simulatedTitle: string;
    simulatedDesc: string;
    scanNow: string;
    cameraError: string;
    cameraOff: string;
    restartCamera: string;
    cameraPermission: string;
    scanSuccess: string;
    scanningStatus: string;
    liveCamera: string;
    flashTitle: string;
    scannedCodeBadge: string;
    listenNow: string;
    manualInputPlaceholder: string;
    manualSubmit: string;
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
    safeZoneStatus: string;
    itineraryOptimal: string;
    tapToActivate: string;
    selectTour: string;
    inProgress: string;
    pointsCount: string;
    compassNorth: string;
    resetPositionTitle: string;
    resetPositionBtn: string;
    youAreHere: string;
    clickPoiHint: string;
    routeTo: string;
    antiLostGuideTitle: string;
    walkingMinutes: string;
    distanceLabel: string;
    timeLabel: string;
    listenDestinationBtn: string;
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
    arTitleFull: string;
    arHeadingEast: string;
    arHeadingNorth: string;
    turnCameraOff: string;
    turnCameraOn: string;
    elevationText: string;
    listenArBtn: string;
    rotateLeftTitle: string;
    rotateRightTitle: string;
    haloBtn: string;
    particlesBtn: string;
    timelineReconstruction: string;
    yearLabel: string;
    milestone2004: string;
    milestone2010: string;
    milestonePresent: string;
    period2004Text: string;
    period2010Text: string;
    periodPresentText: string;
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
    secureGuarantee: string;
    selectPackageTitle: string;
    bookingInfoTitle: string;
    instantConfirmText: string;
    selectedPackageLabel: string;
    perTrip: string;
    emailLabel: string;
    processingBooking: string;
    proceedSecurePay: string;
    onlineGatewayTitle: string;
    orderCodeLabel: string;
    amountToPay: string;
    bankAppScanHint: string;
    bankNameLabel: string;
    accountNumberLabel: string;
    accountNameLabel: string;
    transferDescLabel: string;
    copiedSuccess: string;
    cardNumLabel: string;
    cardExpLabel: string;
    cardCvvLabel: string;
    confirmPaidBtn: string;
    confirmingProcessing: string;
    eventBusNotice: string;
    paymentSuccessBadge: string;
    checkInCodeLabel: string;
    customerLabel: string;
    serviceLabel: string;
    quantityGuests: string;
    totalPaidLabel: string;
    checkInQrInstruction: string;
    passSavedAlert: string;
    closeNotice: string;
    internationalCard: string;
    fillInfoAlert: string;
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
  common: {
    mobileFrame: string;
    fullScreen: string;
    close: string;
    minutes: string;
    elevation: string;
    heading: string;
  };
  monumentView: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    categories: {
      all: string;
      monument: string;
      temple: string;
      relic: string;
      viewpoint: string;
      nature: string;
    };
    audioGuideBtn: string;
    pauseBtn: string;
    detailsBtn: string;
    autoVoiceTitle: string;
    autoVoiceSubtitle: string;
    listenNowBtn: string;
    selectVoiceLangLabel: string;
    historyTitle: string;
    spiritualTitle: string;
    architectureTitle: string;
    adviceTitle: string;
    navigateBtn: string;
    viewArBtn: string;
    tryQrBtn: string;
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
      scannerSubtitle: 'Quét Mã QR Nhận Diện Di Tích',
      instruction: 'Hướng camera về phía bảng mã QR đặt tại các chân tượng, tháp xá lợi hoặc chánh điện để kích hoạt thuyết minh tức thì.',
      simulatedTitle: 'Chế độ Trải nghiệm & Thử nghiệm QR',
      simulatedDesc: 'Bấm nhanh vào các thẻ di tích dưới đây để mô phỏng quét mã QR thực tế tại chùa:',
      scanNow: 'Kích hoạt Camera Quét',
      cameraError: 'Không thể truy cập camera. Vui lòng cấp quyền hoặc sử dụng thẻ thử nghiệm bên dưới.',
      cameraOff: 'Camera đang tắt hoặc không khả dụng',
      restartCamera: 'Khởi động lại Camera',
      cameraPermission: 'Yêu cầu quyền truy cập Camera',
      scanSuccess: 'Đã nhận diện mã QR thành công!',
      scanningStatus: 'ĐANG QUÉT MÃ QR...',
      liveCamera: 'LIVE CAMERA',
      flashTitle: 'Bật/Tắt đèn flash',
      scannedCodeBadge: 'Đã quét mã',
      listenNow: 'Nghe ngay',
      manualInputPlaceholder: 'Nhập mã QR di tích (ví dụ: LU-QUANAM-01)...',
      manualSubmit: 'Nhập'
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
      safeZoneStatus: 'Đang bám sát vị trí: Vùng an toàn chùa Linh Ứng',
      itineraryOptimal: '(Lựa chọn lộ trình tối ưu)',
      tapToActivate: 'Chạm để kích hoạt hướng dẫn',
      selectTour: 'Chọn tour',
      inProgress: 'Đang đi',
      pointsCount: 'điểm',
      compassNorth: 'Bắc Sơn Trà (350° N)',
      resetPositionTitle: 'Đưa vị trí bạn về Cổng Tam Quan',
      resetPositionBtn: 'Về điểm xuất phát',
      youAreHere: 'Bạn ở đây',
      clickPoiHint: '*Nhấp trực tiếp vào bất kỳ tượng để bắt đầu chỉ đường',
      routeTo: 'Lộ trình tới',
      antiLostGuideTitle: 'Hướng dẫn di chuyển chống lạc',
      walkingMinutes: 'phút đi bộ',
      distanceLabel: 'Khoảng cách:',
      timeLabel: 'Thời gian: ~',
      listenDestinationBtn: 'Nghe thuyết minh điểm đến này',
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
      toggleCamera: 'Bật/Tắt Camera Thật',
      arTitleFull: 'Không Gian Linh Thiêng Tăng Cường (AR)',
      arHeadingEast: 'ĐÔNG (Biển Đông)',
      arHeadingNorth: 'BẮC (Sơn Trà)',
      turnCameraOff: 'Tắt Camera',
      turnCameraOn: 'Bật Camera Thật',
      elevationText: 'mét (Độ dốc +15m)',
      listenArBtn: 'Nghe Thuyết Minh AR',
      rotateLeftTitle: 'Xoay trái 15°',
      rotateRightTitle: 'Xoay phải 15°',
      haloBtn: 'Hào Quang Sen',
      particlesBtn: 'Mưa Hoa Sen',
      timelineReconstruction: '(Tái Hiện Không Gian Lịch Sử)',
      yearLabel: 'Năm',
      milestone2004: '2004: Khởi công đặt đá',
      milestone2010: '2010: Khánh thành tượng 67m',
      milestonePresent: 'Hiện tại: Quần thể hoàn mỹ',
      period2004Text: 'Giai đoạn 2004: Vùng đồi núi hoang sơ Bãi Bụt bắt đầu khởi công. Hàng vạn khối đá cẩm thạch trắng được vận chuyển từ làng Non Nước về dưới sự chỉ đạo của Cố Thượng tọa Thích Thiện Nguyện.',
      period2010Text: 'Giai đoạn 2010: Đại lễ khánh thành tôn tượng Phật Bà Quan Thế Âm 67m và Chánh Điện. Hàng vạn tăng ni Phật tử và khách quốc tế chiêm bái hào quang trên biển.',
      periodPresentText: 'Hiện tại: Biểu tượng tâm linh hàng đầu miền Trung, che chở sóng gió cho ngư dân Đà Nẵng và đón hàng triệu du khách chiêm bái.'
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
      savePass: 'Lưu Thẻ Vào Điện Thoại',
      secureGuarantee: 'Thanh toán VietQR & MoMo bảo mật 100%',
      selectPackageTitle: 'Chọn Gói Tiện Ích & Dịch Vụ',
      bookingInfoTitle: 'Thông Tin Đặt Vé & Thanh Toán',
      instantConfirmText: 'Xác nhận tức thì qua tin nhắn & vé điện tử',
      selectedPackageLabel: 'Gói dịch vụ đã chọn:',
      perTrip: '/ lượt',
      emailLabel: 'Email nhận vé (không bắt buộc)',
      processingBooking: 'Đang xử lý đặt vé...',
      proceedSecurePay: 'Tiến Hành Thanh Toán Bảo Mật',
      onlineGatewayTitle: 'Cổng Thanh Toán Trực Tuyến',
      orderCodeLabel: 'Mã đơn:',
      amountToPay: 'Số tiền cần thanh toán:',
      bankAppScanHint: 'Mở ứng dụng ngân hàng bất kỳ (VCB, MB, Techcombank, BIDV...) quét mã QR',
      bankNameLabel: 'Ngân hàng:',
      accountNumberLabel: 'Số tài khoản:',
      accountNameLabel: 'Chủ tài khoản:',
      transferDescLabel: 'Nội dung chuyển khoản:',
      copiedSuccess: '✓ Đã sao chép vào bộ nhớ tạm!',
      cardNumLabel: 'Số thẻ tín dụng / ghi nợ',
      cardExpLabel: 'Hạn thẻ (MM/YY)',
      cardCvvLabel: 'Mã bảo mật (CVV)',
      confirmPaidBtn: 'Xác Nhận Đã Thanh Toán & Nhận Vé Ngay',
      confirmingProcessing: 'Đang kết nối cổng ngân hàng & phát hành vé...',
      eventBusNotice: 'Hệ thống xác thực giao dịch tự động qua EventBus microservice trong 1-3 giây.',
      paymentSuccessBadge: 'ĐÃ THANH TOÁN THÀNH CÔNG',
      checkInCodeLabel: 'Mã vé (Check-in Code):',
      customerLabel: 'Khách hàng:',
      serviceLabel: 'Dịch vụ:',
      quantityGuests: 'khách',
      totalPaidLabel: 'Tổng thanh toán:',
      checkInQrInstruction: 'Xuất trình mã QR này tại trạm xe điện buggy hoặc cổng Tháp Xá Lợi để check-in.',
      passSavedAlert: 'Vé điện tử đã được lưu vào bộ nhớ thiết bị của bạn!',
      closeNotice: 'Đóng thông báo',
      internationalCard: 'Thẻ Quốc Tế',
      fillInfoAlert: 'Vui lòng điền họ tên và số điện thoại liên hệ'
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
    },
    common: {
      mobileFrame: 'Khung điện thoại',
      fullScreen: 'Toàn màn hình',
      close: 'Đóng',
      minutes: 'phút',
      elevation: 'Độ cao',
      heading: 'Hướng'
    },
    monumentView: {
      heroBadge: 'Chùa Linh Ứng Bãi Bụt • Bán đảo Sơn Trà',
      heroTitle: 'Hệ Thống Thuyết Minh Di Tích',
      heroSubtitle: 'Khám phá 9 điểm di tích linh thiêng bằng giọng đọc thuyết minh đa ngôn ngữ tự động (tùy chọn 6 thứ tiếng), quét mã QR tại hiện trường và trải nghiệm không gian AR sống động.',
      searchPlaceholder: 'Tìm theo tên tượng Phật, mã QR, lịch sử...',
      categories: {
        all: 'Tất cả',
        monument: 'Tượng đài',
        temple: 'Điện thờ',
        relic: 'Xá lợi',
        viewpoint: 'Vọng cảnh',
        nature: 'Thiên nhiên'
      },
      audioGuideBtn: 'Nghe thuyết minh',
      pauseBtn: 'Tạm dừng',
      detailsBtn: 'Chi tiết',
      autoVoiceTitle: 'Thuyết Minh Giọng Nói Tự Động',
      autoVoiceSubtitle: 'Thời lượng ~{min} phút • Chọn ngôn ngữ nghe bên dưới',
      listenNowBtn: 'Nghe ngay',
      selectVoiceLangLabel: 'Chọn ngôn ngữ phát giọng đọc thuyết minh:',
      historyTitle: 'Lịch Sử & Quá Trình Xây Dựng',
      spiritualTitle: 'Ý Nghĩa Tâm Linh & Hạnh Nguyện',
      architectureTitle: 'Đặc Điểm Kiến Trúc Điêu Khắc',
      adviceTitle: 'Lời khuyên cho du khách:',
      navigateBtn: 'Dẫn đường đến đây',
      viewArBtn: 'Xem qua AR 3D',
      tryQrBtn: 'Thử mã QR này'
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
      scannerSubtitle: 'Scan QR to Identify Monuments',
      instruction: 'Point your camera at the QR plaques located at Lady Buddha, Main Hall, or Stupa to instantly launch voice narration.',
      simulatedTitle: 'Test & Simulation Mode',
      simulatedDesc: 'Click any monument card below to simulate instant on-site QR scanning:',
      scanNow: 'Activate Scanner Camera',
      cameraError: 'Camera unavailable. Please check permissions or use sample cards below.',
      cameraOff: 'Camera is off or unavailable',
      restartCamera: 'Restart Camera',
      cameraPermission: 'Camera Permission Required',
      scanSuccess: 'QR Code recognized successfully!',
      scanningStatus: 'SCANNING QR CODE...',
      liveCamera: 'LIVE CAMERA',
      flashTitle: 'Toggle flashlight',
      scannedCodeBadge: 'Scanned Code',
      listenNow: 'Listen Now',
      manualInputPlaceholder: 'Enter monument QR code (e.g. LU-QUANAM-01)...',
      manualSubmit: 'Enter'
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
      safeZoneStatus: 'Tracking GPS: Linh Ung Safe Sanctuary Zone',
      itineraryOptimal: '(Optimal Route Selection)',
      tapToActivate: 'Tap to activate wayfinding',
      selectTour: 'Select tour',
      inProgress: 'Navigating',
      pointsCount: 'stops',
      compassNorth: 'North Son Tra (350° N)',
      resetPositionTitle: 'Reset your position to Tam Quan Gate',
      resetPositionBtn: 'Back to start',
      youAreHere: 'You are here',
      clickPoiHint: '*Click directly on any monument icon to begin navigation',
      routeTo: 'Route to',
      antiLostGuideTitle: 'Anti-Lost Step Navigation',
      walkingMinutes: 'mins walk',
      distanceLabel: 'Distance:',
      timeLabel: 'Est. time: ~',
      listenDestinationBtn: 'Listen to destination audio guide',
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
      toggleCamera: 'Toggle Live Camera',
      arTitleFull: 'Sacred Augmented Reality (AR) Space',
      arHeadingEast: 'EAST (East Sea)',
      arHeadingNorth: 'NORTH (Son Tra)',
      turnCameraOff: 'Turn Off Camera',
      turnCameraOn: 'Enable Real Camera',
      elevationText: 'meters (Slope +15m)',
      listenArBtn: 'Listen to AR Narration',
      rotateLeftTitle: 'Rotate left 15°',
      rotateRightTitle: 'Rotate right 15°',
      haloBtn: 'Lotus Halo',
      particlesBtn: 'Lotus Petals',
      timelineReconstruction: '(Historical Reconstruction)',
      yearLabel: 'Year',
      milestone2004: '2004: Foundation stone laid',
      milestone2010: '2010: 67m statue inaugurated',
      milestonePresent: 'Present: Sacred Sanctuary',
      period2004Text: 'Phase 2004: Construction begins on the rugged cliffs of Bai But. Thousands of white marble blocks transported from Non Nuoc village under the late Venerable Thich Thien Nguyen.',
      period2010Text: 'Phase 2010: Grand inauguration of the 67m Lady Buddha statue and Main Sanctuary. Tens of thousands of monks, pilgrims, and international guests gather by the sea.',
      periodPresentText: 'Present Day: The premier spiritual icon of Central Vietnam, protecting fishermen from storms and welcoming millions of global travelers.'
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
      savePass: 'Save to Phone Wallet',
      secureGuarantee: '100% Secure Payment via QR & Cards',
      selectPackageTitle: 'Select Passes & Services',
      bookingInfoTitle: 'Booking & Checkout Details',
      instantConfirmText: 'Instant confirmation & digital ticket delivery',
      selectedPackageLabel: 'Selected Service Package:',
      perTrip: '/ pass',
      emailLabel: 'Ticket Delivery Email (Optional)',
      processingBooking: 'Processing Booking...',
      proceedSecurePay: 'Proceed to Secure Payment',
      onlineGatewayTitle: 'Online Payment Gateway',
      orderCodeLabel: 'Order ID:',
      amountToPay: 'Amount to Pay:',
      bankAppScanHint: 'Open any mobile banking or payment app to scan this QR code',
      bankNameLabel: 'Bank:',
      accountNumberLabel: 'Account Number:',
      accountNameLabel: 'Account Holder:',
      transferDescLabel: 'Transfer Reference:',
      copiedSuccess: '✓ Copied to clipboard!',
      cardNumLabel: 'Credit / Debit Card Number',
      cardExpLabel: 'Expiry Date (MM/YY)',
      cardCvvLabel: 'Security Code (CVV)',
      confirmPaidBtn: 'Confirm Payment & Get E-Pass',
      confirmingProcessing: 'Connecting to gateway & issuing ticket...',
      eventBusNotice: 'Automatic transaction verification via EventBus microservice in 1-3 seconds.',
      paymentSuccessBadge: 'PAYMENT SUCCESSFUL',
      checkInCodeLabel: 'Check-in Code:',
      customerLabel: 'Guest Name:',
      serviceLabel: 'Service:',
      quantityGuests: 'guests',
      totalPaidLabel: 'Total Paid:',
      checkInQrInstruction: 'Present this QR code at the buggy station or Stupa entrance for instant check-in.',
      passSavedAlert: 'Electronic ticket pass saved to your device!',
      closeNotice: 'Close',
      internationalCard: 'International Card',
      fillInfoAlert: 'Please enter your name and contact phone number'
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
    },
    common: {
      mobileFrame: 'Phone View',
      fullScreen: 'Full Screen',
      close: 'Close',
      minutes: 'mins',
      elevation: 'Elevation',
      heading: 'Heading'
    },
    monumentView: {
      heroBadge: 'Linh Ung Pagoda Bai But • Son Tra Peninsula',
      heroTitle: 'Heritage Audio Guide System',
      heroSubtitle: 'Explore sacred Buddhist monuments with automated multilingual audio commentary (6 languages), on-site QR code scanning, and immersive 3D AR experiences.',
      searchPlaceholder: 'Search by Buddha statue, QR code, history...',
      categories: {
        all: 'All',
        monument: 'Monuments',
        temple: 'Sanctuaries',
        relic: 'Stupas',
        viewpoint: 'Viewpoints',
        nature: 'Nature'
      },
      audioGuideBtn: 'Listen Guide',
      pauseBtn: 'Pause',
      detailsBtn: 'Details',
      autoVoiceTitle: 'Automated Voice Narration',
      autoVoiceSubtitle: 'Duration ~{min} mins • Select voice language below',
      listenNowBtn: 'Listen Now',
      selectVoiceLangLabel: 'Choose voice narration language:',
      historyTitle: 'History & Construction',
      spiritualTitle: 'Spiritual Meaning & Vows',
      architectureTitle: 'Architectural & Sculptural Features',
      adviceTitle: 'Visitor Advice & Etiquette:',
      navigateBtn: 'Navigate Here',
      viewArBtn: 'View in 3D AR',
      tryQrBtn: 'Test This QR'
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
      scannerSubtitle: '扫描古迹二维码识别景点',
      instruction: '将镜头对准各尊佛像或殿宇前的二维码，立即聆听深度文史语音导览。',
      simulatedTitle: '模拟扫码测试模式',
      simulatedDesc: '轻点以下古迹标牌，即刻模拟在灵应寺现场扫码：',
      scanNow: '开启相机扫描',
      cameraError: '无法调取摄像头，请授予权限或点击下方卡片体验。',
      cameraOff: '摄像头已关闭或不可用',
      restartCamera: '重新启动相机',
      cameraPermission: '需相机使用授权',
      scanSuccess: '二维码识别成功！',
      scanningStatus: '正在扫描二维码...',
      liveCamera: '实时相机',
      flashTitle: '开关闪光灯',
      scannedCodeBadge: '已识别代码',
      listenNow: '立即收听',
      manualInputPlaceholder: '输入景点代码（如：LU-QUANAM-01）...',
      manualSubmit: '查询'
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
      safeZoneStatus: 'GPS实时追踪：灵应寺安全导览区',
      itineraryOptimal: '（精选最优路线）',
      tapToActivate: '点击开启路径指引',
      selectTour: '选择路线',
      inProgress: '导航中',
      pointsCount: '处景点',
      compassNorth: '山茶半岛以北 (350° N)',
      resetPositionTitle: '重置位置至三关门起点',
      resetPositionBtn: '重置起点',
      youAreHere: '您在此处',
      clickPoiHint: '*轻点地图任意佛像标记即可开启步行导航',
      routeTo: '前往路线：',
      antiLostGuideTitle: '防迷路逐步步行指引',
      walkingMinutes: '分钟步行',
      distanceLabel: '距离：',
      timeLabel: '用时：~',
      listenDestinationBtn: '收听此目的地语音讲解',
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
      toggleCamera: '切换真实相机',
      arTitleFull: '增强现实（AR）灵性沉浸空间',
      arHeadingEast: '东（东海）',
      arHeadingNorth: '北（山茶半岛）',
      turnCameraOff: '关闭相机',
      turnCameraOn: '开启真实相机',
      elevationText: '米（坡度 +15米）',
      listenArBtn: '收听AR语音解说',
      rotateLeftTitle: '左转15°',
      rotateRightTitle: '右转15°',
      haloBtn: '莲花光环',
      particlesBtn: '散花祈福',
      timelineReconstruction: '（历史时空重现）',
      yearLabel: '年份',
      milestone2004: '2004：奠基破土',
      milestone2010: '2010：67米大佛落成',
      milestonePresent: '现今：宏伟海天道场',
      period2004Text: '2004年阶段：山茶半岛佛滩山林破土动工，由已故释善愿法师主持，从五行山石雕村运抵数万块汉白玉大理石。',
      period2010Text: '2010年阶段：67米观世音菩萨巨像与大雄宝殿举行落成大典，数万海内外信众齐聚海天佛国，见证慈悲祥光。',
      periodPresentText: '当下：越南中南部至高精神地标，常年庇佑出海渔民风调雨顺，迎候全球数百万朝圣宾朋。'
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
      savePass: '保存至手机钱包',
      secureGuarantee: '100%安全在线支付与即时出票',
      selectPackageTitle: '选择便民服务与体验套票',
      bookingInfoTitle: '预订信息与结算',
      instantConfirmText: '即时确认并生成数字电子凭证',
      selectedPackageLabel: '已选服务项目：',
      perTrip: '/ 次',
      emailLabel: '接收电子票邮箱（选填）',
      processingBooking: '正在生成订单...',
      proceedSecurePay: '前往安全支付',
      onlineGatewayTitle: '在线安全收银台',
      orderCodeLabel: '订单号：',
      amountToPay: '应付金额：',
      bankAppScanHint: '打开任意移动银行应用即可扫码付款',
      bankNameLabel: '银行：',
      accountNumberLabel: '账号：',
      accountNameLabel: '开户名：',
      transferDescLabel: '转账附言：',
      copiedSuccess: '✓ 已复制到剪贴板！',
      cardNumLabel: '信用卡 / 借记卡号',
      cardExpLabel: '有效期 (MM/YY)',
      cardCvvLabel: '安全码 (CVV)',
      confirmPaidBtn: '确认支付并获取电子票',
      confirmingProcessing: '正在连接网关并生成电子票...',
      eventBusNotice: '系统通过EventBus微服务在1-3秒内自动完成交易校验。',
      paymentSuccessBadge: '支付成功',
      checkInCodeLabel: '核销代码（Check-in）：',
      customerLabel: '参拜宾客：',
      serviceLabel: '服务项目：',
      quantityGuests: '人',
      totalPaidLabel: '实付总额：',
      checkInQrInstruction: '在观光电瓶车站点或舍利塔入口处出示此二维码即可核销。',
      passSavedAlert: '电子凭证已成功保存至您的设备！',
      closeNotice: '关闭',
      internationalCard: '国际银行卡',
      fillInfoAlert: '请填写您的姓名与联系电话'
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
    },
    common: {
      mobileFrame: '手机视窗',
      fullScreen: '全屏显示',
      close: '关闭',
      minutes: '分钟',
      elevation: '海拔',
      heading: '方位'
    },
    monumentView: {
      heroBadge: '山茶半岛白佛灵应寺',
      heroTitle: '古迹多语种智能解说系统',
      heroSubtitle: '探索9处圣景胜迹，体验6国语言自动化语音讲解、现场二维码即扫即听与AR实景沉浸体验。',
      searchPlaceholder: '搜索佛像名称、二维码、文史典故...',
      categories: {
        all: '全部',
        monument: '造像',
        temple: '殿堂',
        relic: '舍利塔',
        viewpoint: '观景台',
        nature: '生态自然'
      },
      audioGuideBtn: '语音导览',
      pauseBtn: '暂停',
      detailsBtn: '查看详情',
      autoVoiceTitle: '智能语音解说',
      autoVoiceSubtitle: '时长约 {min} 分钟 • 在下方切换发音语言',
      listenNowBtn: '立即聆听',
      selectVoiceLangLabel: '选择语音解说发音语言：',
      historyTitle: '历史渊源与建寺历程',
      spiritualTitle: '宗教内涵与大愿信仰',
      architectureTitle: '雕塑造像与建筑特征',
      adviceTitle: '朝拜参访提示：',
      navigateBtn: '步行导航至此',
      viewArBtn: 'AR 3D实景',
      tryQrBtn: '模拟此二维码'
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
      scannerSubtitle: '유적지 QR 코드 인식 스캔',
      instruction: '해수관음상, 대웅보전, 사리탑 앞 QR 코드를 비추면 즉시 한국어 음성 해설이 시작됩니다.',
      simulatedTitle: '테스트 및 시뮬레이션 모드',
      simulatedDesc: '아래 유적지를 탭하여 현장 QR 스캔을 즉시 체험해보세요:',
      scanNow: '스캐너 카메라 활성화',
      cameraError: '카메라를 실행할 수 없습니다. 권한을 확인하거나 아래 버튼을 이용하세요.',
      cameraOff: '카메라가 꺼져 있거나 사용할 수 없습니다',
      restartCamera: '카메라 재시작',
      cameraPermission: '카메라 권한 필요',
      scanSuccess: 'QR 코드를 성공적으로 인식했습니다!',
      scanningStatus: 'QR 코드 스캔 중...',
      liveCamera: '실시간 카메라',
      flashTitle: '플래시 켜기/끄기',
      scannedCodeBadge: '스캔 완료 코드',
      listenNow: '바로 듣기',
      manualInputPlaceholder: '유적지 QR 코드 입력 (예: LU-QUANAM-01)...',
      manualSubmit: '입력'
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
      safeZoneStatus: '위치 추적 중: 영응사 안전 안내 구역',
      itineraryOptimal: '(최적 경로 선택)',
      tapToActivate: '경로 안내를 시작하려면 탭하세요',
      selectTour: '투어 선택',
      inProgress: '이동 중',
      pointsCount: '개 지점',
      compassNorth: '손트라 북쪽 (350° N)',
      resetPositionTitle: '출발지 삼문으로 내 위치 재설정',
      resetPositionBtn: '출발점으로',
      youAreHere: '내 위치',
      clickPoiHint: '*지도의 기념물 아이콘을 클릭하여 길안내를 시작하세요',
      routeTo: '이동 경로:',
      antiLostGuideTitle: '길 잃음 방지 단계별 안내',
      walkingMinutes: '분 도보',
      distanceLabel: '거리:',
      timeLabel: '예상 시간: ~',
      listenDestinationBtn: '이 목적지 음성 해설 듣기',
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
      toggleCamera: '실제 카메라 전환',
      arTitleFull: '증강현실(AR) 성스러운 가상 공간',
      arHeadingEast: '동쪽 (동해 바다)',
      arHeadingNorth: '북쪽 (손트라 산)',
      turnCameraOff: '카메라 끄기',
      turnCameraOn: '실제 카메라 켜기',
      elevationText: '미터 (경사도 +15m)',
      listenArBtn: 'AR 음성 해설 듣기',
      rotateLeftTitle: '좌회전 15°',
      rotateRightTitle: '우회전 15°',
      haloBtn: '연꽃 광배',
      particlesBtn: '연꽃잎 비',
      timelineReconstruction: '(역사적 시공간 재현)',
      yearLabel: '연도',
      milestone2004: '2004: 기공식 및 착공',
      milestone2010: '2010: 67m 대불 낙성식',
      milestonePresent: '현재: 웅장한 사찰 군락',
      period2004Text: '2004년 단계: 황량했던 바이붓 산기슭에서 공사가 시작되었습니다. 틱티엔응우옌 스님의 지도 하에 논느억 마을에서 수만 개의 대리석이 운반되었습니다.',
      period2010Text: '2010년 단계: 67m 해수관음보살상과 대웅보전의 성대한 낙성식이 거행되었습니다. 수많은 순례자와 관광객들이 동해 바다를 바라보며 기도했습니다.',
      periodPresentText: '현재: 베트남 중부 최고의 영적 랜드마크로서 다낭 어민들의 안녕을 기원하고 전 세계 수백만 관광객을 맞이하고 있습니다.'
    },
    booking: {
      title: '편의 서비스 & 투어 예약',
      subtitle: '사찰 입장료는 무료입니다. 전동 버기카, 사리탑 유물전, 선셋 유등 체험을 예약하세요.',
      bookNow: '예약하기',
      price: '금액',
      visitDate: '방문 일자',
      fullName: '예약자 성함',
      phone: '연락처',
      quantity: '구매 수량',
      total: '총 결제 금액',
      checkout: '결제 진행',
      payOnline: '안전 온라인 결제',
      selectPayment: '결제 수단 선택',
      eTicketTitle: '전자 티켓 패스',
      eTicketSuccess: '결제가 완료되었습니다! 전자 티켓이 준비되었습니다.',
      savePass: '기기에 티켓 저장',
      secureGuarantee: '100% 안전 결제 및 즉시 발권',
      selectPackageTitle: '편의 서비스 & 체험 패키지 선택',
      bookingInfoTitle: '예약 정보 및 결제',
      instantConfirmText: '즉시 확인 및 전자 티켓 발급',
      selectedPackageLabel: '선택한 서비스 패키지:',
      perTrip: '/ 회',
      emailLabel: '티켓 수신 이메일 (선택 사항)',
      processingBooking: '예약 처리 중...',
      proceedSecurePay: '안전 결제 진행',
      onlineGatewayTitle: '온라인 결제 게이트웨이',
      orderCodeLabel: '주문 번호:',
      amountToPay: '결제 금액:',
      bankAppScanHint: '모바일 뱅킹 앱을 열고 QR 코드를 스캔하세요',
      bankNameLabel: '은행:',
      accountNumberLabel: '계좌번호:',
      accountNameLabel: '예금주:',
      transferDescLabel: '송금 메모:',
      copiedSuccess: '✓ 클립보드에 복사되었습니다!',
      cardNumLabel: '신용 / 체크카드 번호',
      cardExpLabel: '유효기간 (MM/YY)',
      cardCvvLabel: '보안코드 (CVV)',
      confirmPaidBtn: '결제 완료 확인 및 티켓 수령',
      confirmingProcessing: '은행 게이트웨이 연결 및 티켓 발급 중...',
      eventBusNotice: '시스템이 EventBus 마이크로서비스를 통해 1-3초 내에 거래를 자동 검증합니다.',
      paymentSuccessBadge: '결제 완료',
      checkInCodeLabel: '체크인 코드:',
      customerLabel: '방문객:',
      serviceLabel: '서비스:',
      quantityGuests: '명',
      totalPaidLabel: '총 결제 금액:',
      checkInQrInstruction: '전동 버기 정류장 또는 사리탑 입구에서 이 QR 코드를 제시하여 체크인하세요.',
      passSavedAlert: '전자 티켓이 기기에 저장되었습니다!',
      closeNotice: '닫기',
      internationalCard: '해외 카드',
      fillInfoAlert: '성함과 연락처를 입력해 주세요'
    },
    chat: {
      title: '영응사 스마트 AI 가이드',
      welcomeMsg: '나무아미타불! 영응사 스마트 가이드입니다. 67m 해수관음상, 관람 예절, 개방 시간 및 사찰 역사에 대해 무엇이든 물어보세요.',
      inputPlaceholder: '개장 시간, 복장 규정, 불교 건축, 역사 문의...',
      send: '전송',
      suggestedQuestions: '추천 질문',
      listening: '답변 생성 중...'
    },
    cicd: {
      title: '백엔드 마이크로서비스 및 CI/CD 센터',
      subtitle: 'EventBus 기반 비동기 통신과 쿠버네티스 자동 배포 파이프라인.',
      runPipeline: '최신 CI/CD 파이프라인 실행',
      servicesStatus: '마이크로서비스 상태',
      eventStream: '서비스 간 통신 로그 (EventBus)',
      activeServices: '활성 서비스 목록'
    },
    common: {
      mobileFrame: '스마트폰 뷰',
      fullScreen: '전체 화면',
      close: '닫기',
      minutes: '분',
      elevation: '고도',
      heading: '방위'
    },
    monumentView: {
      heroBadge: '손트라 반도 바이붓 영응사',
      heroTitle: '스마트 유적지 음성 해설 시스템',
      heroSubtitle: '6개 언어 자동 음성 해설, 현장 QR 스캔, 3D AR 증강현실로 사찰 경내 9개 성소를 탐방해보세요.',
      searchPlaceholder: '불상 이름, QR 코드, 역사 검색...',
      categories: {
        all: '전체',
        monument: '불상・조각',
        temple: '전각・법당',
        relic: '사리탑',
        viewpoint: '전망대',
        nature: '자연 경관'
      },
      audioGuideBtn: '음성 해설 듣기',
      pauseBtn: '일시정지',
      detailsBtn: '상세 정보',
      autoVoiceTitle: '자동 음성 해설',
      autoVoiceSubtitle: '재생 시간 약 {min}분 • 아래에서 언어를 선택하세요',
      listenNowBtn: '지금 듣기',
      selectVoiceLangLabel: '음성 해설 언어 선택:',
      historyTitle: '사찰 역사와 건립 과정',
      spiritualTitle: '영적 의미와 서원',
      architectureTitle: '건축 및 조각 양식 특징',
      adviceTitle: '관람객 주의사항:',
      navigateBtn: '이곳으로 길안내',
      viewArBtn: '3D AR로 보기',
      tryQrBtn: '이 QR 코드 테스트'
    }
  },
  ja: {
    appName: 'ソンチャ半島 霊応寺（リンウン寺）',
    appSubtitle: 'スマート音声ガイド＆AR',
    tabs: {
      monuments: '境内史跡',
      qrScanner: 'QRスキャン',
      map: '境内マップ',
      ar: 'AR体験',
      tickets: '拝観予約',
      chatAi: 'AI案内',
      backendCicd: 'BEサービス＆CI/CD'
    },
    audioGuide: {
      play: '解説を再生',
      pause: '一時停止',
      speed: '速度',
      nowPlaying: '解説中',
      stop: '停止',
      listenNarration: '音声解説を聞く',
      readTranscript: '解説テキスト',
      voiceSettings: '音声設定'
    },
    scanner: {
      title: '境内のQRコードをスキャン',
      scannerSubtitle: '史跡識別QRコードスキャン',
      instruction: '仏像や大雄宝殿前のQRコードにカメラを向けると、自動で音声解説が始まります。',
      simulatedTitle: '体験・テストモード',
      simulatedDesc: '下の史跡カードをクリックして、境内でのQRコード読み取りを即座にシミュレートできます：',
      scanNow: 'スキャナーカメラを起動',
      cameraError: 'カメラを起動できません。設定を確認するか下のカードでお試しください。',
      cameraOff: 'カメラがオフまたは利用できません',
      restartCamera: 'カメラを再起動',
      cameraPermission: 'カメラへのアクセス許可が必要です',
      scanSuccess: 'QRコードを正常に読み取りました！',
      scanningStatus: 'QRコードをスキャン中...',
      liveCamera: 'ライブカメラ',
      flashTitle: 'フラッシュ切替',
      scannedCodeBadge: 'スキャン完了コード',
      listenNow: '今すぐ聴く',
      manualInputPlaceholder: '史跡コードを入力 (例: LU-QUANAM-01)...',
      manualSubmit: '入力'
    },
    map: {
      title: '境内インタラクティブマップ＆迷子防止ナビ',
      antiLostTitle: 'スマート道案内エンジン',
      antiLostDesc: '広大な境内で最適なルートを算出し、滑りやすい階段の注意箇所をお知らせします。',
      findRoute: 'ルート検索',
      fromLabel: '出発地',
      toLabel: '目的地',
      startRouting: '道案内を開始',
      itineraryTitle: 'おすすめ参拝コース',
      distance: '距離',
      duration: '徒歩所要時間',
      safeZoneStatus: 'GPS追跡中：霊応寺セーフゾーン',
      itineraryOptimal: '（最適ルート選択）',
      tapToActivate: 'タップして案内を開始',
      selectTour: 'ツアー選択',
      inProgress: '移動中',
      pointsCount: '箇所',
      compassNorth: 'ソンチャ北方 (350° N)',
      resetPositionTitle: '三門スタート地点に位置をリセット',
      resetPositionBtn: '出発点へ戻る',
      youAreHere: '現在地',
      clickPoiHint: '*地図上の仏像アイコンをクリックして案内を開始',
      routeTo: '目的地へのルート：',
      antiLostGuideTitle: '迷子防止ステップナビゲーション',
      walkingMinutes: '分（徒歩）',
      distanceLabel: '距離：',
      timeLabel: '所要時間：~',
      listenDestinationBtn: 'この目的地の音声解説を聴く',
      legend: {
        poi: '史跡・仏像',
        user: '現在地',
        buggy: '電気カート乗り場',
        restroom: 'お手洗い',
        shadedRest: '木陰の休憩所'
      }
    },
    ar: {
      title: '拡張現実（AR）没入体験',
      subtitle: 'スマホカメラを通して現れる観音様の蓮華後光と歴史ロマン',
      cameraFeed: 'ARライブカメラ',
      haloEffect: '観音様の蓮華後光',
      historicalSlider: '建立タイムライン',
      facingDirection: 'コンパス方位',
      distanceAway: '現在地からの距離',
      blessingParticles: '蓮の花吹雪',
      toggleCamera: '実際のカメラに切替',
      arTitleFull: '拡張現実（AR）神聖空間',
      arHeadingEast: '東（東シナ海）',
      arHeadingNorth: '北（ソンチャ山）',
      turnCameraOff: 'カメラOFF',
      turnCameraOn: 'カメラON',
      elevationText: 'メートル（高低差 +15m）',
      listenArBtn: 'AR音声解説を聴く',
      rotateLeftTitle: '左回転 15°',
      rotateRightTitle: '右回転 15°',
      haloBtn: '蓮華後光',
      particlesBtn: '蓮の花吹雪',
      timelineReconstruction: '（歴史的空間再現）',
      yearLabel: '年',
      milestone2004: '2004年：起工・定礎',
      milestone2010: '2010年：67m観音像落慶',
      milestonePresent: '現在：完全なる仏教伽藍',
      period2004Text: '2004年：自然豊かなバイブットの地で建設が始動。故ティク・ティエン・グエン僧正の指導のもと、ノンヌオック村から大量の白大理石が運び込まれました。',
      period2010Text: '2010年：高さ67mの観世音菩薩像と大雄宝殿の落慶法要を挙行。国内外から数万人の参拝者が集い、大海原に向かい平和を祈念しました。',
      periodPresentText: '現在：ベトナム中部屈指の聖地。ダナンの漁民の安全を見守り、世界中から年間数百万人もの参拝客を迎えています。'
    },
    booking: {
      title: '参拝・送迎サービス予約',
      subtitle: '霊応寺への入場は無料です。便利な電気カート、舎利塔特別展、黄昏の灯籠流しを事前予約できます。',
      bookNow: '予約する',
      price: '料金',
      visitDate: '参拝予定日',
      fullName: '代表者氏名',
      phone: '電話番号',
      quantity: '枚数',
      total: '合計金額',
      checkout: '決済へ進む',
      payOnline: '安全なオンライン決済',
      selectPayment: '決済方法の選択',
      eTicketTitle: '霊応寺 電子パス',
      eTicketSuccess: '決済が完了しました！電子チケットが発行されました。',
      savePass: 'スマホに保存',
      secureGuarantee: '100% 安全なオンライン決済と即時発券',
      selectPackageTitle: 'サービス＆体験パッケージを選択',
      bookingInfoTitle: '予約情報および決済',
      instantConfirmText: '即時確認および電子チケット発行',
      selectedPackageLabel: '選択中のサービス：',
      perTrip: '/ 回',
      emailLabel: 'チケット受取用メール（任意）',
      processingBooking: '予約を処理中...',
      proceedSecurePay: '安全な決済へ進む',
      onlineGatewayTitle: 'オンライン決済ゲートウェイ',
      orderCodeLabel: '注文番号：',
      amountToPay: 'お支払い合計：',
      bankAppScanHint: 'モバイルバンキングアプリでQRコードを読み取ってお支払いください',
      bankNameLabel: '銀行名：',
      accountNumberLabel: '口座番号：',
      accountNameLabel: '口座名義：',
      transferDescLabel: '振込依頼人名・備考：',
      copiedSuccess: '✓ クリップボードにコピーしました！',
      cardNumLabel: 'クレジットカード / デビットカード番号',
      cardExpLabel: '有効期限 (MM/YY)',
      cardCvvLabel: 'セキュリティコード (CVV)',
      confirmPaidBtn: '支払い完了を確認してチケットを受け取る',
      confirmingProcessing: '決済ゲートウェイに接続しチケットを発行中...',
      eventBusNotice: 'EventBusマイクロサービス経由で1〜3秒以内に自動トランザクション検証が行われます。',
      paymentSuccessBadge: 'お支払い完了',
      checkInCodeLabel: 'チェックインコード：',
      customerLabel: 'お名前：',
      serviceLabel: 'サービス：',
      quantityGuests: '名',
      totalPaidLabel: 'お支払い総額：',
      checkInQrInstruction: '電気カート乗り場または舎利塔入口でこのQRコードをご提示ください。',
      passSavedAlert: '電子チケットが端末に保存されました！',
      closeNotice: '閉じる',
      internationalCard: '国際カード',
      fillInfoAlert: 'お名前とお電話番号を入力してください'
    },
    chat: {
      title: '霊応寺 AIスマート案内',
      welcomeMsg: '南無阿弥陀仏！霊応寺スマート案内です。境内の歴史、67mの観音像、参拝のマナー、開門時間についてお答えします。',
      inputPlaceholder: '開門時間、服装の決まり、仏像の高さ、歴史...',
      send: '送信',
      suggestedQuestions: 'おすすめの質問',
      listening: '回答を作成中...'
    },
    cicd: {
      title: 'バックエンドマイクロサービス＆CI/CD管制',
      subtitle: 'EventBusイベント駆動通信とKubernetesカナリア自動デプロイ。',
      runPipeline: '最新CI/CDパイプラインを実行',
      servicesStatus: '各サービスの稼働状況',
      eventStream: 'サービス間通信ログ（EventBus）',
      activeServices: '稼働中サービス'
    },
    common: {
      mobileFrame: 'スマホ表示',
      fullScreen: '全画面表示',
      close: '閉じる',
      minutes: '分',
      elevation: '標高',
      heading: '方角'
    },
    monumentView: {
      heroBadge: 'ソンチャ半島 霊応寺（リンウン寺）',
      heroTitle: '史跡スマート音声ガイドシステム',
      heroSubtitle: '6ヶ国語対応の自動音声解説、現地QRコードスキャン、没入型3D ARで境内9ヶ所の名所を巡る。',
      searchPlaceholder: '仏像名、QRコード、歴史を検索...',
      categories: {
        all: 'すべて',
        monument: '仏像・彫刻',
        temple: '本堂・諸堂',
        relic: '舎利塔',
        viewpoint: '展望所',
        nature: '自然'
      },
      audioGuideBtn: '音声解説を聞く',
      pauseBtn: '一時停止',
      detailsBtn: '詳細を見る',
      autoVoiceTitle: '自動音声ガイド',
      autoVoiceSubtitle: '所要時間 約{min}分 • 音声言語を下で選択',
      listenNowBtn: '今すぐ再生',
      selectVoiceLangLabel: '音声解説の言語を選択：',
      historyTitle: '歴史と建立の経緯',
      spiritualTitle: '信仰の意義と祈願',
      architectureTitle: '建築様式と彫刻の特徴',
      adviceTitle: '参拝者へのアドバイス：',
      navigateBtn: 'ここへ案内',
      viewArBtn: 'AR 3Dで体験',
      tryQrBtn: 'このQRをテスト'
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
      scannerSubtitle: 'Scanner le QR pour Identifier le Monument',
      instruction: 'Visez les plaques QR situées aux pieds de la statue géante, du sanctuaire ou du stupa pour lancer la narration.',
      simulatedTitle: 'Mode Démonstration & Test',
      simulatedDesc: 'Cliquez sur l\'une des plaques ci-dessous pour simuler le scan instantané sur place :',
      scanNow: 'Activer la Caméra',
      cameraError: 'Caméra indisponible. Vérifiez les permissions ou essayez les cartes ci-dessous.',
      cameraOff: 'La caméra est désactivée ou indisponible',
      restartCamera: 'Redémarrer la caméra',
      cameraPermission: 'Autorisation caméra requise',
      scanSuccess: 'Code QR reconnu avec succès !',
      scanningStatus: 'SCAN DU CODE QR EN COURS...',
      liveCamera: 'CAMÉRA EN DIRECT',
      flashTitle: 'Activer le flash',
      scannedCodeBadge: 'Code scanné',
      listenNow: 'Écouter',
      manualInputPlaceholder: 'Entrer le code QR (ex : LU-QUANAM-01)...',
      manualSubmit: 'Valider'
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
      safeZoneStatus: 'Suivi GPS actif : Zone sécurisée de Linh Ung',
      itineraryOptimal: '(Sélection d\'itinéraire optimal)',
      tapToActivate: 'Appuyez pour activer le guidage',
      selectTour: 'Choisir le tour',
      inProgress: 'En cours',
      pointsCount: 'sites',
      compassNorth: 'Nord Son Tra (350° N)',
      resetPositionTitle: 'Replacer au point de départ (Porte Tam Quan)',
      resetPositionBtn: 'Retour au départ',
      youAreHere: 'Vous êtes ici',
      clickPoiHint: '*Cliquez sur un monument pour lancer le guidage',
      routeTo: 'Itinéraire vers',
      antiLostGuideTitle: 'Guidage étape par étape',
      walkingMinutes: 'min à pied',
      distanceLabel: 'Distance :',
      timeLabel: 'Temps estimé : ~',
      listenDestinationBtn: 'Écouter l\'audioguide de ce site',
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
      toggleCamera: 'Basculer Caméra Réelle',
      arTitleFull: 'Espace Spirituel en Réalité Augmentée (AR)',
      arHeadingEast: 'EST (Mer Orientale)',
      arHeadingNorth: 'NORD (Mont Son Tra)',
      turnCameraOff: 'Couper caméra',
      turnCameraOn: 'Activer caméra',
      elevationText: 'mètres (Pente +15m)',
      listenArBtn: 'Écouter l\'audio AR',
      rotateLeftTitle: 'Tourner à gauche 15°',
      rotateRightTitle: 'Tourner à droite 15°',
      haloBtn: 'Aura de lotus',
      particlesBtn: 'Pétales de lotus',
      timelineReconstruction: '(Reconstitution historique)',
      yearLabel: 'Année',
      milestone2004: '2004 : Pose de la première pierre',
      milestone2010: '2010 : Inauguration statue 67m',
      milestonePresent: 'Présent : Complexe majestueux',
      period2004Text: 'Phase 2004 : Début des travaux sur la falaise de Bai But. Des milliers de blocs de marbre blanc acheminés sous la direction du vénérable Thich Thien Nguyen.',
      period2010Text: 'Phase 2010 : Grande inauguration de la statue de 67m et du sanctuaire principal devant des dizaines de milliers de pèlerins.',
      periodPresentText: 'De nos jours : Symbole spirituel majeur protégeant les marins de Da Nang et accueillant des millions de visiteurs du monde entier.'
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
      savePass: 'Enregistrer le pass',
      secureGuarantee: 'Paiement en ligne 100% sécurisé',
      selectPackageTitle: 'Sélectionner un pass ou service',
      bookingInfoTitle: 'Informations de réservation',
      instantConfirmText: 'Confirmation immédiate et e-billet',
      selectedPackageLabel: 'Service sélectionné :',
      perTrip: '/ pass',
      emailLabel: 'Email pour réception du billet (optionnel)',
      processingBooking: 'Traitement en cours...',
      proceedSecurePay: 'Procéder au paiement sécurisé',
      onlineGatewayTitle: 'Portail de paiement en ligne',
      orderCodeLabel: 'Réf. commande :',
      amountToPay: 'Montant à régler :',
      bankAppScanHint: 'Ouvrez votre application bancaire mobile pour scanner ce code QR',
      bankNameLabel: 'Banque :',
      accountNumberLabel: 'Numéro de compte :',
      accountNameLabel: 'Titulaire du compte :',
      transferDescLabel: 'Référence de virement :',
      copiedSuccess: '✓ Copié dans le presse-papiers !',
      cardNumLabel: 'Numéro de carte de crédit / débit',
      cardExpLabel: 'Date d\'expiration (MM/AA)',
      cardCvvLabel: 'Code de sécurité (CVV)',
      confirmPaidBtn: 'Confirmer le paiement et obtenir le pass',
      confirmingProcessing: 'Connexion à la passerelle bancaire et émission du billet...',
      eventBusNotice: 'Vérification automatique de la transaction en 1 à 3 secondes via microservice EventBus.',
      paymentSuccessBadge: 'PAIEMENT RÉUSSI',
      checkInCodeLabel: 'Code d\'enregistrement :',
      customerLabel: 'Client :',
      serviceLabel: 'Service :',
      quantityGuests: 'personnes',
      totalPaidLabel: 'Total payé :',
      checkInQrInstruction: 'Présentez ce code QR à la navette buggy ou à l\'entrée du stupa pour vous enregistrer.',
      passSavedAlert: 'Le billet électronique a été enregistré sur votre appareil !',
      closeNotice: 'Fermer',
      internationalCard: 'Carte Internationale',
      fillInfoAlert: 'Veuillez renseigner votre nom et votre numéro de téléphone'
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
    },
    common: {
      mobileFrame: 'Vue Mobile',
      fullScreen: 'Plein Écran',
      close: 'Fermer',
      minutes: 'min',
      elevation: 'Altitude',
      heading: 'Cap'
    },
    monumentView: {
      heroBadge: 'Pagode Linh Ung Bai But • Péninsule de Son Tra',
      heroTitle: 'Système d\'Audioguide Patrimonial',
      heroSubtitle: 'Découvrez 9 sites sacrés avec audioguide multilingue automatique (6 langues), scan de QR code sur site et réalité augmentée 3D.',
      searchPlaceholder: 'Rechercher par statue, QR code, histoire...',
      categories: {
        all: 'Tous',
        monument: 'Monuments',
        temple: 'Sanctuaires',
        relic: 'Stupas',
        viewpoint: 'Points de vue',
        nature: 'Nature'
      },
      audioGuideBtn: 'Écouter le guide',
      pauseBtn: 'Pause',
      detailsBtn: 'Détails',
      autoVoiceTitle: 'Narration Vocale Automatique',
      autoVoiceSubtitle: 'Durée ~{min} min • Sélectionnez la langue ci-dessous',
      listenNowBtn: 'Écouter maintenant',
      selectVoiceLangLabel: 'Choisir la langue de narration vocale :',
      historyTitle: 'Histoire et Construction',
      spiritualTitle: 'Signification Spirituelle et Vœux',
      architectureTitle: 'Architecture et Sculptures',
      adviceTitle: 'Conseils aux visiteurs :',
      navigateBtn: 'Y aller',
      viewArBtn: 'Voir en RA 3D',
      tryQrBtn: 'Tester ce QR'
    }
  }
};
