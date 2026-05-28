import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 px-4 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          {icon}
        </div>
      )}
      <h3 className="text-body3 text-gray-900">{title}</h3>
      {description && (
        <p className="text-body5 text-gray-600">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
