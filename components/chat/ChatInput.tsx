"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import clsx from "clsx";
import { useUIStore } from "@/store/useUIStore";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({onSendMessage}: ChatInputProps) {
  const [input, setInput] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Zustand chat state
  const isLoading = useChatStore((state) => state.isLoading);
  const isStreaming = useChatStore((state) => state.isStreaming);

  // Zustand UI state
  const isAtBottom = useUIStore((state) => state.isAtBottom);  
  const scrollToBottomFn = useUIStore((state) => state.scrollToBottomFn); 

  const disabled = isLoading || isStreaming;
  const placeholder = isStreaming ? "Nexis is thinking..." : "Ask Nexis anything...";

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);
  
  //auto focus
  useEffect(() => {
    if (!disabled && window.innerWidth > 768) {
    requestAnimationFrame(() => textareaRef.current?.focus());
  }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    onSendMessage(input.trim());
    setInput("");

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 bg-transparent relative">
      {!isAtBottom && (  
        <button
          onClick={() => scrollToBottomFn?.()}  
          className="p-2 rounded-full flex items-center justify-center transition-all duration-150 bg-surface hover:bg-elevated border border-border text-content-muted cursor-pointer absolute left-1/2 -translate-x-1/2 -top-14 z-10 self-center"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
      <form
        onSubmit={handleSubmit}
        className={clsx("relative flex flex-row bg-surface border border-border rounded-3xl p-3 ps-1 transition-all duration-200", "hover:shadow-lg hover:!border-accent", "focus-within:shadow-lg focus-within:!border-accent")}
      >
        <textarea
          ref={textareaRef} 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent px-3 py-1.5 text-sm placeholder:text-content-muted outline-none max-h-48 leading-relaxed"
        />
        <div className="flex items-end">
          {/* Left Accessory Icons */}
          <div>{/* features later */}</div>

          {/* Right Submit Button */}
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            aria-label="Send message"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 ${
              input.trim() && !disabled
                ? "bg-accent text-white hover:shadow-accent-glow hover:opacity-90 cursor-pointer"
                : "bg-elevated border border-border text-content-muted cursor-not-allowed"
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </form>
      <p className="text-[11px] text-content-muted py-1 text-center">
        Nexis can make mistakes. Verify critical outputs.
      </p>
    </div>
  );
}
