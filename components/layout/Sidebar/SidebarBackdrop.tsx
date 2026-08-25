'use client';

import { useUIStore } from '@/store/useUIStore';

export function SidebarBackdrop() {
  const isMobileSidebarOpen = useUIStore((state) => state.isMobileSidebarOpen);
  const closeMobileSidebar = useUIStore((state) => state.closeMobileSidebar);

  if (!isMobileSidebarOpen) return null;

  return (
    <div
      onClick={closeMobileSidebar}
      className="fixed inset-0 bg-black/90 z-30 md:hidden"
    />
  );
}