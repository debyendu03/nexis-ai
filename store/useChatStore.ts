import { create } from 'zustand';
import { ChatStore, Conversation, Theme } from '@/types';

export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  isStreaming: false,
  

  // Actions
  setConversations: (conversations: Conversation[]) => set({ conversations }),

  setActiveConversation: (id: string | null) => set({ activeConversationId: id }),

  addConversation: (conversation: Conversation) => set((state) => ({
      conversations: [conversation, ...state.conversations],
      activeConversationId: conversation.id,
    })),

  updateConversationTitle: (id: string, title: string) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c
      ),
    })),

  deleteConversation: (id: string) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId:state.activeConversationId === id ? null : state.activeConversationId,
    })),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setStreaming: (isStreaming: boolean) => set({ isStreaming }),

}));