import { create } from "zustand";
import { UIStore, Theme } from "@/types/index";

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  isSidebarOpen: true,
  theme: "light", // Default theme

  // Actions
  toggleSidebar: () =>set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

//   setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),

  toggleTheme: () =>
    set((state) => {
      const updateTheme: Theme = state.theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(updateTheme);
        localStorage.setItem("nexis-theme", updateTheme);
      }
      return { theme: updateTheme };
    }),
}));
