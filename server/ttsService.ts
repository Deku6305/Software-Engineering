import { eventBus } from './eventBus.ts';

interface CacheEntry {
  buffer: Buffer;
  contentType: string;
  createdAt: number;
}

class TtsService {
  private cache: Map<string, CacheEntry> = new Map();
  private maxCacheEntries = 100;

  // Split text into chunks safe for TTS engine (< 160 characters, breaking at sentence or space)
  private splitTextIntoChunks(text: string, maxChunkLength = 160): string[] {
    const cleanText = text.replace(/[\r\n]+/g, ' ').trim();
    if (!cleanText) return [];

    // Break by punctuation first
    const rawSegments = cleanText.split(/([.,!?;]+)/);
    const sentences: string[] = [];
    let current = '';

    for (let i = 0; i < rawSegments.length; i++) {
      current += rawSegments[i];
      if (current.length >= 80 || i === rawSegments.length - 1) {
        sentences.push(current.trim());
        current = '';
      }
    }
    if (current.trim()) sentences.push(current.trim());

    // Further split if any sentence is too long
    const finalChunks: string[] = [];
    for (const sentence of sentences) {
      if (sentence.length <= maxChunkLength) {
        if (sentence.trim()) finalChunks.push(sentence.trim());
      } else {
        const words = sentence.split(' ');
        let tempChunk = '';
        for (const word of words) {
          if ((tempChunk + ' ' + word).trim().length > maxChunkLength) {
            if (tempChunk.trim()) finalChunks.push(tempChunk.trim());
            tempChunk = word;
          } else {
            tempChunk = tempChunk ? `${tempChunk} ${word}` : word;
          }
        }
        if (tempChunk.trim()) finalChunks.push(tempChunk.trim());
      }
    }

    return finalChunks.filter(c => c.length > 0);
  }

  public async getAudioBuffer(text: string, lang = 'vi'): Promise<Buffer> {
    const targetLang = lang.toLowerCase().slice(0, 2);
    const cacheKey = `${targetLang}:${text.trim()}`;

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached.buffer;
    }

    // Map to standard TTS language codes
    const langCodeMap: Record<string, string> = {
      vi: 'vi',
      en: 'en',
      zh: 'zh-CN',
      ko: 'ko',
      ja: 'ja',
      fr: 'fr'
    };
    const ttsLang = langCodeMap[targetLang] || 'vi';

    // Break into readable segments
    // For audio guides, read up to first 4 meaningful sentences to keep audio responsive and snappy
    const chunks = this.splitTextIntoChunks(text).slice(0, 6);
    if (chunks.length === 0) {
      chunks.push('Chùa Linh Ứng Bãi Bụt Sơn Trà Đà Nẵng');
    }

    const buffers: Buffer[] = [];

    for (const chunk of chunks) {
      try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        if (res.ok) {
          const arrBuf = await res.arrayBuffer();
          buffers.push(Buffer.from(arrBuf));
        }
      } catch (err) {
        console.warn(`TTS fetch failed for chunk: "${chunk}"`, err);
      }
    }

    if (buffers.length === 0) {
      throw new Error('Không thể khởi tạo luồng âm thanh thuyết minh');
    }

    const combined = Buffer.concat(buffers);

    // Evict old cache if full
    if (this.cache.size >= this.maxCacheEntries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(cacheKey, {
      buffer: combined,
      contentType: 'audio/mpeg',
      createdAt: Date.now()
    });

    eventBus.publish('TtsService', 'TTS_AUDIO_GENERATED', {
      lang: ttsLang,
      textLength: text.length,
      bytes: combined.length
    }, { targetService: 'ClientAudioPlayer' });

    return combined;
  }
}

export const ttsService = new TtsService();
