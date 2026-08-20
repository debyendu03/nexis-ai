import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
// import { Navbar } from '@/components/Navbar';

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
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  var theme = localStorage.getItem('nexis-theme') || 'light';
                  document.documentElement.className = theme;
                } catch(e) {
                  document.documentElement.className = 'light';
                }
              `,
            }}
          />
        </head>
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-base text-content-primary antialiased selection:bg-accent/30 selection:text-white`}
        >
          {/* <Navbar /> */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}