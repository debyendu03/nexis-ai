"use client";

import { useChat } from "@/hooks/useChat";
import { EmptyState } from "@/components/chat/EmptyState";
import { ChatInput } from "@/components/chat/ChatInput";
import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";

export default function ChatPage() {
  const { sendMessage } = useChat(null);
  const resetScrollState = useUIStore((state) => state.resetScrollState);

  useEffect(() => {
    resetScrollState();
  }, [resetScrollState]);

  return (
    <div className="flex-1 flex flex-col h-full justify-between overflow-hidden">
      <EmptyState />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}
