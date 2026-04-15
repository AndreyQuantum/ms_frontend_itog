import type { Message, ModelSettings } from '../types';
import type {
  GeminiContent,
  GeminiRequest,
  GeminiStreamChunk,
} from './types';

const BASE_URL = '/api/gemini';

function toGeminiRole(role: Message['role']): 'user' | 'model' {
  return role === 'user' ? 'user' : 'model';
}

function buildContents(messages: Message[]): GeminiContent[] {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: toGeminiRole(m.role),
      parts: [{ text: m.content }],
    }));
}

function buildRequest(messages: Message[], settings: ModelSettings): GeminiRequest {
  const request: GeminiRequest = {
    contents: buildContents(messages),
    generationConfig: {
      temperature: settings.temperature,
      topP: settings.topP,
      topK: settings.topK,
      maxOutputTokens: settings.maxTokens,
    },
  };

  const systemText = settings.systemPrompt.trim();
  if (systemText) {
    request.systemInstruction = {
      parts: [{ text: systemText }],
    };
  }

  return request;
}

export class GeminiApiError extends Error {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'GeminiApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Stream response from Gemini API token-by-token.
 * Yields accumulated text on each SSE chunk.
 */
export async function* streamMessage(
  messages: Message[],
  settings: ModelSettings,
  signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  const url = `${BASE_URL}/models/${settings.model}:streamGenerateContent?alt=sse`;
  const body = buildRequest(messages, settings);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new GeminiApiError(
      `Gemini API error ${response.status}: ${errorBody}`,
      response.status,
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new GeminiApiError('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let accumulated = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      // Keep incomplete last line in buffer
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const jsonStr = trimmed.slice(6);
        if (jsonStr === '[DONE]') return;

        try {
          const chunk: GeminiStreamChunk = JSON.parse(jsonStr);

          if (chunk.error) {
            throw new GeminiApiError(
              chunk.error.message,
              chunk.error.code,
            );
          }

          const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            accumulated += text;
            yield accumulated;
          }
        } catch (e) {
          if (e instanceof GeminiApiError) throw e;
          // Skip malformed JSON chunks silently
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/** Non-streaming single-shot call (used for chat title generation). */
export async function sendMessage(
  messages: Message[],
  settings: ModelSettings,
  signal?: AbortSignal,
): Promise<string> {
  const url = `${BASE_URL}/models/${settings.model}:generateContent`;
  const body = buildRequest(messages, settings);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new GeminiApiError(
      `Gemini API error ${response.status}: ${errorBody}`,
      response.status,
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiApiError('Empty response from Gemini API');
  }

  return text;
}
