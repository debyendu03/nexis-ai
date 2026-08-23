'use client';

import { useEffect, use } from 'react';
import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/store/useChatStore';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';

interface DynamicChatPageProps {
  params: Promise<{ id: string }>;
}

export default function DynamicChatPage({ params }: DynamicChatPageProps) {
  const { id } = use(params);
  const { messages, sendMessage, loadMessages, isLoading, isStreaming } = useChat();
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);

  useEffect(() => {
    if (id) {
      setActiveConversation(id);
      loadMessages(id);
    }
  }, [id, setActiveConversation, loadMessages]);

  return (
    <div className="flex-1 flex flex-col h-full justify-between overflow-hidden bg-base">
      {/* ── Conversation Message Timeline ── */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {isLoading && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 text-content-secondary text-xs">
              <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span>Loading conversation...</span>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>

      {/* ── Persistent Floating Chat Input Dock ── */}
      <ChatInput
        onSendMessage={sendMessage}
      />
    </div>
  );
}