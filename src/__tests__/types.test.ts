import { describe, it, expect } from 'vitest';
import type { Chat, Message, ModelSettings } from '../types';
import { DEFAULT_SETTINGS, AVAILABLE_MODELS } from '../types';

describe('types', () => {
  it('DEFAULT_SETTINGS has expected shape', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      model: 'gemini-2.0-flash',
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxTokens: 8192,
      systemPrompt: '',
    });
  });

  it('AVAILABLE_MODELS is a non-empty array of strings', () => {
    expect(AVAILABLE_MODELS.length).toBeGreaterThan(0);
    AVAILABLE_MODELS.forEach((m) => expect(typeof m).toBe('string'));
  });

  it('DEFAULT_SETTINGS.model is in AVAILABLE_MODELS', () => {
    expect(AVAILABLE_MODELS).toContain(DEFAULT_SETTINGS.model);
  });

  it('Message type satisfies required fields', () => {
    const msg: Message = {
      id: 'test',
      role: 'user',
      content: 'hello',
      timestamp: Date.now(),
    };
    expect(msg.role).toBe('user');
  });

  it('Chat type satisfies required fields', () => {
    const chat: Chat = {
      id: 'c1',
      title: 'Test',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    expect(chat.messages).toEqual([]);
  });

  it('ModelSettings type satisfies required fields', () => {
    const s: ModelSettings = { ...DEFAULT_SETTINGS };
    expect(s.temperature).toBeGreaterThanOrEqual(0);
  });
});
