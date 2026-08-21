import { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useChatStore } from "@/store/useChatStore";
import { Message, Conversation } from "@/types";
import {
  createConversation,
  saveMessage,
} from "@/lib/supabase";

const GUEST_LIMIT = 3;
const GUEST_STORAGE_KEY = "nexis_guest_count";

export function useChat() {
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const {
    activeConversationId,
    setActiveConversation,
    addConversation,
    isLoading,
    setLoading,
    isStreaming,
    setStreaming,
  } = useChatStore();

  /* Helper to get and increment guest message count */
  const checkGuestLimit = useCallback((): boolean => {
    if (isSignedIn) return true;

    const count = parseInt(sessionStorage.getItem(GUEST_STORAGE_KEY) || "0", 10);
    if (count > GUEST_LIMIT) {
      setShowAuthModal(true);
      return false;
    }

    sessionStorage.setItem(GUEST_STORAGE_KEY, (count + 1).toString());
    return true;
  }, [isSignedIn]);

  /* Send Message & Handle Gemini Stream */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || isStreaming) return;

      // Check guest limit if not signed in
      if (!checkGuestLimit()) return;

      setLoading(true);

      // Temporary IDs for optimistic UI updates
      const userMessageId = crypto.randomUUID();
      const assistantMessageId = crypto.randomUUID();
      let currentConversationId = activeConversationId;

      // Prepare user message object
      const userMessage: Message = {
        id: userMessageId,
        conversation_id: currentConversationId || "temp",
        role: "user",
        content: content.trim(),
        created_at: new Date().toISOString(),
      };

      // Optimistic append to local messages
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      try {
        // If signed in and no active conversation, create one in Supabase
        if (isSignedIn && user && !currentConversationId) {
          // Generate title from first 30 chars of the prompt
          const initialTitle =
            content.length > 30 ? `${content.substring(0, 30)}...` : content;

          const newConv = await createConversation(user.id, initialTitle);
          if (newConv) {
            currentConversationId = newConv.id;
            setActiveConversation(newConv.id);
            addConversation(newConv);
          }
        }

        // Save user message to Supabase if authenticated
        if (isSignedIn && currentConversationId) {
          await saveMessage(currentConversationId, "user", content);
        }

        // Initialize streaming placeholder for assistant
        setLoading(false);
        setStreaming(true);

        const assistantPlaceholder: Message = {
          id: assistantMessageId,
          conversation_id: currentConversationId || "temp",
          role: "assistant",
          content: "",
          created_at: new Date().toISOString(),
        };

        setMessages([...updatedMessages, assistantPlaceholder]);

        // Call backend streaming endpoint
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error("Failed to fetch stream from /api/chat");
        }

        // Read stream chunk by chunk
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullAssistantContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullAssistantContent += chunk;

          // Update streaming message in UI
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullAssistantContent }
                : msg,
            ),
          );
        }

        // Stream finished: save complete response in Supabase if authenticated
        if (isSignedIn && currentConversationId && fullAssistantContent) {
          await saveMessage(
            currentConversationId,
            "assistant",
            fullAssistantContent,
          );
        }
      } catch (error) {
        console.error("Error during chat stream:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            conversation_id: currentConversationId || "temp",
            role: "assistant",
            content:"Sorry, I encountered an error. Please check your connection and try again.",
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
        setStreaming(false);
      }
    },
    [
      messages,
      isLoading,
      isStreaming,
      activeConversationId,
      isSignedIn,
      user,
      checkGuestLimit,
      setActiveConversation,
      addConversation,
      setLoading,
      setStreaming,
    ],
  );

  return {
    messages,
    setMessages,
    sendMessage,
    isLoading,
    isStreaming,
    showAuthModal,
    setShowAuthModal,
  };
}
