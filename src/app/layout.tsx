import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import { AppHeader } from '@/widgets/app-shell/ui/AppHeader';
import './globals.css';

export const metadata: Metadata = {
  title: '광산 어드민',
  description: '광산구 시민 화폐 광산의 어드민 콘솔 V2',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex h-screen flex-col overflow-hidden bg-white antialiased">
        <Providers>
          <AppHeader />
          <main className="mx-auto w-full max-w-[1400px] flex-1 min-h-0 overflow-y-auto px-6 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
