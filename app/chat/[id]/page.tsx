"use client";

import { useEffect, use } from "react";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/store/useChatStore";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useGuestSession } from "@/hooks/useGuestSession";

const EMPTY_MESSAGES: never[] = [];
interface DynamicChatPageProps {
  params: Promise<{ id: string }>;
}

export default function DynamicChatPage({ params }: DynamicChatPageProps) { 
  const { id } = use(params);
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  const { sendMessage, loadMessages, isLoading, showAuthModal } = useChat(id);
  const { migrateGuestConversation } = useGuestSession();

  const setMessages = useChatStore((state) => state.setMessages);
  const addConversation = useChatStore((state) => state.addConversation);
  const messages =
    useChatStore((state) => state.messagesByConversation[id]) ?? EMPTY_MESSAGES;

  useEffect(() => {
    if (!id) return;

    const init = async () => {
      if (isSignedIn && user) {
        const migrated = await migrateGuestConversation(
          user.id,
          id,
          setMessages,
          addConversation,
        );
        if (!migrated && messages.length === 0) {
          await loadMessages(id);
        }
      } else if (messages.length === 0) {
        await loadMessages(id);
      }
    };

    init();
  }, [id, isSignedIn, user]);

  useEffect(() => {
    if (showAuthModal) {
      router.push(`/sign-in?redirect_url=/chat/${id}`);
    }
  }, [showAuthModal, id, router]);

  return (
    <div className="flex-1 flex flex-col h-full justify-between overflow-hidden bg-base">
      <div className="flex-1 flex flex-col min-h-0">
        {isLoading && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 text-content-secondary text-xs">
              <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="font-medium">Loading conversation...</span>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}
