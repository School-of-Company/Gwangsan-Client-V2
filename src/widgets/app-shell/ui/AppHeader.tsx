'use client';

import { usePathname } from 'next/navigation';
import { Logo } from '@/shared/ui/Logo';
import { PrimaryNav } from './PrimaryNav';
import { UserMenu } from './UserMenu';

const HIDDEN_PREFIXES = ['/signin', '/password'];

export function AppHeader() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <PrimaryNav />
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
