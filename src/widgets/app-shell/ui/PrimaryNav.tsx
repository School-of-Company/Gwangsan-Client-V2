'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/cn';

const NAV_ITEMS = [
  { href: '/main', label: '대시보드', match: ['/main', '/profile'] },
  { href: '/gwangsan', label: '광산 관리', match: ['/gwangsan'] },
  { href: '/notice', label: '공지', match: ['/notice', '/detail'] },
  { href: '/graph', label: '통계', match: ['/graph'] },
];

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="주 메뉴" className="flex items-center gap-1">
      {NAV_ITEMS.map(({ href, label, match }) => {
        const active = match.some((p) => pathname.startsWith(p));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative rounded-lg px-3 py-2 text-body4 font-medium transition-colors',
              active
                ? 'text-main-700 bg-main-100'
                : 'text-gray-700 hover:bg-gray-50',
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
