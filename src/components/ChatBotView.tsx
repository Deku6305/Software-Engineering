import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage } from '../types/index.ts';
import { TRANSLATIONS } from '../data/translations.ts';
import { apiClient } from '../services/apiClient.ts';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  User,
  HelpCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

interface ChatBotViewProps {
  currentLang: SupportedLanguage;
  onSpeakText: (text: string) => void;
}

export const ChatBotView: React.FC<ChatBotViewProps> = ({
  currentLang,
  onSpeakText,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: t.chat.welcomeMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'domain-knowledge-base',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    'Giờ mở cửa và giá vé vào cổng?',
    'Quy định trang phục khi vào Chánh Điện?',
    'Tượng Quan Âm cao bao nhiêu mét?',
    'Lưu ý gì về khỉ hoang dã Sơn Trà?',
    'Hướng dẫn đường đi từ trung tâm Đà Nẵng?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await apiClient.sendChatMessage(text, history, currentLang);

      const assistantMessage: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: 'Xin thứ lỗi, kết nối tới máy chủ AI đang bận. Bạn vui lòng thử lại sau giây lát ạ!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-stone-900 border border-amber-900/50 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-2xl">
              🪷
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-amber-100 font-serif-sacred">
                {t.chat.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Giải đáp văn hóa Phật giáo, lịch sử di tích & chỉ dẫn tham quan 24/7
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: `msg_welcome_${Date.now()}`,
                role: 'assistant',
                content: t.chat.welcomeMsg,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }}
          className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 hover:text-amber-300 transition-colors"
          title="Tạo hội thoại mới"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Inquiry Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          {t.chat.suggestedQuestions}:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-850 text-xs text-stone-300 hover:text-amber-200 whitespace-nowrap transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="h-[460px] rounded-3xl bg-stone-950 border border-amber-900/40 p-4 sm:p-5 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  isUser
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-900 border border-amber-500/40 text-amber-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <span>🪷</span>}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 space-y-1.5 ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-medium rounded-tr-none shadow-md'
                    : 'bg-stone-900/90 border border-stone-800 text-stone-200 rounded-tl-none shadow-lg'
                }`}
              >
                <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                  {msg.content}
                </div>

                <div className="flex items-center justify-between gap-3 text-[10px] text-stone-400 pt-1">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => onSpeakText(msg.content)}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
                      title="Đọc câu trả lời bằng giọng nói"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Đọc to</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-stone-400 text-xs italic p-2">
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Trợ lý AI đang tra cứu kinh sách và lịch sử chùa...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-stone-900 border border-amber-900/50 shadow-xl">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={t.chat.inputPlaceholder}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold transition-all shadow-md shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
