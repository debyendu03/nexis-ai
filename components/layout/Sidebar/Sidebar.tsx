"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import clsx from "clsx";

import { useChatStore } from "@/store/useChatStore";
import { useUIStore } from "@/store/useUIStore";
import { useConversations } from "@/hooks/useConversations";

import { SidebarHeader } from "./SidebarHeader";
import { NewChatButton } from "./NewChatButton";
import { SidebarSearch } from "./SidebarSearch";
import { ConversationList } from "./ConversationList";
import { SidebarUser } from "./SidebarUser";

export function Sidebar() {
  const router = useRouter();
  const params = useParams();

  const [searchQuery, setSearchQuery] = useState("");

  const {
    conversations,
    activeConversationId,
    fetchConversations,
    removeConversation,
  } = useConversations();

  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation,
  );
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  const currentId = (params?.id as string) || activeConversationId;

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleNewChat = () => {
    setActiveConversation(null);
    router.push("/chat");
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    router.push(`/chat/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();

    await removeConversation(id);

    if (currentId === id) {
      router.push("/chat");
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside
      className={clsx(
        "h-screen bg-sidebar flex flex-col shrink-0 select-none z-30 overflow-hidden",
        "transition-[width] duration-300 linear",
        isSidebarOpen
          ? "fixed inset-y-0 left-0 z-40 w-[80%] max-w-[320px] md:relative md:z-30 md:w-[30%]"
          : "hidden md:flex md:w-14",
      )}
    >
      <div className="h-full flex flex-col justify-between gap-3 pt-5">
        {/* Header (New Chat + Search + logo) */}
        <div
          className={clsx(
            "flex flex-col gap-5",
            isSidebarOpen ? "px-4" : "px-1",
          )}
        >
          <div className="pb-1">
            <SidebarHeader />
          </div>

          <NewChatButton onClick={handleNewChat} />

          <SidebarSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Conversations */}
        <ConversationList
          conversations={filteredConversations}
          currentId={currentId}
          searchQuery={searchQuery}
          onSelect={handleSelectConversation}
          onDelete={handleDelete}
        />

        {/* User */}
        <SidebarUser />
      </div>
    </aside>
  );
}
