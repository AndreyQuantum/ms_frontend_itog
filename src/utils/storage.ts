import type { Chat } from '../types';

const CHATS_KEY = 'gemini-chat-history';

export function loadChats(): Chat[] {
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Chat[];
  } catch {
    return [];
  }
}

export function saveChats(chats: Chat[]): void {
  try {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  } catch (e) {
    console.error('Failed to save chats to localStorage:', e);
  }
}

export function searchChats(chats: Chat[], query: string): Chat[] {
  const q = query.toLowerCase().trim();
  if (!q) return chats;

  return chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(q) ||
      chat.messages.some((m) => m.content.toLowerCase().includes(q)),
  );
}
