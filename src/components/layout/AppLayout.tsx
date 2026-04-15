import { useState } from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { SettingsPanel } from '../settings/SettingsPanel';
import styles from './layout.module.css';

export function AppLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className={styles.layout}>
      <Sidebar
        isVisible={sidebarVisible}
        onToggle={() => setSidebarVisible((v) => !v)}
      />
      <ChatWindow
        sidebarVisible={sidebarVisible}
        onOpenSidebar={() => setSidebarVisible(true)}
      />
      <SettingsPanel />
    </div>
  );
}
