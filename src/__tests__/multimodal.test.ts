import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '../store/chatStore';

describe('multimodal support', () => {
  beforeEach(() => {
    useChatStore.setState({
      chats: [],
      activeChatId: null,
      isStreaming: false,
      isLoading: false,
      streamingContent: '',
      error: null,
    });
  });

  it('adds a message with attachments to the store', () => {
    const id = useChatStore.getState().createChat();
    const attachment = {
      type: 'image/png',
      data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    };

    useChatStore.getState().addMessage(id, {
      id: 'msg-image',
      role: 'user',
      content: 'What is in this image?',
      timestamp: Date.now(),
      attachments: [attachment],
    });

    const chat = useChatStore.getState().chats.find((c) => c.id === id);
    expect(chat!.messages).toHaveLength(1);
    expect(chat!.messages[0].attachments).toHaveLength(1);
    expect(chat!.messages[0].attachments![0]).toEqual(attachment);
  });

  it('handles messages with multiple attachments', () => {
    const id = useChatStore.getState().createChat();
    const attachments = [
      { type: 'image/png', data: 'base64-1' },
      { type: 'image/jpeg', data: 'base64-2' },
    ];

    useChatStore.getState().addMessage(id, {
      id: 'msg-images',
      role: 'user',
      content: 'Look at these',
      timestamp: Date.now(),
      attachments: attachments,
    });

    const chat = useChatStore.getState().chats.find((c) => c.id === id);
    expect(chat!.messages[0].attachments).toHaveLength(2);
    expect(chat!.messages[0].attachments).toEqual(attachments);
  });
});
