"use client";

import { useChat } from "@/hooks/useChat";
import { EmptyState } from "@/components/chat/EmptyState";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatPage() {
  const { sendMessage } = useChat(null);

  return (
    <div className="flex-1 flex flex-col h-full justify-between overflow-hidden">
      <EmptyState />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}
