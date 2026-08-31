"use client";

import { useEffect, useRef, useState } from "react";
import { useUIStore } from "@/store/useUIStore";
import { useChatStore } from "@/store/useChatStore";
import { Menu } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { Modal } from "@/components/ui/Modal";

export function Topbar() {
  const params = useParams();
  const currentId = (params?.id as string) || null;
  const { renameConversation } = useConversations(currentId);

  const toggleMobileSidebar = useUIStore((state) => state.toggleMobileSidebar);

  const conversations = useChatStore((state) => state.conversations);
  const activeTitle = conversations.find((c) => c.id === currentId)?.title || null;

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenameModalOpen) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 220);

      return () => window.clearTimeout(timer);
    }
  }, [isRenameModalOpen]);

  const handleRenameClick = () => {
    if (!currentId || !activeTitle) return;
    setDraftTitle(activeTitle);
    setIsRenameModalOpen(true);
  };

  const handleRenameSave = async () => {
    if (!currentId || !draftTitle.trim()) return;

    const nextTitle = draftTitle.trim();
    if (nextTitle === activeTitle) {
      setIsRenameModalOpen(false);
      return;
    }

    await renameConversation(currentId, nextTitle);
    setIsRenameModalOpen(false);
  };

  const handleRenameModalClose = () => {
    setIsRenameModalOpen(false);
    setDraftTitle(activeTitle || "");
  };

  return (
    <>
      <header className="h-14 px-4 flex items-center justify-between absolute top-0 left-0 w-full z-10 bg-base/90 backdrop-blur-3xl shadow-[0_0_15px_var(--bg-base)]">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface border border-border transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* title pill on desktop*/}
          {activeTitle && (
            <button
              type="button"
              onClick={handleRenameClick}
              className={clsx(
                "hidden md:flex items-center px-3 py-1.5 rounded-xl bg-surface transition-colors cursor-pointer border border-border",
                "hover:bg-elevated",
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
            onClick={handleRenameClick}
            className={clsx(
              "md:hidden absolute left-1/2 -translate-x-1/2 flex items-center px-3 py-1.5 rounded-xl bg-surface transition-colors cursor-pointer border border-border",
              "hover:bg-elevated",
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

      {currentId && activeTitle && (
        <Modal
          open={isRenameModalOpen}
          onClose={handleRenameModalClose}
          className="w-[90%] max-w-[450px]"
          closeButtonClassName="hidden"
        >
          <div className="px-5 pt-3 pb-5">
            <h2 className="mb-5 text-xl font-medium text-content-primary">
              Rename this chat
            </h2>

            <input
              ref={inputRef}
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleRenameSave();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  handleRenameModalClose();
                }
              }}
              className="w-full rounded-xl border border-border bg-transparent px-4 py-2 text-lg text-content-primary placeholder:text-content-muted outline-none focus:!border-accent"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleRenameModalClose}
                className="rounded-full cursor-pointer bg-base hover:bg-surface px-4 py-2 text-sm font-medium transition-all text-content-secondary hover:text-content-primary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRenameSave}
                className="rounded-full cursor-pointer bg-elevated hover:bg-surface px-4 py-2 text-sm font-medium text-content-primary transition-all"
              >
                Rename
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
