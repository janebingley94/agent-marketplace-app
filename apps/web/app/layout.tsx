import './globals.css';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'Agent Marketplace',
  description: 'Marketplace for AI agents.',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <NuqsAdapter>
          <Providers>{children}</Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
