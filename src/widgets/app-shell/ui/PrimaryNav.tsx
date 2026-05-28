'use client';

import { useEffect, useMemo, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Tab } from '@zaemoru/react';

const NAV_ITEMS = [
  { href: '/main', label: '대시보드', match: ['/main', '/profile'] },
  { href: '/gwangsan', label: '광산 관리', match: ['/gwangsan'] },
  { href: '/notice', label: '공지', match: ['/notice', '/detail'] },
  { href: '/graph', label: '통계', match: ['/graph'] },
];

export function PrimaryNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const items = useMemo(
    () => NAV_ITEMS.map(({ href, label }) => ({ value: href, label })),
    [],
  );

  const active = useMemo(() => {
    const matched = NAV_ITEMS.find((item) =>
      item.match.some((p) => pathname.startsWith(p)),
    );
    return matched?.href;
  }, [pathname]);

  useEffect(() => {
    NAV_ITEMS.forEach((item) => router.prefetch(item.href));
  }, [router]);

  return (
    <div className="min-w-max">
      <Tab
        items={items}
        value={active}
        variant="underline"
        onChange={(value) => {
          if (value && value !== pathname) {
            startTransition(() => router.push(value));
          }
        }}
      />
    </div>
  );
}
