import { cn } from '@/shared/lib/cn';
import {
  MEMBER_STATUS_KOR,
  type MemberStatus,
} from '@/shared/types/member';

const STATUS_STYLES: Record<MemberStatus, string> = {
  ACTIVE: 'bg-main-100 text-main-700',
  PENDING: 'bg-sub2-100 text-sub2-700',
  SUSPENDED: 'bg-red-50 text-error-500',
  WITHDRAWN: 'bg-gray-100 text-gray-600',
};

interface StatusBadgeProps {
  status: MemberStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-caption font-medium',
        STATUS_STYLES[status],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mr-1.5 inline-block h-1.5 w-1.5 rounded-full',
          status === 'ACTIVE' && 'bg-main-500',
          status === 'PENDING' && 'bg-sub2-500',
          status === 'SUSPENDED' && 'bg-error-500',
          status === 'WITHDRAWN' && 'bg-gray-400',
        )}
      />
      {MEMBER_STATUS_KOR[status]}
    </span>
  );
}
