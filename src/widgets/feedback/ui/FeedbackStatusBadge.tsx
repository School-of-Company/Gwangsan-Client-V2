import { cn } from '@/shared/lib/cn';
import {
  FEEDBACK_STATUS_KOR,
  type FeedbackStatus,
} from '@/shared/types/feedback';

// 답변이 필요한 "접수"가 가장 눈에 띄도록 색을 줘요.
const STATUS_STYLES: Record<FeedbackStatus, string> = {
  RECEIVED: 'bg-red-50 text-error-500',
  IN_PROGRESS: 'bg-sub2-100 text-sub2-700',
  DONE: 'bg-main-100 text-main-700',
};

const DOT_STYLES: Record<FeedbackStatus, string> = {
  RECEIVED: 'bg-error-500',
  IN_PROGRESS: 'bg-sub2-500',
  DONE: 'bg-main-500',
};

interface FeedbackStatusBadgeProps {
  status: FeedbackStatus;
  className?: string;
}

export function FeedbackStatusBadge({
  status,
  className,
}: FeedbackStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-caption font-medium',
        STATUS_STYLES[status],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mr-1.5 inline-block h-1.5 w-1.5 rounded-full',
          DOT_STYLES[status],
        )}
      />
      {FEEDBACK_STATUS_KOR[status]}
    </span>
  );
}
