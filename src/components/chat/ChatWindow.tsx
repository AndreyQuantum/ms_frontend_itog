import { useChat } from '../../hooks/useChat';
import { IconMenu } from '../../assets/icons';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { ErrorMessage } from '../ui/ErrorMessage';
import styles from './chat.module.css';

interface ChatWindowProps {
  sidebarVisible: boolean;
  onOpenSidebar: () => void;
}

export function ChatWindow({ sidebarVisible, onOpenSidebar }: ChatWindowProps) {
  const {
    activeChat,
    isStreaming,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearError,
  } = useChat();

  return (
    <div className={styles.chatWindow}>
      <header className={styles.chatHeader}>
        {!sidebarVisible && (
          <button
            className={styles.menuButton}
            onClick={onOpenSidebar}
            aria-label="Открыть меню"
          >
            <IconMenu />
          </button>
        )}
        <h1 className={styles.chatTitle}>
          {activeChat?.title ?? 'Новый чат'}
        </h1>
        <div className={styles.chatHeaderSpacer} />
      </header>

      <MessageList
        messages={activeChat?.messages ?? []}
        isLoading={isLoading}
        isStreaming={isStreaming}
        onSuggestionClick={sendMessage}
      />

      {error && (
        <div className={styles.errorContainer}>
          <ErrorMessage message={error} onDismiss={clearError} />
        </div>
      )}

      <InputArea
        onSend={sendMessage}
        onStop={stopGeneration}
        isStreaming={isStreaming}
        isLoading={isLoading}
      />
    </div>
  );
}
