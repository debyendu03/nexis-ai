import { create } from "zustand";
import { UIStore, Theme } from "@/types/index";

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  isSidebarOpen: true, 

  // Action   
  toggleSidebar: () =>set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
