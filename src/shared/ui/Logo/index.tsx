import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/shared/lib/cn';

interface LogoProps {
  href?: string;
  className?: string;
}

export function Logo({ href = '/main', className }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="광산 어드민 홈"
      className={cn('inline-flex items-center', className)}
    >
      <Image
        src="/text-logo.png"
        alt="광산"
        width={156}
        height={28}
        priority
        className="h-7 w-auto"
      />
    </Link>
  );
}
