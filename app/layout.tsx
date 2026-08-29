import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { SidebarBackdrop } from "@/components/layout/Sidebar/SidebarBackdrop";
import { GuestSessionGuard } from "@/components/providers/GuestSessionGuard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexis | Connect. Ask. Discover.",
  description: "Intelligent, minimal AI companion powered by Gemini.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <div className="h-screen w-full flex text-content-primary overflow-hidden relative">
            <ThemeProvider>
              <GuestSessionGuard />
              <SidebarBackdrop />
              <Sidebar />
              <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 relative">
                <Topbar />
                <main className="flex-1 relative flex flex-col min-h-0">
                  {children}
                </main>
              </div>
            </ThemeProvider>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
