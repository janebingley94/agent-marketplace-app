import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'Agent Marketplace',
  description: 'Marketplace for AI agents.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
