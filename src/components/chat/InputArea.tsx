import { useState, useRef, useEffect, useCallback } from 'react';
import { IconSend, IconStop } from '../../assets/icons';
import styles from './chat.module.css';

interface InputAreaProps {
  onSend: (content: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  isLoading: boolean;
  disabled?: boolean;
}

export function InputArea({ onSend, onStop, isStreaming, isLoading, disabled }: InputAreaProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || isLoading) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isStreaming && !isLoading && !disabled;

  return (
    <div className={styles.inputArea}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          className={styles.inputTextarea}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напишите сообщение…"
          rows={1}
          disabled={disabled}
          id="chat-input"
        />

        {isStreaming ? (
          <button
            className={styles.stopButton}
            onClick={onStop}
            aria-label="Остановить генерацию"
            title="Остановить"
          >
            <IconStop />
          </button>
        ) : (
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Отправить"
            title="Отправить (Enter)"
          >
            <IconSend />
          </button>
        )}
      </div>
      <p className={styles.inputHint}>
        AI может допускать ошибки. Проверяйте важную информацию.
      </p>
    </div>
  );
}
