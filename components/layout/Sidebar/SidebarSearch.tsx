"use client";

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import clsx from "clsx";
import { useUIStore } from "@/store/useUIStore";
import { useUser } from "@clerk/nextjs";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
  isSearchModalOpen?: boolean;
  onSearchOpenModal?: () => void;
}

export function SidebarSearch({
  value,
  onChange,
  isSearchModalOpen = false,
  onSearchOpenModal,
}: SidebarSearchProps) {
  const { isLoaded, isSignedIn } = useUser();
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearchModalOpen) return;

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 230);

    return () => window.clearTimeout(focusTimer);
  }, [isSearchModalOpen]);

  if (!isLoaded || !isSignedIn) return null;

  if (!isSidebarOpen && !isSearchModalOpen) {
    return (
      <button
        type="button"
        aria-label="Search chats"
        onClick={onSearchOpenModal}
        className="flex items-center justify-center w-8.5 h-8.5 mx-auto rounded-xl cursor-pointer text-content-muted hover:bg-surface hover:text-content-primary transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-2 h-8.5 px-3 rounded-xl bg-base text-content-muted outline-1 outline-border",
        "hover:outline-accent hover:text-content-primary",
        "focus-within:text-content-primary focus-within:ring-1 focus-within:ring-accent focus-within:outline-transparent transition-colors",
        isSearchModalOpen && "w-full",
      )}
    >
      <Search className="w-3.5 h-3.5 shrink-0" />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search chats"
        className="w-full text-sm text-content-primary placeholder:text-content-muted focus:outline-none"
      />
    </div>
  );
}
