export type Role = "user" | "assistant";

export interface Message {
  id: string;
  conversation_id: string;
  role: Role;
  content: string;
  created_at: string;
  isStreaming?: boolean; 
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface ChatStore {
  // State
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  isStreaming: boolean;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversationTitle: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
}

export interface UIStore {
  isSidebarOpen: boolean; 

  // Actions
  toggleSidebar: () => void; 
}
