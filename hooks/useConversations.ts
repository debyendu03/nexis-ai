import { useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/store/useChatStore";
import {
  getConversations,
  deleteConversationFromDb,
  updateConversationTitleInDb,
} from "@/lib/supabase";

export function useConversations(conversationId: string | null) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const {
    conversations,
    setConversations,
    deleteConversation,
    updateConversationTitle,
    isLoading,
    setLoading,
  } = useChatStore(
    useShallow((state) => ({
      conversations: state.conversations,
      setConversations: state.setConversations,
      deleteConversation: state.deleteConversation,
      updateConversationTitle: state.updateConversationTitle,
      isLoading: state.isLoading,
      setLoading: state.setLoading,
    })),
  );

  const fetchConversations = useCallback(async () => {
    if (!isSignedIn || !user) return;
    setLoading(true);
    try {
      const data = await getConversations(user.id);
      setConversations(data);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, user, setConversations]);

  const removeConversation = useCallback(
    async (targetId: string) => {
      deleteConversation(targetId);

      if (targetId === conversationId) {
        router.push("/");
      }

      if (isSignedIn) {
        await deleteConversationFromDb(targetId);
      }
    },
    [isSignedIn, conversationId, deleteConversation, router],
  );

  const renameConversation = useCallback(
    async (targetId: string, newTitle: string) => {
      if (!newTitle.trim()) return;

      updateConversationTitle(targetId, newTitle.trim());

      if (isSignedIn) {
        await updateConversationTitleInDb(targetId, newTitle.trim());
      }
    },
    [isSignedIn, updateConversationTitle],
  );

  return {
    conversations,
    isLoading,
    fetchConversations,
    removeConversation,
    renameConversation,
  };
}
