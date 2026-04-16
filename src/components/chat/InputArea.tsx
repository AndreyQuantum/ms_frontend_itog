import { useState, useRef, useEffect, useCallback } from 'react';
import { IconSend, IconStop, IconImage, IconClose } from '../../assets/icons';
import type { MessageAttachment } from '../../types';
import styles from './chat.module.css';

interface InputAreaProps {
  onSend: (content: string, attachments?: MessageAttachment[]) => void;
  onStop: () => void;
  isStreaming: boolean;
  isLoading: boolean;
  disabled?: boolean;
}

export function InputArea({ onSend, onStop, isStreaming, isLoading, disabled }: InputAreaProps) {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if ((!trimmed && attachments.length === 0) || isStreaming || isLoading) return;
    onSend(trimmed, attachments.length > 0 ? attachments : undefined);
    setValue('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: MessageAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      const promise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
      });
      reader.readAsDataURL(file);
      const data = await promise;

      newAttachments.push({
        type: file.type,
        data,
      });
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = (value.trim().length > 0 || attachments.length > 0) && !isStreaming && !isLoading && !disabled;

  return (
    <div className={styles.inputArea}>
      {attachments.length > 0 && (
        <div className={styles.attachmentPreview}>
          {attachments.map((att, index) => (
            <div key={index} className={styles.attachmentItem}>
              <img src={att.data} alt="Preview" className={styles.attachmentThumb} />
              <button
                className={styles.attachmentRemove}
                onClick={() => removeAttachment(index)}
                title="Удалить"
              >
                <IconClose />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className={styles.inputWrapper}>
        <button
          className={styles.attachButton}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isStreaming || isLoading}
          title="Прикрепить изображение"
        >
          <IconImage />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
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

        {(isStreaming || isLoading) ? (
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
