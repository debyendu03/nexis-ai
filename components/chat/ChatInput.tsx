"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip, Image as ImageIcon } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your prompt or question here...",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight,200)}px`;
    }
  }, [input]);

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
    <div className="w-full max-w-4xl mx-auto p-4 pb-0">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-row bg-surface border border-border focus-within:border-accent/60 rounded-3xl p-3 ps-0 shadow-lg transition-all duration-200"
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

        {/* Action Toolbar */}
        <div className="flex items-end">
          {/* Left Accessory Icons */}
          <div> 
            {/* features later */}
          </div>

          {/* Right Submit Button */}
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            aria-label="Send message"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 ${
              input.trim() && !disabled
                ? "bg-accent text-white shadow-accent-glow hover:opacity-90 cursor-pointer scale-100"
                : "bg-border text-content-muted cursor-not-allowed scale-95 opacity-50"
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </form>
      {/* ── Subtle Disclaimer ── */}
      <p className="text-[11px] text-content-muted py-1 text-center  ">
        Nexis can make mistakes. Verify critical outputs.
      </p>
    </div>
  );
}
