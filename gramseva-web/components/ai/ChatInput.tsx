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

/**
 * ChatInput — multiline input with voice, file upload, Enter-to-send.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { AI_MAX_MESSAGE_LENGTH } from '@/lib/constants/api';
import type { FileAttachment } from '@/lib/ai/types';
import VoiceInput from './VoiceInput';
import FileUpload from './FileUpload';

interface ChatInputProps {
  onSend: (message: string, attachments?: FileAttachment[]) => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, onStop, disabled = false, isStreaming = false, placeholder = 'Type your message...' }: ChatInputProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = text.length;
  const isOverLimit = charCount > AI_MAX_MESSAGE_LENGTH;
  const canSend = text.trim().length > 0 && !disabled && !isOverLimit;

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, []);

  useEffect(() => { adjustHeight(); }, [text, adjustHeight]);

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(text.trim(), attachments.length > 0 ? attachments : undefined);
    setText('');
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [canSend, text, attachments, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleVoiceResult = useCallback((transcript: string) => {
    setText((prev) => (prev ? prev + ' ' + transcript : transcript));
  }, []);

  return (
    <div className="border-t border-gray-100 bg-white p-3">
      {attachments.length > 0 && (
        <div className="mb-2">
          <FileUpload attachments={attachments} onChange={setAttachments} />
        </div>
      )}
      <div className="flex items-end gap-2">
        <VoiceInput onResult={handleVoiceResult} disabled={disabled} />
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          maxLength={AI_MAX_MESSAGE_LENGTH + 100}
          className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 outline-none focus:border-[#3949AB] focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-50"
          aria-label="Chat message input"
          aria-describedby="char-count"
        />
        <FileUpload attachments={[]} onChange={(newFiles) => setAttachments((prev) => [...prev, ...newFiles])} maxFiles={5} />
        {isStreaming && onStop ? (
          <button type="button" onClick={onStop} className="px-4 py-3 rounded-xl text-white font-semibold text-sm bg-red-500 hover:bg-red-600 transition-all flex-shrink-0" aria-label="Stop generation">
            <span aria-hidden="true">⏹</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="px-4 py-3 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#1A237E] to-[#3949AB] hover:from-[#0D1B5E] hover:to-[#283593] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send message"
          >
            {disabled ? (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </span>
            ) : (
              <span aria-hidden="true">➤</span>
            )}
          </button>
        )}
      </div>
      <div className="flex justify-end mt-1">
        <span id="char-count" className={`text-[10px] ${isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400'}`} aria-live="polite">
          {charCount}/{AI_MAX_MESSAGE_LENGTH}
        </span>
      </div>
    </div>
  );
}
