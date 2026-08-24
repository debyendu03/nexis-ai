"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import clsx from "clsx";
import { useShallow } from "zustand/react/shallow";

import { useUIStore } from "@/store/useUIStore";

export function SidebarHeader() {
  const { isSidebarOpen, toggleSidebar, theme } = useUIStore(
    useShallow((state) => ({
      isSidebarOpen: state.isSidebarOpen,
      toggleSidebar: state.toggleSidebar,
      theme: state.theme,
    })),
  );

  const isDark = theme === "dark";

  // Logo sources
  const fullLogo = isDark ? "/full-nexis-dark-theme-logo.png" : "/full-nexis-light-theme-logo.png";
  const compactLogo = "/nexis-logo.png";

  const logoSrc = isSidebarOpen ? fullLogo : compactLogo;

  return (
    <div
      className={clsx(
        "flex items-center",
        isSidebarOpen ? "justify-between" : "justify-center",
      )}
    >
      {/* Logo */}
      <div className="relative group ">
        <Link
          href="/"
          title="Nexis Home"
          className="flex items-center justify-center"
        >
          <img
            src={logoSrc}
            alt="Nexis logo"
            className={clsx(
              "object-contain",
              isSidebarOpen ? "h-8 w-auto" : "w-8 h-8",
            )}
          />
        </Link>

        {/* Open sidebar button */}
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Open sidebar"
            aria-label="Open navigation sidebar"
            className="absolute inset-0 flex items-center justify-center rounded-xl bg-surface opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer w-8.5 h-8.5 "
          >
            <PanelLeftOpen className="w-4 h-4 text-content-primary" />
          </button>
        )}
      </div>

      {/* Close sidebar button */}
      {isSidebarOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          title="Close sidebar"
          aria-label="Close navigation sidebar"
          className="w-8.5 h-8.5 flex items-center justify-center rounded-xl bg-elevated hover:bg-surface text-content-secondary hover:text-content-primary transition-colors cursor-pointer"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}