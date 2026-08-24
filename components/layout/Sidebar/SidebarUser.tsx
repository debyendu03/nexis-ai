"use client";

import { useUIStore } from "@/store/useUIStore";
import { useUser, UserButton } from "@clerk/nextjs";
import { Sun, Moon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import clsx from "clsx";

export function SidebarUser() {
  const { user, isSignedIn } = useUser();

  const { isSidebarOpen, toggleTheme, theme } = useUIStore(
    useShallow((state) => ({
      isSidebarOpen: state.isSidebarOpen,
      toggleTheme: state.toggleTheme,
      theme: state.theme,
    })),
  );

  const isDark = theme === "dark";

  // Layout
  const containerClass = clsx(
    "border-t border-border shrink-0",
    isSidebarOpen
      ? "px-4 py-4 flex items-center justify-between gap-3"
      : "px-1 py-4 flex flex-col-reverse items-center gap-3",
  );

  const userSectionClass = clsx(
    "flex items-center min-w-0",
    isSidebarOpen ? "gap-2.5 overflow-hidden" : "justify-center",
  );

  const themeButtonClass = "text-content-primary transition-colors cursor-pointer w-8.5 h-8.5 p-2 rounded-xl flex items-center justify-center rounded-xl bg-elevated hover:bg-surface"

  // User information
  const userName = isSignedIn ? user?.fullName || "User" : "Guest Mode";

  const userStatus = isSignedIn ? "Full Access" : "3 chats free";

  return (
    <div className={containerClass}>
      {/* User */}
      <div className={userSectionClass}>
        {isSignedIn ? (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "!w-8.5 !h-8.5",
              },
            }}
          />
        ) : (
          <div className="!w-8.5 !h-8.5 rounded-full bg-accent text-white font-bold flex items-center justify-center text-xs shrink-0">
            NX
          </div>
        )}

        {isSidebarOpen && (
          <div className="flex flex-col min-w-0 gap-0 overflow-hidden whitespace-nowrap">
            <span className="text-sm font-semibold text-content-primary truncate">
              {userName}
            </span>

            <span className="text-xs text-content-muted">
              {userStatus}
            </span>
          </div>
        )}
      </div>

      {/* Theme */}
      <button
        type="button"
        onClick={toggleTheme}
        title="Toggle theme"
        aria-label="Toggle theme"
        className={themeButtonClass}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-yellow-400" />
        ) : (
          <Moon className="w-4 h-4 text-accent" />
        )}
      </button>
    </div>
  );
}
