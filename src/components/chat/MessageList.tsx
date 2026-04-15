import type { Message as MessageType } from '../../types';
import { IconLogoLarge, IconArrowRight } from '../../assets/icons';
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
  const { containerRef, handleScroll } = useAutoScroll([messages.length, isStreaming, messages]);

  if (messages.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <IconLogoLarge />
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
              <IconArrowRight />
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
