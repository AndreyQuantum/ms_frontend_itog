import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '../store/settingsStore';
import { DEFAULT_SETTINGS } from '../types';

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      settings: { ...DEFAULT_SETTINGS },
      isSettingsOpen: false,
    });
  });

  it('has correct default settings', () => {
    const { settings } = useSettingsStore.getState();

    expect(settings.model).toBe('gemini-3-flash-preview');
    expect(settings.temperature).toBe(0.7);
    expect(settings.topP).toBe(0.95);
    expect(settings.topK).toBe(40);
    expect(settings.maxTokens).toBe(8192);
    expect(settings.systemPrompt).toBe('');
    expect(settings.apiKey).toBe('');
  });

  it('updates apiKey', () => {
    useSettingsStore.getState().updateSettings({ apiKey: 'new-key' });
    expect(useSettingsStore.getState().settings.apiKey).toBe('new-key');
  });

  it('updates partial settings', () => {
    useSettingsStore.getState().updateSettings({ temperature: 1.5 });

    const { settings } = useSettingsStore.getState();
    expect(settings.temperature).toBe(1.5);
    expect(settings.model).toBe('gemini-3-flash-preview');
  });

  it('updates multiple settings at once', () => {
    useSettingsStore.getState().updateSettings({
      model: 'gemini-1.5-pro',
      maxTokens: 4096,
      systemPrompt: 'Be concise',
    });

    const { settings } = useSettingsStore.getState();
    expect(settings.model).toBe('gemini-1.5-pro');
    expect(settings.maxTokens).toBe(4096);
    expect(settings.systemPrompt).toBe('Be concise');
  });

  it('resets to defaults', () => {
    useSettingsStore.getState().updateSettings({
      temperature: 2.0,
      model: 'gemini-1.5-pro',
    });

    useSettingsStore.getState().resetSettings();

    expect(useSettingsStore.getState().settings).toEqual(DEFAULT_SETTINGS);
  });

  it('opens and closes settings panel', () => {
    expect(useSettingsStore.getState().isSettingsOpen).toBe(false);

    useSettingsStore.getState().openSettings();
    expect(useSettingsStore.getState().isSettingsOpen).toBe(true);

    useSettingsStore.getState().closeSettings();
    expect(useSettingsStore.getState().isSettingsOpen).toBe(false);
  });
});
