import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { useSettingsStore } from '../store/settingsStore';
import { useStreaming } from './useStreaming';
import type { Message } from '../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateTitle(content: string): string {
  const cleaned = content.replace(/\n/g, ' ').trim();
  return cleaned.length > 50 ? `${cleaned.slice(0, 50)}…` : cleaned;
}

export function useChat() {
  const { startStream, stopStream } = useStreaming();
  const settings = useSettingsStore((s) => s.settings);

  const {
    activeChatId,
    isStreaming,
    isLoading,
    streamingContent,
    error,
    chats,
    createChat,
    addMessage,
    updateLastAssistantMessage,
    setStreamingContent,
    setIsStreaming,
    setIsLoading,
    setError,
    clearError,
    renameChat,
  } = useChatStore();

  const activeChat = chats.find((c) => c.id === activeChatId);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming || isLoading) return;

      clearError();

      let chatId = activeChatId;
      if (!chatId) {
        chatId = createChat();
      }

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      addMessage(chatId, userMessage);

      const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
      if (chat && chat.messages.length === 1 && chat.title === 'Новый чат') {
        renameChat(chatId, generateTitle(content));
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };
      addMessage(chatId, assistantMessage);

      setIsLoading(true);
      setIsStreaming(true);
      setStreamingContent('');

      const allMessages = useChatStore
        .getState()
        .chats.find((c) => c.id === chatId)!
        .messages.slice(0, -1);

      await startStream(
        allMessages,
        settings,
        (accumulated) => {
          setStreamingContent(accumulated);
          updateLastAssistantMessage(chatId!, accumulated);
        },
        (finalText) => {
          if (finalText) {
            updateLastAssistantMessage(chatId!, finalText);
          }
          setStreamingContent('');
          setIsStreaming(false);
          setIsLoading(false);
        },
        (errorMsg) => {
          setError(errorMsg);
          setStreamingContent('');
          setIsStreaming(false);
          setIsLoading(false);
        },
      );
    },
    [
      activeChatId,
      isStreaming,
      isLoading,
      settings,
      startStream,
      clearError,
      createChat,
      addMessage,
      renameChat,
      updateLastAssistantMessage,
      setStreamingContent,
      setIsStreaming,
      setIsLoading,
      setError,
    ],
  );

  const handleStopGeneration = useCallback(() => {
    stopStream();
    setIsStreaming(false);
    setIsLoading(false);
  }, [stopStream, setIsStreaming, setIsLoading]);

  return {
    activeChat,
    activeChatId,
    isStreaming,
    isLoading,
    streamingContent,
    error,
    sendMessage,
    stopGeneration: handleStopGeneration,
    clearError,
  };
}
