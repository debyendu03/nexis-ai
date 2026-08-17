import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#8b7cf8',        
          colorBackground: '#111115',       
          colorText: '#f0eff4',            
          colorTextSecondary: '#72718a',   
          colorInputBackground: '#18181d',  
          colorInputBorder: '#26262e',      
        },
      }}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-base text-content-primary antialiased selection:bg-accent/30 selection:text-white`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}