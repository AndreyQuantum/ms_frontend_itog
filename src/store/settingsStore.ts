import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModelSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

interface SettingsState {
  settings: ModelSettings;
  isSettingsOpen: boolean;
  updateSettings: (partial: Partial<ModelSettings>) => void;
  resetSettings: () => void;
  toggleSettings: () => void;
  openSettings: () => void;
  closeSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: { ...DEFAULT_SETTINGS },
      isSettingsOpen: false,

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      resetSettings: () =>
        set({ settings: { ...DEFAULT_SETTINGS } }),

      toggleSettings: () =>
        set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),

      openSettings: () => set({ isSettingsOpen: true }),
      closeSettings: () => set({ isSettingsOpen: false }),
    }),
    {
      name: 'gemini-chat-settings',
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);
