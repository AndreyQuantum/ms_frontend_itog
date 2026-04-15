export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ModelSettings {
  model: string;
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
  systemPrompt: string;
}

export const DEFAULT_SETTINGS: ModelSettings = {
  model: 'gemini-2.0-flash',
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxTokens: 8192,
  systemPrompt: '',
};

export const AVAILABLE_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
] as const;
