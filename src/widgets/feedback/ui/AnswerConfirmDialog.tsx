'use client';

import { useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@zaemoru/react';

interface AnswerConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nickname: string;
  isEdit: boolean;
  pending: boolean;
}

export function AnswerConfirmDialog({
  open,
  onClose,
  onConfirm,
  nickname,
  isEdit,
  pending,
}: AnswerConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="답변 저장"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-main-100 text-main-600">
              <Bell size={18} />
            </span>
            <h2 className="text-titleSmall text-gray-900">
              {isEdit ? '답변 수정' : '답변 저장'}
            </h2>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-body4 text-gray-700">
          저장하면 <span className="font-semibold">{nickname}</span>님에게 앱
          알림이 전송되고, 상태가 &lsquo;답변 완료&rsquo;로 바뀌어요.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            size="medium"
            onClick={onClose}
            disabled={pending}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={onConfirm}
            loading={pending}
            disabled={pending}
          >
            저장하고 알림 보내기
          </Button>
        </div>
      </div>
    </div>
  );
}
