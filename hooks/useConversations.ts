import { useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useChatStore } from "@/store/useChatStore";
import {
  getConversations,
  deleteConversationFromDb,
  updateConversationTitleInDb,
} from "@/lib/supabase";

export function useConversations() {
  const { user, isSignedIn } = useUser();

  // Zustand selectors
  const conversations = useChatStore((state) => state.conversations);
  const setConversations = useChatStore((state) => state.setConversations);

  const deleteConversation = useChatStore((state) => state.deleteConversation);

  const updateConversationTitle = useChatStore(
    (state) => state.updateConversationTitle,
  );

  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation,
  );

  const activeConversationId = useChatStore(
    (state) => state.activeConversationId,
  );

  // Fetch all conversations from Supabase + sync to store
  const fetchConversations = useCallback(async () => {
    if (!isSignedIn || !user) return;
    const data = await getConversations(user.id);
    setConversations(data);
  }, [isSignedIn, user, setConversations]);

  //Delete conversation from DB + remove from local store
  const removeConversation = useCallback(
    async (conversationId: string) => {
      deleteConversation(conversationId);

      if (activeConversationId === conversationId) {
        setActiveConversation(null);
      }

      if (isSignedIn) {
        await deleteConversationFromDb(conversationId);
      }
    },
    [
      isSignedIn,
      activeConversationId,
      deleteConversation,
      setActiveConversation,
    ],
  );

  // Rename conversation title in DB + update local store
  const renameConversation = useCallback(
    async (conversationId: string, newTitle: string) => {
      if (!newTitle.trim()) return;

      updateConversationTitle(conversationId, newTitle.trim());

      if (isSignedIn) {
        await updateConversationTitleInDb(conversationId, newTitle.trim());
      }
    },
    [isSignedIn, updateConversationTitle],
  );

  return {
    conversations,
    activeConversationId,
    fetchConversations,
    removeConversation,
    renameConversation,
  };
}
