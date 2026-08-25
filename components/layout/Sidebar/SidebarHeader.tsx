"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import clsx from "clsx";
import { useShallow } from "zustand/react/shallow";
import Image from "next/image";
import { useUIStore } from "@/store/useUIStore";

export function SidebarHeader() {
  const { isSidebarOpen, toggleSidebar} = useUIStore(
    useShallow((state) => ({
      isSidebarOpen: state.isSidebarOpen,
      toggleSidebar: state.toggleSidebar
    })),
  );

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
          {/* Light theme logo */}
          <Image
            src={
              isSidebarOpen
                ? "/full-nexis-light-theme-logo.png"
                : "/nexis-logo.png"
            }
            alt="Nexis logo"
            width={200}
            height={50}
            priority
            className={clsx(
              "object-contain dark:hidden",
              isSidebarOpen ? "h-8.5 w-auto" : "w-8 h-8.5",
            )}
          />

          {/* dark theme logo */}
          <Image
            src={
              isSidebarOpen
                ? "/full-nexis-dark-theme-logo.png"
                : "/nexis-logo.png"
            }
            alt=""
            aria-hidden="true"
            width={200}
            height={50}
            priority
            className={clsx(
              "object-contain hidden dark:block",
              isSidebarOpen ? "h-8.5 w-auto" : "w-8 h-8.5",
            )}
          />
        </Link>

        {/* Open sidebar button — desktop collapsed state only */}
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Open sidebar"
            aria-label="Open navigation sidebar"
            className="absolute inset-0 hidden md:flex items-center justify-center rounded-xl bg-surface opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer w-8.5 h-8.5"
          >
            <PanelLeftOpen className="w-4 h-4 text-content-primary" />
          </button>
        )}
      </div>

      {/* Close sidebar button — desktop only */}
      {isSidebarOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          title="Close sidebar"
          aria-label="Close navigation sidebar"
          className="hidden md:flex w-8.5 h-8.5 items-center justify-center rounded-xl hover:bg-surface text-content-secondary hover:text-content-primary transition-colors cursor-pointer"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
