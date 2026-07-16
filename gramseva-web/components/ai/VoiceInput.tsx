'use client';

/**
 * ==========================================================
 * AI MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceInputProps {
  onResult: (text: string) => void;
  disabled?: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

function getRecognition(): SpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) return null;
  return new SpeechRecognitionClass();
}

export default function VoiceInput({ onResult, disabled = false }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!isSupported) return;
    recognitionRef.current = getRecognition();
    return () => { recognitionRef.current?.abort(); recognitionRef.current = null; };
  }, [isSupported]);

  const handleStart = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec || isListening) return;

    rec.lang = 'hi-IN';
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let final = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interimText += transcript;
        }
      }
      setInterim(interimText);
      if (final) {
        onResult(final);
        setInterim('');
      }
    };

    rec.onerror = () => {
      setIsListening(false);
      setInterim('');
    };

    rec.onend = () => {
      setIsListening(false);
      setInterim('');
    };

    try {
      rec.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }, [isListening, onResult]);

  const handleStop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterim('');
  }, []);

  if (!isSupported) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={isListening ? handleStop : handleStart}
        disabled={disabled}
        className={`p-2.5 rounded-xl transition-all ${
          isListening
            ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        } disabled:opacity-40`}
        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        aria-pressed={isListening}
      >
        <span className="text-lg" aria-hidden="true">{isListening ? '⏹' : '🎤'}</span>
      </button>
      {isListening && interim && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap max-w-[200px] truncate" role="status" aria-live="polite">
          {interim}
        </div>
      )}
    </div>
  );
}
