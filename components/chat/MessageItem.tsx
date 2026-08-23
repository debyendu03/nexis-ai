"use client";

import { Message } from "@/types";
import { User } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface MessageItemProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageItem({
  message,
  isStreaming = false,
}: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`w-full py-3 sm:py-4 px-4 md:px-6 sm:px-6 flex gap-3 sm:gap-4 transition-colors ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* ── User Bubble (Right Aligned) ── */}
      {isUser ? (
        <div className="max-w-[85%] sm:max-w-[75%]">
          <div className="p-3 rounded-2xl bg-bubble-user border border-bubble-user-border text-content-primary text-sm leading-relaxed break-words">
            {message.content}
          </div>
        </div>
      ) : (
        // ── Assistant Bubble── 
        <div className="max-w-[100%]">

          <div className="py-4">
            {message.content ? (
              <MarkdownRenderer content={message.content} />
            ) : (
              // Pulsing loading state while stream is establishing
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
              </div>
            )} 
          </div> 
        </div>
      )}
    </div>
  );
}
