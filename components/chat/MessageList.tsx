"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { Message } from "@/types";
import { MemoizedMessageItem } from "./MessageItem";
import { useUIStore } from "@/store/useUIStore";

const SCROLL_OFFSET = 60; 
const BOTTOM_THRESHOLD = 100;

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<HTMLDivElement | null>(null);
  const prevUserMessageIdRef = useRef<string | null>(null);
  const targetScrollTopRef = useRef(0);
  const pinnedRef = useRef(false);
  const [spacerHeight, setSpacerHeight] = useState(0);

  const hasInitializedRef = useRef(false);

  const setScrollState = useUIStore((state) => state.setScrollState);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const checkIfAtBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD;
    setScrollState(atBottom, scrollToBottom);
  }, [setScrollState, scrollToBottom]);

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  const enforcePin = useCallback((smooth = false) => {
    const container = containerRef.current;
    const spacerEl = spacerRef.current;
    if (!container || !spacerEl) return;

    const desired = targetScrollTopRef.current;
    const contentHeightWithoutSpacer = spacerEl.offsetTop;
    const clientHeight = container.clientHeight;
    const required = Math.max(0, desired + clientHeight - contentHeightWithoutSpacer);

    spacerEl.style.height = `${required}px`;
    spacerEl.style.minHeight = `${required}px`;
    setSpacerHeight(required);

    if (smooth) {
      container.scrollTo({ top: desired, behavior: "smooth" });
    } else {
      container.scrollTop = desired;
    }

    if (required <= 0) pinnedRef.current = false;
  }, []);
  
  useEffect(() => {
  if (hasInitializedRef.current) return;
  if (messages.length === 0) return; 

  hasInitializedRef.current = true;
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  prevUserMessageIdRef.current = lastUserMessage?.id ?? null;
}, [messages, lastUserMessage]);
 
  useEffect(() => {
    const container = containerRef.current;
    const spacerEl = spacerRef.current;
    if (!container || !spacerEl) return;

    const isNewUserMessage = lastUserMessage && lastUserMessage.id !== prevUserMessageIdRef.current;

    if (isNewUserMessage) {
      prevUserMessageIdRef.current = lastUserMessage.id;
      pinnedRef.current = true;

      requestAnimationFrame(() => {
        const target = lastUserMessageRef.current;
        if (target && container) {
          const targetRect = target.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          targetScrollTopRef.current =
            container.scrollTop + (targetRect.top - containerRect.top) - SCROLL_OFFSET;
          enforcePin(true); 
        }
      });
      return;
    }

    if (pinnedRef.current) {
      enforcePin(false); 
    }
  }, [messages, lastUserMessage, enforcePin]);
 
  useEffect(() => {
    checkIfAtBottom();
  }, [messages, checkIfAtBottom]);

  return (
    <div
      ref={containerRef}
      onScroll={checkIfAtBottom}
      className="overflow-y-auto w-full max-w-4xl mx-auto flex flex-col pt-13 h-full"
    >
      {messages.map((message, index) => {
        const isThisTheLastUserMessage = lastUserMessage?.id === message.id;
        return (
          <div
            key={message.id || index}
            ref={(el) => {
              if (isThisTheLastUserMessage) lastUserMessageRef.current = el;
            }}
          >
            <MemoizedMessageItem message={message} />
          </div>
        );
      })}
      <div ref={spacerRef} style={{ height: spacerHeight, minHeight: spacerHeight }} />
      <div ref={bottomRef} />
    </div>
  );
}