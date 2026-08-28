import { create } from "zustand";
import { ChatStore, Conversation } from "@/types";

export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  conversations: [],
  isLoading: false,
  isStreaming: false,
  messagesByConversation: {},

  // Actions
  setConversations: (conversations: Conversation[]) => set({ conversations }),

  addConversation: (conversation: Conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  updateConversationTitle: (id: string, title: string) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c,
      ),
    })),

  deleteConversation: (id: string) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
    })),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setStreaming: (isStreaming: boolean) => set({ isStreaming }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: messages,
      },
    })),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [
          ...(state.messagesByConversation[conversationId] || []),
          message,
        ],
      },
    })),

  updateMessage: (conversationId, messageId, patch) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: (
          state.messagesByConversation[conversationId] || []
        ).map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
      },
    })),
}));
