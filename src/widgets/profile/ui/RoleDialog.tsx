'use client';

import { useState } from 'react';
import { Button } from '@zaemoru/react';
import { Check, X } from 'lucide-react';
import { useChangeMemberRole } from '@/entities/member';
import {
  MEMBER_ROLE_KOR,
  MEMBER_ROLES,
  type MemberRole,
} from '@/shared/constants/role';
import { placeOptions } from '@/shared/constants/place';
import { Select } from '@/shared/ui/Select';
import { cn } from '@/shared/lib/cn';

interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  memberId: string;
  currentRole: MemberRole;
  currentPlaceId?: number;
}

export function RoleDialog({
  open,
  onClose,
  memberId,
  currentRole,
  currentPlaceId,
}: RoleDialogProps) {
  const [role, setRole] = useState<MemberRole>(currentRole);
  const [placeId, setPlaceId] = useState<string | undefined>(
    currentPlaceId ? String(currentPlaceId) : undefined,
  );
  const mutation = useChangeMemberRole();

  if (!open) return null;

  const handleSubmit = () => {
    mutation.mutate(
      {
        memberId,
        role,
        placeId:
          role === 'ROLE_PLACE_ADMIN' && placeId ? Number(placeId) : undefined,
      },
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
          <h2 className="text-titleSmall text-gray-900">역할 변경</h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-1 text-body5 text-gray-600">
          변경할 역할을 선택해주세요.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {MEMBER_ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                'flex items-center justify-between rounded-xl border bg-white px-4 py-3 text-left transition',
                role === r
                  ? 'border-main-500 bg-main-100/30'
                  : 'border-gray-200 hover:border-gray-300',
              )}
            >
              <span className="text-body4 font-medium text-gray-900">
                {MEMBER_ROLE_KOR[r]}
              </span>
              {role === r && <Check size={16} className="text-main-700" />}
            </button>
          ))}
        </div>

        {role === 'ROLE_PLACE_ADMIN' && (
          <div className="mt-4">
            <Select
              label="담당 지점"
              value={placeId}
              onChange={setPlaceId}
              options={placeOptions}
              placeholder="지점 선택"
            />
          </div>
        )}

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
