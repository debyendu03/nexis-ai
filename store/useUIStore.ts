import { create } from "zustand";
import { UIStore } from "@/types/index";

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: true,
  isMobileSidebarOpen: false,
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
}));
