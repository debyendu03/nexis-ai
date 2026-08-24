import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nexis | Connect. Ask. Discover.',
  description: 'Intelligent, minimal AI companion powered by Gemini.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({children}: {children: React.ReactNode;}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning> 
        <body>
          <ThemeProvider>
          {children}
          </ThemeProvider> 
        </body>
      </html>
    </ClerkProvider>
  );
}