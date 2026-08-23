'use client';

import { useUIStore } from '@/store/useUIStore';

export function SidebarBackdrop() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  if (!isSidebarOpen) return null;

  return (
    <div
      onClick={toggleSidebar}
      className="fixed inset-0 bg-black/90 z-30 md:hidden"
    />
  );
}