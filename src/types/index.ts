export interface MessageAttachment {
  type: string;
  data: string; // base64
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: MessageAttachment[];
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
  apiKey?: string;
}

export const DEFAULT_SETTINGS: ModelSettings = {
  model: 'gemini-3-flash-preview',
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxTokens: 8192,
  systemPrompt: '',
  apiKey: '',
};

export const AVAILABLE_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite-preview',
] as const;
