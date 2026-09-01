"use client";

import { Trash2 } from "lucide-react";
import clsx from "clsx";
import { Conversation } from "@/types";
import { useUIStore } from "@/store/useUIStore";
import { useUser } from "@clerk/nextjs";

interface ConversationListProps {
  conversations: Conversation[];
  currentId: string | null;
  searchQuery: string;
  onSelect: (id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  isSearchModalOpen?: boolean;
  isLoadingConversations?: boolean;
}

export function ConversationList({
  conversations,
  currentId,
  searchQuery,
  onSelect,
  onDelete,
  isSearchModalOpen = false,
  isLoadingConversations = true,
}: ConversationListProps) {
  const { isLoaded, isSignedIn } = useUser();
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  if (!isLoaded) return null;
  if (!isSignedIn) return null;
  if (!isSidebarOpen && !isSearchModalOpen) return null;

  const renderContent = () => {
    if (isLoadingConversations) {
      return (
        <div className="flex flex-col gap-y-0.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-9 rounded-xl bg-surface animate-pulse" />
          ))}
        </div>
      );
    }

    if (conversations.length === 0) {
      return (
        <div className="px-3 py-8 text-center text-sm font-medium text-content-secondary">
          {searchQuery ? "No matching chats." : "No conversations yet."}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-y-0">
        {conversations.map((conv) => {
          const isActive = currentId === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={clsx(
                "group relative flex items-center justify-between px-2 py-2 rounded-xl text-sm cursor-pointer transition-all duration-150",
                isActive
                  ? "bg-surface font-medium text-content-primary"
                  : "hover:font-medium hover:bg-surface text-content-primary",
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="truncate">{conv.title}</span>
              </div>

              <button
                type="button"
                onClick={(e) => onDelete(e, conv.id)}
                title="Delete chat"
                aria-label={`Delete ${conv.title}`}
                className="absolute top-1/2 right-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 rounded-xl text-content-muted hover:text-danger bg-surface hover:bg-elevated transition-all shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="px-4 pt-2 text-xs font-semibold text-content-primary tracking-widest uppercase">
        Recent
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-1 scrollbar-themed">
        {renderContent()}
      </div>
    </>
  );
}