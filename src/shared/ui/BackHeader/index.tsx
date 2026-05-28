'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface BackHeaderProps {
  title?: string;
  rightSlot?: React.ReactNode;
  fallbackHref?: string;
  className?: string;
}

export function BackHeader({
  title,
  rightSlot,
  fallbackHref,
  className,
}: BackHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else if (fallbackHref) router.push(fallbackHref);
  };

  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b border-gray-100 bg-white/90 px-4 backdrop-blur-md',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로 가기"
          className="-ml-2 rounded-full p-2 text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        {title && (
          <h1 className="text-body1 font-semibold text-gray-900">{title}</h1>
        )}
      </div>
      {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
    </div>
  );
}
