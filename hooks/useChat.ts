import { useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/store/useChatStore";
import { Message } from "@/types";
import { createConversation, saveMessage, getMessages } from "@/lib/supabase";
import { useGuestSession } from "./useGuestSession";

export function useChat(conversationId: string | null) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const {
    showAuthModal,
    setShowAuthModal,
    checkGuestLimit,
    saveGuestMessages,
  } = useGuestSession();

  const {
    addConversation,
    isLoading,
    setLoading,
    isStreaming,
    setStreaming,
    messagesByConversation,
    setMessages,
    addMessage,
    updateMessage,
  } = useChatStore(
    useShallow((state) => ({
      addConversation: state.addConversation,
      isLoading: state.isLoading,
      setLoading: state.setLoading,
      isStreaming: state.isStreaming,
      setStreaming: state.setStreaming,
      messagesByConversation: state.messagesByConversation,
      setMessages: state.setMessages,
      addMessage: state.addMessage,
      updateMessage: state.updateMessage,
    })),
  );

  const messages = messagesByConversation[conversationId || ""] || [];

  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!isSignedIn || !conversationId) return;
      const data = await getMessages(conversationId);
      setMessages(conversationId, data);
    },
    [isSignedIn, setMessages],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || isStreaming) return;
      if (!checkGuestLimit(!!isSignedIn)) return;

      setLoading(true);

      const isFirstMessage = !conversationId;
      const finalConversationId = conversationId || crypto.randomUUID();

      if (isFirstMessage) {
        router.replace(`/chat/${finalConversationId}`);
      }

      const userMessageId = crypto.randomUUID();
      const assistantMessageId = crypto.randomUUID();

      const userMessage: Message = {
        id: userMessageId,
        conversation_id: finalConversationId,
        role: "user",
        content: content.trim(),
        created_at: new Date().toISOString(),
      };

      addMessage(finalConversationId, userMessage);
      if (!isSignedIn) {
        saveGuestMessages(finalConversationId, [...messages, userMessage]);
      }

      try {
        if (isSignedIn && user && isFirstMessage) {
          const initialTitle =
            content.length > 30 ? `${content.substring(0, 45)}...` : content;
          const newConv = await createConversation(
            finalConversationId,
            user.id,
            initialTitle,
          );
          if (newConv) addConversation(newConv);
        }

        if (isSignedIn) {
          await saveMessage(finalConversationId, "user", content);
        }

        setLoading(false);
        setStreaming(true);

        const assistantPlaceholder: Message = {
          id: assistantMessageId,
          conversation_id: finalConversationId,
          role: "assistant",
          content: "",
          created_at: new Date().toISOString(),
        };
        addMessage(finalConversationId, assistantPlaceholder);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok || !response.body)
          throw new Error("Failed to fetch stream");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullAssistantContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullAssistantContent += decoder.decode(value, { stream: true });
          updateMessage(finalConversationId, assistantMessageId, {
            content: fullAssistantContent,
          });
        }

        if (isSignedIn && fullAssistantContent) {
          await saveMessage(
            finalConversationId,
            "assistant",
            fullAssistantContent,
          );
        }

        if (!isSignedIn) {
          saveGuestMessages(finalConversationId, [
            ...messages,
            userMessage,
            { ...assistantPlaceholder, content: fullAssistantContent },
          ]);
        }
      } catch (error) {
        addMessage(finalConversationId, {
          id: crypto.randomUUID(),
          conversation_id: finalConversationId,
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please check your connection and try again.",
          created_at: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
        setStreaming(false);
      }
    },
    [
      messages,
      isLoading,
      isStreaming,
      conversationId,
      isSignedIn,
      user,
      checkGuestLimit,
      addConversation,
      setLoading,
      setStreaming,
      addMessage,
      updateMessage,
      router,
      saveGuestMessages,
    ],
  );

  return {
    messages,
    sendMessage,
    loadMessages,
    isLoading,
    isStreaming,
    showAuthModal,
    setShowAuthModal,
  };
}
