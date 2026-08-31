import { useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/store/useChatStore";
import { Message } from "@/types";
import { createConversation, saveMessage, getMessages } from "@/lib/supabase";
import { useGuestSession } from "./useGuestSession";

const CHARS_PER_SECOND = 120;
const UPDATE_INTERVAL_MS = 40; 

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
          isStreaming: true,
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
        let displayedLength = 0;
        let streamComplete = false;
        let animationFrameId: number | null = null;
        let resolveAnimation: (() => void) | null = null;
        let lastUpdateTime = 0;

        const animationFinished = new Promise<void>((resolve) => {
          resolveAnimation = resolve;
        });

        const startTime = performance.now();
        const tick = (timestamp: number) => {
          const targetLength = Math.min(
            fullAssistantContent.length,
            Math.floor(((timestamp - startTime) / 1000) * CHARS_PER_SECOND),
          );

          if (targetLength > displayedLength && timestamp - lastUpdateTime >= UPDATE_INTERVAL_MS) {
            displayedLength = targetLength;
            lastUpdateTime = timestamp;
            updateMessage(finalConversationId, assistantMessageId, {
              content: fullAssistantContent.slice(0, displayedLength),
              isStreaming: true,
            });
          }

          if (streamComplete && displayedLength >= fullAssistantContent.length) {
            resolveAnimation?.();
            return;
          }

          animationFrameId = requestAnimationFrame(tick);
        };

        animationFrameId = requestAnimationFrame(tick);

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullAssistantContent += decoder.decode(value, { stream: true });
          }
          fullAssistantContent += decoder.decode();
          streamComplete = true;
          await animationFinished;
        } finally {
          if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
          }
        }

        updateMessage(finalConversationId, assistantMessageId, {
          content: fullAssistantContent,
          isStreaming: false,
        });

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
            {
              ...assistantPlaceholder,
              content: fullAssistantContent,
              isStreaming: false,
            },
          ]);
        }
      } catch {
        updateMessage(finalConversationId, assistantMessageId, {
          content:
            "Sorry, I encountered an error. Please check your connection and try again.",
          isStreaming: false,
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
