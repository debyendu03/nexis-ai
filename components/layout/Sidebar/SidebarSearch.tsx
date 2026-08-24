"use client";

import { Search } from "lucide-react";
import clsx from "clsx";
import { useUIStore } from "@/store/useUIStore";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void; 
}

export function SidebarSearch({ value, onChange }: SidebarSearchProps) {
  
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  if (!isSidebarOpen) {
    return (
      <button
        type="button"
        aria-label="Search chats"
        className="flex items-center justify-center w-8 h-8 mx-auto rounded-xl cursor-pointer text-content-muted hover:bg-surface hover:text-content-primary transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-2 h-9 px-3 rounded-xl bg-base text-content-muted outline-1 outline-border","hover:outline-accent hover:text-content-primary","focus-within:text-content-primary focus-within:ring-1 focus-within:ring-accent focus-within:outline-transparent transition-colors ",
      )}
    >
      <Search className="w-3.5 h-3.5 shrink-0" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search chats"
        className="w-full text-sm text-content-primary placeholder:text-content-muted focus:outline-none"
      />
    </div>
  );
}