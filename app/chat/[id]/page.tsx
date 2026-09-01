"use client";

import { useEffect, use, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/store/useChatStore";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useGuestSession } from "@/hooks/useGuestSession";
import { notFound } from "next/navigation";
import { getConversation } from "@/lib/supabase";

const EMPTY_MESSAGES: never[] = [];
interface DynamicChatPageProps {
  params: Promise<{ id: string }>;
}

export default function DynamicChatPage({ params }: DynamicChatPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const [isInvalid, setIsInvalid] = useState(false);

  const { sendMessage, loadMessages, isLoading, showAuthModal } = useChat(id);
  const { migrateGuestConversation, getGuestMessages } = useGuestSession();

  const setMessages = useChatStore((state) => state.setMessages);
  const addConversation = useChatStore((state) => state.addConversation);
  const messages =
    useChatStore((state) => state.messagesByConversation[id]) ?? EMPTY_MESSAGES;

  useEffect(() => {
    if (!id || !isLoaded) return;

    const initSignedIn = async () => {
      const migrated = await migrateGuestConversation(
        user!.id,
        id,
        setMessages,
        addConversation,
      );
      if (migrated) return;
      if (messages.length > 0) return;

      const conversation = await getConversation(id, user!.id);
      if (!conversation) {
        setIsInvalid(true);
        return;
      }
      await loadMessages(id);
    };

    const initGuest = async () => {
      if (messages.length > 0) return; 

      const guestMessages = getGuestMessages(id);
      if (guestMessages.length === 0) {
        setIsInvalid(true);
        return;
      }
      setMessages(id, guestMessages);
    };

    const init = async () => {
      if (isSignedIn && user) {
        await initSignedIn();
      } else {
        await initGuest();
      }
    };

    init();
  }, [id, isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (showAuthModal) {
      router.push(`/sign-in?redirect_url=/chat/${id}`);
    }
  }, [showAuthModal, id, router]);

  if (isInvalid) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col h-full justify-between overflow-hidden bg-base">
      <div className="flex-1 flex flex-col min-h-0">
        {isLoading && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 text-content-secondary text-xs">
              <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="font-medium">Loading...</span>
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