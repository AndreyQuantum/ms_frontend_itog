import { describe, it, expect } from 'vitest';
import type { Chat } from '../types';
import { searchChats } from '../utils/storage';

const makeChat = (id: string, title: string, content: string): Chat => ({
  id,
  title,
  messages: [
    { id: 'msg-1', role: 'user', content, timestamp: Date.now() },
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

describe('searchChats', () => {
  const chats: Chat[] = [
    makeChat('1', 'JavaScript basics', 'What is a closure?'),
    makeChat('2', 'Python tips', 'How to use decorators'),
    makeChat('3', 'React hooks', 'Explain useEffect'),
  ];

  it('returns all chats when query is empty', () => {
    expect(searchChats(chats, '')).toEqual(chats);
  });

  it('returns all chats when query is whitespace', () => {
    expect(searchChats(chats, '   ')).toEqual(chats);
  });

  it('matches against title (case-insensitive)', () => {
    const result = searchChats(chats, 'javascript');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('matches against message content', () => {
    const result = searchChats(chats, 'decorators');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns empty when nothing matches', () => {
    expect(searchChats(chats, 'golang')).toHaveLength(0);
  });

  it('handles empty chats array', () => {
    expect(searchChats([], 'query')).toEqual([]);
  });

  it('matches partial title', () => {
    const result = searchChats(chats, 'hook');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('matches across title and content', () => {
    const result = searchChats(chats, 'use');
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});
