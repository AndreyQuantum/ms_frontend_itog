import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '../store/chatStore';

describe('chatStore', () => {
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

  it('creates a new chat and sets it as active', () => {
    const id = useChatStore.getState().createChat();

    const state = useChatStore.getState();
    expect(state.chats).toHaveLength(1);
    expect(state.activeChatId).toBe(id);
    expect(state.chats[0].title).toBe('Новый чат');
    expect(state.chats[0].messages).toEqual([]);
  });

  it('creates multiple chats', () => {
    useChatStore.getState().createChat();
    useChatStore.getState().createChat();

    expect(useChatStore.getState().chats).toHaveLength(2);
  });

  it('deletes a chat and clears activeChatId if deleted', () => {
    const id = useChatStore.getState().createChat();
    useChatStore.getState().deleteChat(id);

    const state = useChatStore.getState();
    expect(state.chats).toHaveLength(0);
    expect(state.activeChatId).toBeNull();
  });

  it('switches activeChatId when deleting the active chat with other chats present', () => {
    const id1 = useChatStore.getState().createChat();
    useChatStore.getState().createChat();

    useChatStore.getState().switchChat(id1);
    useChatStore.getState().deleteChat(id1);

    const state = useChatStore.getState();
    expect(state.chats).toHaveLength(1);
    expect(state.activeChatId).toBe(state.chats[0].id);
  });

  it('renames a chat', () => {
    const id = useChatStore.getState().createChat();
    useChatStore.getState().renameChat(id, 'Custom Title');

    expect(useChatStore.getState().chats[0].title).toBe('Custom Title');
  });

  it('switches active chat', () => {
    const id1 = useChatStore.getState().createChat();
    const id2 = useChatStore.getState().createChat();

    useChatStore.getState().switchChat(id1);
    expect(useChatStore.getState().activeChatId).toBe(id1);

    useChatStore.getState().switchChat(id2);
    expect(useChatStore.getState().activeChatId).toBe(id2);
  });

  it('adds a message to a chat', () => {
    const id = useChatStore.getState().createChat();

    useChatStore.getState().addMessage(id, {
      id: 'msg-1',
      role: 'user',
      content: 'Hello',
      timestamp: Date.now(),
    });

    const chat = useChatStore.getState().chats.find((c) => c.id === id);
    expect(chat!.messages).toHaveLength(1);
    expect(chat!.messages[0].content).toBe('Hello');
  });

  it('updates the last assistant message', () => {
    const id = useChatStore.getState().createChat();
    useChatStore.getState().addMessage(id, {
      id: 'msg-1',
      role: 'assistant',
      content: 'Hello',
      timestamp: Date.now(),
    });

    useChatStore.getState().updateLastAssistantMessage(id, 'Hello World');

    const chat = useChatStore.getState().chats.find((c) => c.id === id);
    expect(chat!.messages[0].content).toBe('Hello World');
  });

  it('sets and clears error', () => {
    useChatStore.getState().setError('Something broke');
    expect(useChatStore.getState().error).toBe('Something broke');

    useChatStore.getState().clearError();
    expect(useChatStore.getState().error).toBeNull();
  });

  it('sets and clears streaming content', () => {
    useChatStore.getState().setStreamingContent('partial response');
    expect(useChatStore.getState().streamingContent).toBe('partial response');

    useChatStore.getState().setStreamingContent('');
    expect(useChatStore.getState().streamingContent).toBe('');
  });

  it('sets streaming and loading flags', () => {
    useChatStore.getState().setIsStreaming(true);
    expect(useChatStore.getState().isStreaming).toBe(true);

    useChatStore.getState().setIsLoading(true);
    expect(useChatStore.getState().isLoading).toBe(true);
  });

  it('activeChat returns undefined when no chats', () => {
    expect(useChatStore.getState().activeChat()).toBeUndefined();
  });

  it('activeChat returns the active chat', () => {
    const id = useChatStore.getState().createChat();
    const active = useChatStore.getState().activeChat();
    expect(active).toBeDefined();
    expect(active!.id).toBe(id);
  });

  it('ignores rename on non-existent chat id', () => {
    useChatStore.getState().createChat();
    useChatStore.getState().renameChat('non-existent', 'Nope');
    expect(useChatStore.getState().chats[0].title).toBe('Новый чат');
  });

  it('ignores addMessage on non-existent chat id', () => {
    useChatStore.getState().createChat();
    useChatStore.getState().addMessage('non-existent', {
      id: 'msg-1',
      role: 'user',
      content: 'test',
      timestamp: Date.now(),
    });
    expect(useChatStore.getState().chats[0].messages).toHaveLength(0);
  });
});
