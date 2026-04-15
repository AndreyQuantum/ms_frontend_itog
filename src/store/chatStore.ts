import { create } from 'zustand';
import type { Chat, Message } from '../types';
import { loadChats, saveChats } from '../utils/storage';

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isStreaming: boolean;
  isLoading: boolean;
  streamingContent: string;
  error: string | null;

  // Computed
  activeChat: () => Chat | undefined;

  // Actions
  createChat: () => string;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  switchChat: (id: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateLastAssistantMessage: (chatId: string, content: string) => void;
  setStreamingContent: (content: string) => void;
  setIsStreaming: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function persist(chats: Chat[]) {
  saveChats(chats);
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: loadChats(),
  activeChatId: loadChats()[0]?.id ?? null,
  isStreaming: false,
  isLoading: false,
  streamingContent: '',
  error: null,

  activeChat: () => {
    const { chats, activeChatId } = get();
    return chats.find((c) => c.id === activeChatId);
  },

  createChat: () => {
    const id = generateId();
    const now = Date.now();
    const newChat: Chat = {
      id,
      title: 'Новый чат',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    set((state) => {
      const chats = [newChat, ...state.chats];
      persist(chats);
      return { chats, activeChatId: id, error: null };
    });

    return id;
  },

  deleteChat: (id) => {
    set((state) => {
      const chats = state.chats.filter((c) => c.id !== id);
      persist(chats);

      const activeChatId =
        state.activeChatId === id
          ? chats[0]?.id ?? null
          : state.activeChatId;

      return { chats, activeChatId };
    });
  },

  renameChat: (id, title) => {
    set((state) => {
      const chats = state.chats.map((c) =>
        c.id === id ? { ...c, title, updatedAt: Date.now() } : c,
      );
      persist(chats);
      return { chats };
    });
  },

  switchChat: (id) => {
    set({ activeChatId: id, error: null, streamingContent: '' });
  },

  addMessage: (chatId, message) => {
    set((state) => {
      const chats = state.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [...c.messages, message],
              updatedAt: Date.now(),
            }
          : c,
      );
      persist(chats);
      return { chats };
    });
  },

  updateLastAssistantMessage: (chatId, content) => {
    set((state) => {
      const chats = state.chats.map((chat) => {
        if (chat.id !== chatId) return chat;

        const messages = [...chat.messages];
        const lastIdx = messages.length - 1;
        if (lastIdx >= 0 && messages[lastIdx].role === 'assistant') {
          messages[lastIdx] = { ...messages[lastIdx], content };
        }
        return { ...chat, messages, updatedAt: Date.now() };
      });
      persist(chats);
      return { chats };
    });
  },

  setStreamingContent: (content) => set({ streamingContent: content }),
  setIsStreaming: (value) => set({ isStreaming: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
