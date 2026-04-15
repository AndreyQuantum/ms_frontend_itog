import { useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { IconClose } from '../../assets/icons';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { AVAILABLE_MODELS } from '../../types';
import styles from './settings.module.css';

export function SettingsPanel() {
  const { settings, isSettingsOpen, updateSettings, resetSettings, closeSettings } =
    useSettingsStore();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings();
    };
    if (isSettingsOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSettingsOpen, closeSettings]);

  if (!isSettingsOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeSettings}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Настройки</h2>
          <button className={styles.closeButton} onClick={closeSettings} aria-label="Закрыть">
            <IconClose />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <label className={styles.label} htmlFor="model-select">Модель</label>
            <select
              id="model-select"
              className={styles.select}
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className={styles.section}>
            <Slider
              label="Temperature"
              value={settings.temperature}
              min={0}
              max={2}
              step={0.05}
              onChange={(v) => updateSettings({ temperature: v })}
            />
          </div>

          <div className={styles.section}>
            <Slider
              label="Top P"
              value={settings.topP}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => updateSettings({ topP: v })}
            />
          </div>

          <div className={styles.section}>
            <Slider
              label="Top K"
              value={settings.topK}
              min={1}
              max={100}
              step={1}
              onChange={(v) => updateSettings({ topK: v })}
            />
          </div>

          <div className={styles.section}>
            <Slider
              label="Max Tokens"
              value={settings.maxTokens}
              min={256}
              max={32768}
              step={256}
              onChange={(v) => updateSettings({ maxTokens: v })}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label} htmlFor="system-prompt">
              System Prompt
            </label>
            <textarea
              id="system-prompt"
              className={styles.textarea}
              value={settings.systemPrompt}
              onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
              placeholder="Опишите поведение ассистента…"
              rows={4}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" size="md" onClick={resetSettings}>
            Сбросить
          </Button>
          <Button variant="primary" size="md" onClick={closeSettings}>
            Готово
          </Button>
        </div>
      </div>
    </div>
  );
}
