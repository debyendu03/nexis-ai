"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import clsx from "clsx";

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
  const currentId = (params?.id as string) || null;

  const [searchQuery, setSearchQuery] = useState("");

  const { conversations, fetchConversations, removeConversation } = useConversations(currentId);

  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const isMobileSidebarOpen = useUIStore((state) => state.isMobileSidebarOpen);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleNewChat = () => {
    router.push("/");
  };

  const handleSelectConversation = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();

    await removeConversation(id);

    if (currentId === id) {
      router.push("/");
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside
      className={clsx(
        "h-screen bg-sidebar flex flex-col shrink-0 select-none z-30 overflow-hidden",
        "fixed inset-y-0 left-0 w-[80%] max-w-[320px] transition-transform duration-300",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:static md:translate-x-0",
        isSidebarOpen ? "md:w-[30%]" : "md:w-14",
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
