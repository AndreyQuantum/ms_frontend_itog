export interface GeminiPart {
  text: string;
}

export interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

export interface GeminiGenerationConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
}

export interface GeminiRequest {
  contents: GeminiContent[];
  systemInstruction?: { parts: GeminiPart[] };
  generationConfig?: GeminiGenerationConfig;
}

export interface GeminiCandidate {
  content: {
    parts: GeminiPart[];
    role: string;
  };
  finishReason?: string;
}

export interface GeminiResponse {
  candidates: GeminiCandidate[];
}

export interface GeminiStreamChunk {
  candidates?: GeminiCandidate[];
  error?: { code: number; message: string };
}
