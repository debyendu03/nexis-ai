"use client";

import { useUIStore } from "@/store/useUIStore";
import { useUser, UserButton } from "@clerk/nextjs"; 
import clsx from "clsx";
import { ThemeToggleButton } from "@/components/providers/ThemeToggleButton";

export function SidebarUser() {
  const { user, isSignedIn } = useUser();

  const isSidebarOpen  = useUIStore((state)=>state.isSidebarOpen);
 
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

  // User information
  const userName = isSignedIn ? user?.fullName || "User" : "Guest Mode";

  const userStatus = isSignedIn ? "Full Access" : "Limited Access";

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

            <span className="text-xs text-content-muted">{userStatus}</span>
          </div>
        )}
      </div>

      {/* Theme */}
      <ThemeToggleButton />
    </div>
  );
}
