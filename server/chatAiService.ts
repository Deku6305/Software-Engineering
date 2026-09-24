import { GoogleGenAI } from '@google/genai';
import { eventBus } from './eventBus.ts';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class ChatAiService {
  private ai: GoogleGenAI | null = null;
  private readonly systemInstruction = `
Bạn là "Linh Ứng Trợ Lý Thuyết Minh" (Linh Ung Pagoda Smart Virtual Guide) - sứ giả thông thái, hòa nhã và am hiểu sâu sắc về Chùa Linh Ứng Bãi Bụt (bán đảo Sơn Trà, Đà Nẵng).

Nhiệm vụ của bạn:
1. Thuyết minh, giải đáp cặn kẽ mọi câu hỏi của khách du lịch thập phương và quốc tế về lịch sử, kiến trúc, văn hóa Phật giáo, truyền thuyết và cảnh quan chùa Linh Ứng Sơn Trà.
2. Cung cấp thông tin chuẩn xác:
   - Tượng Phật Bà Quan Thế Âm cao 67m (tương đương tòa nhà 30 tầng), đường kính tòa sen 35m, hoàn thành năm 2010 do Cố Thượng tọa Thích Thiện Nguyện sáng lập. Tượng hướng ra Biển Đông bảo hộ ngư dân. Bên trong tượng có 17 tầng thờ 357 tượng Phật ("Phật trung hữu Phật").
   - Giờ mở cửa: Từ 6:00 sáng đến 21:00 tối hàng ngày. Vào cửa hoàn toàn MIỄN PHÍ.
   - Trang phục & quy tắc tham quan: Ăn mặc kín đáo, lịch sự (quần/váy dài qua đầu gối, áo có tay), cởi bỏ giày dép khi vào Chánh Điện, đi nhẹ nói khẽ, không chỉ tay vào tượng Phật, chỉ thắp tối đa 1 nén nhang ngoài sân để tránh ngột ngạt.
   - Thiên nhiên Sơn Trà: Tuyệt đối không cho khỉ hoang dã hoặc Voọc chà vá chân nâu ăn thức ăn của người để bảo vệ tập tính tự nhiên.
   - Đi lại & tiện ích: Xe điện buggy đưa đón, các góc chụp ảnh đẹp (Cổng Tam Quan, Vọng Cảnh Bãi Bụt lúc hoàng hôn).
3. Luôn giữ phong thái từ tốn, ấm áp, nhã nhặn, tôn trọng và giàu lòng từ bi ("Nam Mô A Di Đà Phật", "Kính chào quý khách").
4. Trả lời đúng theo ngôn ngữ mà người dùng đặt câu hỏi (Tiếng Việt, Tiếng Anh, Tiếng Trung, Tiếng Hàn, Tiếng Nhật, Tiếng Pháp).
5. Trả lời súc tích, định dạng gạch đầu dòng rõ ràng, dễ đọc trên màn hình điện thoại di động.
`;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }

  public async answerUserQuestion(question: string, history: ChatMessage[] = [], lang: string = 'vi'): Promise<{
    reply: string;
    source: 'gemini-3.8-flash' | 'domain-knowledge-base';
  }> {
    const startTime = Date.now();

    // Try Gemini API if key is set
    if (this.ai && process.env.GEMINI_API_KEY) {
      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            ...history.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            })),
            {
              role: 'user',
              parts: [{ text: `[Ngôn ngữ ưu tiên: ${lang}] ${question}` }]
            }
          ],
          config: {
            systemInstruction: this.systemInstruction,
            temperature: 0.7,
            topP: 0.95
          }
        });

        const reply = response.text || this.getSmartFallback(question, lang);
        const latency = Date.now() - startTime;

        eventBus.publish('ChatAiService', 'AI_QUERY_COMPLETED', {
          questionPreview: question.substring(0, 40),
          latencyMs: latency,
          model: 'gemini-3.8-flash'
        }, {
          targetService: 'ClientApp',
          latencyMs: latency
        });

        return {
          reply,
          source: 'gemini-3.8-flash'
        };
      } catch (err) {
        console.error('Gemini API call failed, falling back to built-in knowledge base:', err);
      }
    }

    // Built-in intelligent fallback
    const fallbackReply = this.getSmartFallback(question, lang);
    const latency = Date.now() - startTime;

    eventBus.publish('ChatAiService', 'AI_QUERY_FALLBACK', {
      questionPreview: question.substring(0, 40),
      latencyMs: latency,
      source: 'domain-knowledge-base'
    }, {
      targetService: 'ClientApp',
      latencyMs: latency
    });

    return {
      reply: fallbackReply,
      source: 'domain-knowledge-base'
    };
  }

  private getSmartFallback(q: string, lang: string): string {
    const query = q.toLowerCase();

    if (query.includes('giờ') || query.includes('mở cửa') || query.includes('time') || query.includes('open') || query.includes('시간')) {
      return `🙏 **Giờ Mở Cửa Chùa Linh Ứng Sơn Trà**:
• Chùa mở cửa đón khách từ **06:00 sáng đến 21:00 tối** hàng ngày (kể cả ngày Lễ, Tết).
• **Vé vào cổng**: Hoàn toàn **MIỄN PHÍ**.
• **Khung giờ lý tưởng**: 
  - 06:30 - 08:30: Không khí trong lành, sương mai mát mẻ.
  - 17:00 - 18:30: Ngắm hoàng hôn nhuộm vàng tượng Phật Bà và ngắm trọn vẹn vịnh Đà Nẵng lên đèn.`;
    }

    if (query.includes('áo') || query.includes('quần') || query.includes('mặc') || query.includes('dress') || query.includes('trang phục') || query.includes('복장')) {
      return `🙏 **Quy Định Về Trang Phục & Quy Tắc Tâm Linh**:
• **Trang phục**: Kín đáo, trang nghiêm. Váy/quần cần dài qua đầu gối, áo có tay (tránh áo sát nách, quần đùi hoặc áo khoét sâu).
• **Vào Chánh Điện**: Vui lòng tháo giày dép để bên ngoài kệ đá.
• **Thắp hương**: Nhà chùa khuyến khích mỗi du khách chỉ thắp **1 nén nhang duy nhất** tại lư hương ngoài sân để giữ gìn không khí thanh tịnh và phòng cháy rừng.`;
    }

    if (query.includes('tượng') || query.includes('cao') || query.includes('quán âm') || query.includes('statue') || query.includes('bà quan') || query.includes('lady buddha')) {
      return `🙏 **Thông Tin Tượng Phật Bà Quan Thế Âm 67m**:
• **Chiều cao**: 67 mét (tương đương tòa nhà 30 tầng hiện đại), đường kính tòa sen 35m.
• **Ý nghĩa phong thủy**: Lưng tựa núi Sơn Trà vững chãi, mặt hướng ra Biển Đông bao la để che chở sóng yên biển lặng cho ngư dân miền Trung.
• **Bên trong tượng**: Có 17 tầng tháp, mỗi tầng thờ 21 bức tượng Phật với các tư thế thiền định khác nhau ("Phật trung hữu Phật").
• Trên đỉnh mũ tượng có thêm một pho tượng Phật Thích Ca cao 2m tọa thiền.`;
    }

    if (query.includes('khỉ') || query.includes('voọc') || query.includes('ăn') || query.includes('monkey') || query.includes('thú')) {
      return `🌿 **Lưu Ý Về Động Vật Hoang Dã Sơn Trà**:
• Bán đảo Sơn Trà là ngôi nhà của loài **Voọc chà vá chân nâu** ("nữ hoàng linh trưởng") và đàn khỉ vàng tự nhiên.
• **Khuyến cáo**: 
  - Tuyệt đối **không cho khỉ ăn** bánh kẹo, đồ ăn có đường hay gia vị (làm mất tập tính kiếm ăn tự nhiên và có thể gây xung đột).
  - Giữ khoảng cách an toàn, cẩn thận tư trang cá nhân như điện thoại, kính mắt và túi xách nhỏ.`;
    }

    if (query.includes('xe') || query.includes('đường') || query.includes('đi lại') || query.includes('bus') || query.includes('taxi')) {
      return `🚗 **Hướng Dẫn Đi Lại Đến Chùa Linh Ứng**:
• **Vị trí**: Nằm tại Bãi Bụt, bán đảo Sơn Trà, cách trung tâm thành phố Đà Nẵng khoảng 10km về hướng Đông Bắc.
• **Phương tiện**: 
  - Taxi / Grab: Mất khoảng 15-20 phút di chuyển dọc đường biển Hoàng Sa tuyệt đẹp.
  - Xe máy: Đường nhựa rộng rãi, phong cảnh hữu tình (vui lòng kiểm tra phanh xe cẩn thận).
  - Xe điện buggy tham quan: Có dịch vụ xe buggy điện tại khu vực chân bán đảo đón trả tận nơi.`;
    }

    // Default welcoming response
    return `🙏 **Nam Mô A Di Đà Phật!** 
Chào mừng bạn đến với Chùa Linh Ứng Bãi Bụt - Sơn Trà. Tôi có thể hỗ trợ bạn tìm hiểu về:
1. **Lịch sử & kiến trúc**: Tượng Phật Bà Quan Âm 67m, Chánh Điện, Tháp Xá Lợi 9 tầng, 18 vị La Hán.
2. **Quy tắc tham quan**: Trang phục chuẩn mực, cách hành lễ dâng hương, giờ mở cửa.
3. **Chỉ đường & Tránh lạc**: Lộ trình ngắn nhất di chuyển giữa các điểm di tích.
4. **Dịch vụ**: Đặt vé xe điện buggy tham quan, trải nghiệm thả hoa đăng hoàng hôn.

Bạn muốn tìm hiểu thông tin cụ thể nào ạ?`;
  }
}

export const chatAiService = new ChatAiService();
