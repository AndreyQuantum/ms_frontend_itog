import { useRef, useCallback } from 'react';
import { streamMessage, GeminiApiError } from '../api/gemini';
import type { Message, ModelSettings } from '../types';

interface UseStreamingReturn {
  startStream: (
    messages: Message[],
    settings: ModelSettings,
    onChunk: (accumulated: string) => void,
    onDone: (finalText: string) => void,
    onError: (error: string) => void,
  ) => Promise<void>;
  stopStream: () => void;
  isStreamingRef: React.RefObject<boolean>;
}

export function useStreaming(): UseStreamingReturn {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isStreamingRef = useRef(false);

  const stopStream = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    isStreamingRef.current = false;
  }, []);

  const startStream = useCallback(
    async (
      messages: Message[],
      settings: ModelSettings,
      onChunk: (accumulated: string) => void,
      onDone: (finalText: string) => void,
      onError: (error: string) => void,
    ) => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      isStreamingRef.current = true;

      let lastText = '';

      try {
        for await (const accumulated of streamMessage(messages, settings, controller.signal)) {
          if (!isStreamingRef.current) break;
          lastText = accumulated;
          onChunk(accumulated);
        }
        onDone(lastText);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          onDone(lastText);
          return;
        }

        const message =
          err instanceof GeminiApiError
            ? err.message
            : 'Произошла ошибка при получении ответа';
        onError(message);
      } finally {
        isStreamingRef.current = false;
        abortControllerRef.current = null;
      }
    },
    [],
  );

  return { startStream, stopStream, isStreamingRef };
}
