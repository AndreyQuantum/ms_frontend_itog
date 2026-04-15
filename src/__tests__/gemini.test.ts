import { describe, it, expect } from 'vitest';
import { GeminiApiError, buildRequest } from '../api/gemini';
import type { Message, ModelSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

describe('GeminiApiError', () => {
  it('creates an error with message and status code', () => {
    const err = new GeminiApiError('Not found', 404);
    expect(err.message).toBe('Not found');
    expect(err.statusCode).toBe(404);
    expect(err.name).toBe('GeminiApiError');
    expect(err).toBeInstanceOf(Error);
  });

  it('creates an error without status code', () => {
    const err = new GeminiApiError('Unknown');
    expect(err.statusCode).toBeUndefined();
  });
});

describe('buildRequest', () => {
  const messages: Message[] = [
    { id: '1', role: 'user', content: 'Hello', timestamp: Date.now() },
    { id: '2', role: 'assistant', content: 'Hi there', timestamp: Date.now() },
    { id: '3', role: 'user', content: 'How are you?', timestamp: Date.now() },
  ];

  it('maps messages to Gemini API format', () => {
    const body = buildRequest(messages, DEFAULT_SETTINGS);

    expect(body.contents).toHaveLength(3);
    expect(body.contents[0]).toEqual({
      role: 'user',
      parts: [{ text: 'Hello' }],
    });
    expect(body.contents[1]).toEqual({
      role: 'model',
      parts: [{ text: 'Hi there' }],
    });
    expect(body.contents[2]).toEqual({
      role: 'user',
      parts: [{ text: 'How are you?' }],
    });
  });

  it('includes generation config from settings', () => {
    const settings: ModelSettings = {
      ...DEFAULT_SETTINGS,
      temperature: 1.2,
      topP: 0.9,
      topK: 50,
      maxTokens: 4096,
    };

    const body = buildRequest(messages, settings);

    expect(body.generationConfig!.temperature).toBe(1.2);
    expect(body.generationConfig!.topP).toBe(0.9);
    expect(body.generationConfig!.topK).toBe(50);
    expect(body.generationConfig!.maxOutputTokens).toBe(4096);
  });

  it('includes system instruction when systemPrompt is set', () => {
    const settings: ModelSettings = {
      ...DEFAULT_SETTINGS,
      systemPrompt: 'Be helpful',
    };

    const body = buildRequest(messages, settings);
    expect(body.systemInstruction).toEqual({
      parts: [{ text: 'Be helpful' }],
    });
  });

  it('omits system instruction when systemPrompt is empty', () => {
    const body = buildRequest(messages, DEFAULT_SETTINGS);
    expect(body.systemInstruction).toBeUndefined();
  });

  it('handles a single message', () => {
    const body = buildRequest([messages[0]], DEFAULT_SETTINGS);
    expect(body.contents).toHaveLength(1);
  });

  it('filters out system role messages', () => {
    const withSystem: Message[] = [
      { id: 's', role: 'system' as Message['role'], content: 'system msg', timestamp: Date.now() },
      ...messages,
    ];
    const body = buildRequest(withSystem, DEFAULT_SETTINGS);
    expect(body.contents).toHaveLength(3);
  });
});
