"use client";

import { useUIStore } from "@/store/useUIStore";
import { Plus } from "lucide-react";
import clsx from "clsx";

export function NewChatButton({ onClick }: {onClick: () => void}) {

  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  return (
    <button
      type="button"
      onClick={onClick}
      title={!isSidebarOpen ? "New Chat" : undefined}
      aria-label="Start a new chat"
      className={clsx(
        "rounded-xl bg-accent hover:opacity-80 hover:font-medium text-white flex items-center justify-center shadow-accent-glow transition-all duration-300 ease-in-out cursor-pointer",
        isSidebarOpen
          ? "w-full h-9 font-medium text-base gap-2"
          : "w-8 h-8 mx-auto px-0 gap-0"
      )}
    >
      <Plus className="w-4 h-4 shrink-0 font-bold" />

      <span
        className={clsx(
          "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
          isSidebarOpen
            ? "max-w-[5rem] opacity-100"
            : "pointer-events-none max-w-0 opacity-0"
        )}
        aria-hidden={!isSidebarOpen}
      >
        New Chat
      </span>
    </button>
  );
}