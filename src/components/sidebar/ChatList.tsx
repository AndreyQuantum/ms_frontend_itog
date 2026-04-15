import type { Chat } from '../../types';
import { ChatItem } from './ChatItem';
import styles from './sidebar.module.css';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function ChatList({ chats, activeChatId, onSelect, onRename, onDelete }: ChatListProps) {
  if (chats.length === 0) {
    return (
      <div className={styles.chatListEmpty}>
        <p>Нет чатов</p>
        <p className={styles.chatListEmptyHint}>Начните новый диалог</p>
      </div>
    );
  }

  return (
    <div className={styles.chatList}>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          id={chat.id}
          title={chat.title}
          isActive={chat.id === activeChatId}
          onSelect={() => onSelect(chat.id)}
          onRename={(title) => onRename(chat.id, title)}
          onDelete={() => onDelete(chat.id)}
        />
      ))}
    </div>
  );
}
