'use client';

import { useChat } from '@/hooks/useChat';
import { EmptyState } from '@/components/chat/EmptyState';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';

export default function ChatPage() {
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex-1 flex flex-col h-full justify-between overflow-hidden">
      {/* Conversation Feed or Empty State */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {messages.length === 0 ? (
          <EmptyState/>
        ) : (
          <MessageList messages={messages}/>
        )}
      </div>

      {/* Persistent Chat Input Dock at Bottom */}
      <ChatInput onSendMessage={sendMessage}/>
    </div>
  );
}