"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() =>setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
      className="text-content-primary transition-colors cursor-pointer w-8.5 h-8.5 p-2 rounded-xl flex items-center justify-center rounded-xl bg-elevated hover:bg-surface"
    > <Moon className="w-4 h-4 text-accent dark:hidden" />
      <Sun className="w-4 h-4 text-yellow-400 hidden dark:block" /> 
    </button>
  );
}
