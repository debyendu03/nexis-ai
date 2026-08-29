'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Message } from '@/types';
import { MessageItem } from './MessageItem'; 
import { useUIStore } from '@/store/useUIStore';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);  
  const setScrollState = useUIStore((state) => state.setScrollState);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const checkIfAtBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 100;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setScrollState(atBottom, scrollToBottom);
  }, [setScrollState, scrollToBottom]);

  useEffect(() => {
    checkIfAtBottom();
  }, [checkIfAtBottom]);

  useEffect(() => { 
    if (!hasInitializedRef.current && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
      hasInitializedRef.current = true;
    }
  }, [messages]);
 
  useEffect(() => {
    checkIfAtBottom();
  }, [messages, checkIfAtBottom]);

  return (
    <div
      ref={containerRef}
      onScroll={checkIfAtBottom}
      className="overflow-y-auto w-full max-w-4xl mx-auto flex flex-col pt-13 h-full"
    >
      {messages.map((message, index) => (
        <MessageItem key={message.id || index} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}