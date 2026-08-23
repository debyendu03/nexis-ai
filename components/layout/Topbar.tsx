"use client";

import { useUIStore } from "@/store/useUIStore";
import { useChatStore } from "@/store/useChatStore";
import { Menu } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";
import clsx from "clsx"

export function Topbar() {
  const { renameConversation } = useConversations();

  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const activeTitle = conversations.find((c) => c.id === activeConversationId)?.title || null;

  const handleRename = () => {
    if (!activeConversationId || !activeTitle) return;

    const nextTitle = window.prompt("Rename conversation", activeTitle)?.trim();
    if (nextTitle && nextTitle !== activeTitle) {
      renameConversation(activeConversationId, nextTitle);
    }
  };

  return (
    <header className="h-14 px-4 flex items-center justify-between absolute top-0 left-0 w-full z-10 bg-transparent">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface border border-border transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* title pill on desktop*/}
        {activeTitle && (
          <button
            type="button"
            onClick={handleRename}
            className={clsx(
              "hidden md:flex items-center px-3 py-1.5 rounded-xl bg-surface transition-colors cursor-pointer border border-border",
              "hover:hover:bg-elevated"
            )}
            aria-label="Rename conversation"
          >
            <span className="text-sm font-semibold text-content-primary truncate max-w-[300px]">
              {activeTitle}
            </span>
          </button>
        )}
      </div>

      {/*title pill on mobile */}
      {activeTitle && (
        <button
          type="button"
          onClick={handleRename}
          className={clsx(
            "md:hidden absolute left-1/2 -translate-x-1/2 flex items-center px-3 py-1.5 rounded-xl bg-surface transition-colors cursor-pointer border border-border",
            "hover:bg-elevated"
          )}
          aria-label="Rename conversation"
        >
          <span className="text-sm font-semibold text-content-primary truncate max-w-[160px]">
            {activeTitle}
          </span>
        </button>
      )}

      {/* RIGHT — future buttons */}
      <div className="flex items-center gap-2"></div>
    </header>
  );
}
