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
      <div className="mx-auto flex min-h-16 max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:grid lg:h-16 lg:grid-cols-[1fr_auto_1fr] lg:flex-nowrap lg:py-0">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="order-3 w-full overflow-x-auto lg:order-none lg:flex lg:w-auto lg:justify-center lg:overflow-visible">
          <PrimaryNav />
        </div>
        <div className="ml-auto flex justify-end lg:ml-0">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
