'use client';

import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@zaemoru/react';
import { useAdjustGwangsan } from '@/entities/member';
import type { Member } from '@/shared/types/member';
import { formatNumber } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';

interface AdjustModalProps {
  open: boolean;
  onClose: () => void;
  member: Member | null;
  mode: 'add' | 'subtract';
}

const QUICK_AMOUNTS = [10, 50, 100, 500, 1000];

export function AdjustModal({ open, onClose, member, mode }: AdjustModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const adjust = useAdjustGwangsan();

  useEffect(() => {
    if (!open) {
      setValue('');
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open || !member) return null;

  const numeric = Number(value || '0');
  const isAdd = mode === 'add';
  const accent = isAdd ? 'text-main-700' : 'text-error-500';
  const label = isAdd ? '추가' : '차감';
  const previewGwangsan = isAdd
    ? member.gwangsan + numeric
    : member.gwangsan - numeric;

  const handleSubmit = () => {
    if (!numeric || numeric <= 0) return;
    const payload = isAdd ? String(numeric) : `-${numeric}`;
    adjust.mutate(
      { memberId: member.memberId, gwangsan: payload },
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
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className={cn('text-titleSmall', accent)}>광산 {label}</h2>
            <p className="mt-1 text-body5 text-gray-600">
              {member.nickname} · 현재{' '}
              <span className="font-semibold text-gray-900 tabular-nums">
                {formatNumber(member.gwangsan)}
              </span>{' '}
              광산
            </p>
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

        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-3">
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full',
              isAdd
                ? 'bg-main-100 text-main-700'
                : 'bg-red-50 text-error-500',
            )}
          >
            {isAdd ? <Plus size={18} /> : <Minus size={18} />}
          </span>
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="0"
            className="w-full bg-transparent text-titleSmall text-gray-900 outline-none tabular-nums"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
          <span className="pr-1 text-body4 text-gray-500">광산</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setValue(String(numeric + amt))}
              className="rounded-full border border-gray-200 px-3 py-1 text-body5 text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              +{formatNumber(amt)}
            </button>
          ))}
        </div>

        {numeric > 0 && (
          <p className="mt-4 rounded-xl bg-gray-50 p-3 text-body5 text-gray-700">
            조정 후 잔액:{' '}
            <span className={cn('font-semibold tabular-nums', accent)}>
              {formatNumber(previewGwangsan)}
            </span>{' '}
            광산
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" size="medium" onClick={onClose}>
            취소
          </Button>
          <Button
            variant={isAdd ? 'primary' : 'danger'}
            size="medium"
            onClick={handleSubmit}
            disabled={!numeric || numeric <= 0 || adjust.isPending}
            loading={adjust.isPending}
          >
            {label}하기
          </Button>
        </div>
      </div>
    </div>
  );
}
