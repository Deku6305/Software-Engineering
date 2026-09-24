import { useState, useEffect, useRef, useCallback } from 'react';
import { MonumentPoiData, SupportedLanguage } from '../types/index.ts';

export function useSpeechAudio(initialLang: SupportedLanguage = 'vi') {
  const [currentPoi, setCurrentPoi] = useState<MonumentPoiData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [progress, setProgress] = useState(0); // 0 - 100
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(120);
  const [narrationLang, setNarrationLang] = useState<SupportedLanguage>(initialLang);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Audio HTML5 stream element for native authentic pronunciation
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<any>(null);

  // Sync initial lang if passed
  useEffect(() => {
    setNarrationLang(initialLang);
  }, [initialLang]);

  // Load voices for Web Speech fallback
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setCurrentTimeSec(Math.floor(audio.currentTime));
        setDurationSec(Math.ceil(audio.duration));
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentTimeSec(0);
  }, []);

  const pauseAudio = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const startFallbackTimer = (targetDuration: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentTimeSec((prev) => {
        const next = prev + 1;
        if (next >= targetDuration) {
          stopAudio();
          return targetDuration;
        }
        setProgress((next / targetDuration) * 100);
        return next;
      });
    }, 1000);
  };

  const playPoiAudio = useCallback(
    (poi: MonumentPoiData, customText?: string, explicitLang?: SupportedLanguage) => {
      stopAudio();
      setCurrentPoi(poi);

      const activeLanguage = explicitLang || (poi.currentLanguage as SupportedLanguage) || narrationLang || 'vi';
      setNarrationLang(activeLanguage);

      const fullText = customText || `${poi.name}. ${poi.brief}. ${poi.fullHistory}. ${poi.spiritualMeaning}`;
      const defaultDuration = poi.audioDurationSeconds || 90;
      setDurationSec(defaultDuration);
      setCurrentTimeSec(0);
      setProgress(0);

      // 1. Primary Engine: High-fidelity Native Audio Stream from /api/tts
      // This guarantees authentic Vietnamese tones, accents and pronunciation for Vietnamese,
      // as well as native English, Chinese, Korean, Japanese, and French.
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }

        const audio = audioRef.current;
        // Limit text length to prevent URL overflow while giving full, comprehensive narration
        const snippet = fullText.slice(0, 600);
        const streamUrl = `/api/tts?lang=${encodeURIComponent(activeLanguage)}&text=${encodeURIComponent(snippet)}`;

        audio.src = streamUrl;
        audio.playbackRate = playbackSpeed;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((playErr) => {
              console.warn('Native HTML5 audio stream autoplay blocked, falling back to Web Speech:', playErr);
              // Fallback to browser SpeechSynthesis
              fallbackToWebSpeech(fullText, activeLanguage, defaultDuration);
            });
        }
      } catch (err) {
        console.warn('Audio streaming initialization failed, fallback to Web Speech:', err);
        fallbackToWebSpeech(fullText, activeLanguage, defaultDuration);
      }
    },
    [playbackSpeed, narrationLang, stopAudio]
  );

  const fallbackToWebSpeech = (text: string, activeLanguage: SupportedLanguage, defaultDuration: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(true);
      startFallbackTimer(defaultDuration);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;

      const langMap: Record<SupportedLanguage, string> = {
        vi: 'vi-VN',
        en: 'en-US',
        zh: 'zh-CN',
        ko: 'ko-KR',
        ja: 'ja-JP',
        fr: 'fr-FR'
      };
      const targetLocale = langMap[activeLanguage] || 'vi-VN';
      utterance.lang = targetLocale;

      // Dynamically query latest voices
      const allVoices = window.speechSynthesis.getVoices();
      let matchedVoice: SpeechSynthesisVoice | undefined;

      if (activeLanguage === 'vi') {
        // Specific search for Vietnamese voices only
        matchedVoice = allVoices.find(
          (v) =>
            v.lang.toLowerCase().includes('vi') ||
            v.lang.toLowerCase().includes('vn') ||
            v.name.toLowerCase().includes('viet') ||
            v.name.toLowerCase().includes('tiếng việt') ||
            v.name.toLowerCase().includes('hoaimy') ||
            v.name.toLowerCase().includes('namminh') ||
            v.name.toLowerCase().includes('an') ||
            v.name.toLowerCase().includes('linh') ||
            v.name.toLowerCase().includes('mai')
        );
      } else {
        matchedVoice = allVoices.find((v) =>
          v.lang.toLowerCase().startsWith(targetLocale.substring(0, 2).toLowerCase())
        );
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        setSelectedVoice(matchedVoice);
      } else if (activeLanguage === 'vi') {
        // CRITICAL FIX: If no Vietnamese voice is available locally on the user's OS,
        // do NOT let it fallback to the default English voice (which mispronounces Vietnamese horribly).
        // The HTML5 audio player already handles native audio via /api/tts.
        console.warn('No local Vietnamese voice pack found in OS. Relying on native /api/tts stream.');
      }

      utterance.onend = () => {
        stopAudio();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      startFallbackTimer(defaultDuration);
    } catch (err) {
      console.warn('Fallback SpeechSynthesis failed:', err);
      setIsPlaying(true);
      startFallbackTimer(defaultDuration);
    }
  };

  const resumeAudio = useCallback(() => {
    if (audioRef.current && audioRef.current.src && audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          if (currentPoi) playPoiAudio(currentPoi, undefined, narrationLang);
        });
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    } else if (currentPoi) {
      playPoiAudio(currentPoi, undefined, narrationLang);
    }
  }, [currentPoi, narrationLang, playPoiAudio]);

  const setSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    if (utteranceRef.current && isPlaying && currentPoi) {
      playPoiAudio(currentPoi, undefined, narrationLang);
    }
  };

  const seekTo = (percent: number) => {
    const targetSec = Math.round((percent / 100) * durationSec);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (percent / 100) * audioRef.current.duration;
    }
    setCurrentTimeSec(targetSec);
    setProgress(percent);
  };

  return {
    currentPoi,
    isPlaying,
    playbackSpeed,
    progress,
    currentTimeSec,
    durationSec,
    narrationLang,
    setNarrationLang,
    playPoiAudio,
    stopAudio,
    pauseAudio,
    resumeAudio,
    setSpeed,
    seekTo,
    availableVoices,
    selectedVoice
  };
}
