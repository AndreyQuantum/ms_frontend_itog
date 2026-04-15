import type { Message as MessageType } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import styles from './chat.module.css';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  isStreaming: boolean;
  onSuggestionClick?: (text: string) => void;
}

const SUGGESTIONS = [
  'Объясни, как работает async/await в JavaScript',
  'Напиши функцию для сортировки массива',
  'Расскажи про паттерн Observer',
  'Как устроена виртуальная DOM в React?',
];

export function MessageList({ messages, isLoading, isStreaming, onSuggestionClick }: MessageListProps) {
  const { containerRef, handleScroll } = useAutoScroll([messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="#8b5cf6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className={styles.emptyTitle}>Чем могу помочь?</h2>
        <p className={styles.emptySubtitle}>
          Задайте вопрос или выберите предложение ниже
        </p>
        <div className={styles.suggestions}>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              className={styles.suggestionCard}
              onClick={() => onSuggestionClick?.(s)}
            >
              <span>{s}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.messageList} ref={containerRef} onScroll={handleScroll}>
      <div className={styles.messageListInner}>
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isLoading && !isStreaming && <TypingIndicator />}
      </div>
    </div>
  );
}
