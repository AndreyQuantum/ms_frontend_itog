import { useState, useEffect } from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { SettingsPanel } from '../settings/SettingsPanel';
import { AuthForm } from '../auth/AuthForm';
import { useSettingsStore } from '../../store/settingsStore';
import styles from './layout.module.css';

export function AppLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { settings, updateSettings } = useSettingsStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    
    const handleMediaQueryChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSidebarVisible(e.matches);
    };

    handleMediaQueryChange(mediaQuery);

    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, []);

  if (!settings.apiKey) {
    return <AuthForm onSubmit={(apiKey) => updateSettings({ apiKey })} />;
  }

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
