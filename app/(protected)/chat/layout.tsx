import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { SidebarBackdrop } from '@/components/layout/Sidebar/SidebarBackdrop';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex text-content-primary overflow-hidden relative">
      <SidebarBackdrop />
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 border border-blue-500 relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto relative flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}