import { useState, useCallback } from "react";
import { Message, Conversation } from "@/types";
import { createConversation, saveMessage } from "@/lib/supabase";

const GUEST_LIMIT = 5;
const GUEST_STORAGE_KEY = "nexis_guest_count";
const GUEST_MESSAGES_KEY = "nexis_guest_messages";

export function useGuestSession() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const checkGuestLimit = useCallback((isSignedIn: boolean): boolean => {
    if (isSignedIn) return true;

    const count = parseInt(
      sessionStorage.getItem(GUEST_STORAGE_KEY) || "0",
      10,
    );
    if (count >= GUEST_LIMIT) {
      setShowAuthModal(true);
      return false;
    }

    sessionStorage.setItem(GUEST_STORAGE_KEY, (count + 1).toString());
    return true;
  }, []);

  const saveGuestMessages = useCallback(
    (conversationId: string, msgs: Message[]) => {
      sessionStorage.setItem(
        GUEST_MESSAGES_KEY,
        JSON.stringify({ conversationId, messages: msgs }),
      );
    },
    [],
  );

  const migrateGuestConversation = useCallback(
    async (
      userId: string,
      targetConversationId: string,
      onMigrated: (conversationId: string, messages: Message[]) => void,
      onConversationCreated: (conv: Conversation) => void,
    ): Promise<boolean> => {
      const saved = sessionStorage.getItem(GUEST_MESSAGES_KEY);
      if (!saved) return false;

      const { conversationId, messages: guestMessages } = JSON.parse(saved);
      if (conversationId !== targetConversationId) return false;

      onMigrated(conversationId, guestMessages);

      const newConv = await createConversation(
        conversationId,
        userId,
        guestMessages[0]?.content?.slice(0, 45) || "New Chat",
      );
      if (newConv) onConversationCreated(newConv);

      for (const m of guestMessages) {
        await saveMessage(conversationId, m.role, m.content);
      }

      sessionStorage.removeItem(GUEST_MESSAGES_KEY);
      sessionStorage.removeItem(GUEST_STORAGE_KEY);

      return true;
    },
    [],
  );

  const getGuestMessages = useCallback(
    (conversationId: string): Message[] => {
      const saved = sessionStorage.getItem(GUEST_MESSAGES_KEY);
      if (!saved) return [];
      try {
        const { conversationId: savedId, messages: savedMessages } =
          JSON.parse(saved);
        if (savedId !== conversationId) return [];
        return savedMessages;
      } catch {
        return [];
      }
    },
    [],
  );

  return {
    showAuthModal,
    setShowAuthModal,
    checkGuestLimit,
    saveGuestMessages,
    migrateGuestConversation,
    getGuestMessages,
  };
}
