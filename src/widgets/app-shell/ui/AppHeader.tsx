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
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-6">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex justify-center">
          <PrimaryNav />
        </div>
        <div className="flex justify-end">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
