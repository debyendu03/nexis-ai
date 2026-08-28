"use client";

import { useUIStore } from "@/store/useUIStore";
import { CircleAlert, Plus } from "lucide-react";
import clsx from "clsx";
import { useClerk, useUser } from "@clerk/nextjs";

export function NewChatButton({ onClick }: { onClick: () => void }) {
  const { isSignedIn, isLoaded } = useUser();
  const { redirectToSignIn } = useClerk();

  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    const signInLink = (
      <a
        href="#sign-in"
        onClick={(event) => {
          event.preventDefault();
          redirectToSignIn();
        }}
        className="underline transition-colors hover:text-accent"
      >
        Sign in
      </a>
    );

    return (
      <div
        className={clsx(
          "flex items-center justify-center gap-2 text-md text-primary",
          isSidebarOpen ? "w-full" : "mx-auto h-8.5 w-8.5",
        )}
        title={!isSidebarOpen ? "Sign in to save activity" : undefined}
      >
        {!isSidebarOpen ? (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              void redirectToSignIn();
            }}
            aria-label="Sign in to save activity"
            className="flex items-center justify-center w-8.5 h-8.5 mx-auto rounded-xl cursor-pointer text-content-muted hover:bg-surface hover:text-content-primary transition-colors"
          >
            <CircleAlert className="h-4 w-4 shrink-0 " aria-hidden="true" />
          </button>
        ) : (
          <>
            <span className="whitespace-nowrap">
              {signInLink} to save activity
            </span>
          </>
        )}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={!isSidebarOpen ? "New Chat" : undefined}
      aria-label="Start a new chat"
      className={clsx(
        "rounded-xl bg-accent hover:opacity-80 hover:font-medium text-white flex items-center justify-center shadow-accent-glow transition-colors cursor-pointer",
        isSidebarOpen
          ? "w-full h-8.5 font-medium text-white gap-2"
          : "w-8.5 h-8.5 mx-auto px-0 gap-0",
      )}
    >
      <Plus className="w-4 h-4 shrink-0 font-bold" />

      <span
        className={clsx(
          "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
          isSidebarOpen
            ? "max-w-[5rem] opacity-100"
            : "pointer-events-none max-w-0 opacity-0",
        )}
        aria-hidden={!isSidebarOpen}
      >
        New Chat
      </span>
    </button>
  );
}
