'use client';

import { useState } from 'react';
import { Button } from '@zaemoru/react';
import { Check, X } from 'lucide-react';
import { useChangeMemberStatus } from '@/entities/member';
import {
  MEMBER_STATUSES,
  MEMBER_STATUS_KOR,
  type MemberStatus,
} from '@/shared/types/member';
import { cn } from '@/shared/lib/cn';

interface StatusDialogProps {
  open: boolean;
  onClose: () => void;
  memberId: string;
  currentStatus: MemberStatus;
}

const STATUS_DESCRIPTION: Record<MemberStatus, string> = {
  ACTIVE: '서비스를 정상적으로 사용해요.',
  PENDING: '가입 승인을 기다리고 있어요.',
  SUSPENDED: '관리자 조치로 일시 정지 상태예요.',
  WITHDRAWN: '서비스를 탈퇴한 상태예요.',
};

export function StatusDialog({
  open,
  onClose,
  memberId,
  currentStatus,
}: StatusDialogProps) {
  const [status, setStatus] = useState<MemberStatus>(currentStatus);
  const mutation = useChangeMemberStatus();

  if (!open) return null;

  const handleSubmit = () => {
    mutation.mutate(
      { memberId, status },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-titleSmall text-gray-900">상태 변경</h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {MEMBER_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                'flex items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-left transition',
                status === s
                  ? 'border-main-500 bg-main-100/30'
                  : 'border-gray-200 hover:border-gray-300',
              )}
            >
              <div>
                <p className="text-body4 font-medium text-gray-900">
                  {MEMBER_STATUS_KOR[s]}
                </p>
                <p className="text-caption text-gray-600">
                  {STATUS_DESCRIPTION[s]}
                </p>
              </div>
              {status === s && (
                <Check size={16} className="text-main-700" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            size="medium"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={handleSubmit}
            loading={mutation.isPending}
            disabled={mutation.isPending}
          >
            변경
          </Button>
        </div>
      </div>
    </div>
  );
}
