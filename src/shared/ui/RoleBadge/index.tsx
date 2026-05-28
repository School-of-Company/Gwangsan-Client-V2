import { cn } from '@/shared/lib/cn';
import {
  MEMBER_ROLE_KOR,
  type MemberRole,
} from '@/shared/constants/role';

const ROLE_STYLES: Record<MemberRole, string> = {
  ROLE_HEAD_ADMIN: 'bg-sub-100 text-sub-700',
  ROLE_PLACE_ADMIN: 'bg-main-100 text-main-700',
  ROLE_USER: 'bg-gray-100 text-gray-700',
};

interface RoleBadgeProps {
  role: MemberRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-caption font-medium',
        ROLE_STYLES[role],
        className,
      )}
    >
      {MEMBER_ROLE_KOR[role]}
    </span>
  );
}
