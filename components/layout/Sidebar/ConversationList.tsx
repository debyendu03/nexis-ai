"use client";

import { Trash2 } from "lucide-react";
import clsx from "clsx";
import { Conversation } from "@/types";
import { useUIStore } from "@/store/useUIStore";
import { useShallow } from "zustand/shallow";

interface ConversationListProps {
  conversations: Conversation[];
  currentId: string | null;
  searchQuery: string;
  onSelect: (id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export function ConversationList({
  conversations,
  currentId,
  searchQuery,
  onSelect,
  onDelete,
}: ConversationListProps) {
  const { isSidebarOpen, theme } = useUIStore(
    useShallow((state) => ({
      isSidebarOpen: state.isSidebarOpen,
      theme: state.theme,
    })),
  );
  const isDark = theme === "dark";

  if (!isSidebarOpen) {
    return null;
  }
  return (
    <>
     <div className="px-4 pt-2 text-xs font-semibold text-content-primary tracking-widest uppercase  ">
        Recent
      </div>
    <div
      className="flex-1 overflow-y-auto px-2 pb-1 !scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-content-muted [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-content-muted"
      style={{
        scrollbarColor: isDark
          ? "rgb(71 85 105) transparent"
          : "rgb(203 213 225) transparent",
      }}
    >
     

      {conversations.length === 0 ? (
        <div className="px-3 py-8 text-center text-sm text-content-secondary">
          {searchQuery ? "No matching chats." : "No conversations yet."}
        </div>
      ) : (
        <div className="flex flex-col gap-y-0">
          {conversations.map((conv) => {
            const isActive = currentId === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={clsx(
                  "group relative flex items-center justify-between px-2 py-2 rounded-xl text-sm cursor-pointer transition-all duration-150 text-content-primary",
                  isActive
                    ? "bg-surface font-medium"
                    : "hover:font-medium hover:bg-surface",
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
      )}
      </div>
    </>
      
  );
}
