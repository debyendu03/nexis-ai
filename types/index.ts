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
  isLoading: boolean;
  isStreaming: boolean;
  messagesByConversation: Record<string, Message[]>;


  // Actions
  setConversations: (conversations: Conversation[]) => void; 
  addConversation: (conversation: Conversation) => void;
  updateConversationTitle: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, patch: Partial<Message>) => void;
}

export interface UIStore {
  isSidebarOpen: boolean;        
  isMobileSidebarOpen: boolean; 
  
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}
