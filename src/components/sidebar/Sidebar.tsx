import { useState, useMemo } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useSettingsStore } from '../../store/settingsStore';
import { searchChats } from '../../utils/storage';
import { SearchInput } from './SearchInput';
import { ChatList } from './ChatList';
import { Button } from '../ui/Button';
import styles from './sidebar.module.css';

interface SidebarProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function Sidebar({ isVisible, onToggle }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const chats = useChatStore((s) => s.chats);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const createChat = useChatStore((s) => s.createChat);
  const switchChat = useChatStore((s) => s.switchChat);
  const renameChat = useChatStore((s) => s.renameChat);
  const deleteChat = useChatStore((s) => s.deleteChat);
  const openSettings = useSettingsStore((s) => s.openSettings);

  const filteredChats = useMemo(
    () => searchChats(chats, searchQuery),
    [chats, searchQuery],
  );

  const handleNewChat = () => {
    createChat();
  };

  const handleSelect = (id: string) => {
    switchChat(id);
  };

  const sidebarClasses = [
    styles.sidebar,
    isVisible ? styles.sidebarOpen : styles.sidebarHidden,
  ].join(' ');

  return (
    <>
      {isVisible && <div className={styles.overlay} onClick={onToggle} />}
      <aside className={sidebarClasses}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.logoText}>AI Chat</span>
          </div>

          <button
            className={styles.closeSidebar}
            onClick={onToggle}
            aria-label="Свернуть боковую панель"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        </div>

        <div className={styles.sidebarNewChat}>
          <Button
            variant="primary"
            size="md"
            onClick={handleNewChat}
            className={styles.newChatButton}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
          >
            Новый чат
          </Button>
        </div>

        <SearchInput value={searchQuery} onChange={setSearchQuery} />

        <ChatList
          chats={filteredChats}
          activeChatId={activeChatId}
          onSelect={handleSelect}
          onRename={renameChat}
          onDelete={deleteChat}
        />

        <div className={styles.sidebarFooter}>
          <button className={styles.settingsButton} onClick={openSettings}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Настройки
          </button>
        </div>
      </aside>
    </>
  );
}
