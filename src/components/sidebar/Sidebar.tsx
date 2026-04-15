import { useState, useMemo } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useSettingsStore } from '../../store/settingsStore';
import { searchChats } from '../../utils/storage';
import { IconLogo, IconSidebar, IconPlus, IconSettings } from '../../assets/icons';
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
            <IconLogo />
            <span className={styles.logoText}>AI Chat</span>
          </div>

          <button
            className={styles.closeSidebar}
            onClick={onToggle}
            aria-label="Свернуть боковую панель"
          >
            <IconSidebar />
          </button>
        </div>

        <div className={styles.sidebarNewChat}>
          <Button
            variant="primary"
            size="md"
            onClick={handleNewChat}
            className={styles.newChatButton}
            icon={<IconPlus />}
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
            <IconSettings />
            Настройки
          </button>
        </div>
      </aside>
    </>
  );
}
