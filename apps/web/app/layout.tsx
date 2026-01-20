import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Agent Marketplace',
  description: 'Marketplace for AI agents.'
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
