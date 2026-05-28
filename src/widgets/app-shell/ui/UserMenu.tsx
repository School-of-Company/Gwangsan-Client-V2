'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ChevronDown, Loader2, LogOut, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/cn';
import { api } from '@/shared/lib/api';
import { clearAuth } from '@/shared/lib/auth';
import { authConfig } from '@/shared/config/auth';

export function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const deleteAccount = useMutation({
    mutationFn: () => api.delete('/member'),
    onSuccess: () => {
      clearAuth();
      toast.success('계정이 삭제되었어요.');
      router.replace(authConfig.signInPage);
    },
    onError: () => toast.error('계정 삭제에 실패했어요.'),
  });

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSignout = () => {
    clearAuth();
    toast.success('로그아웃되었어요.');
    router.replace(authConfig.signInPage);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-body4 font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50',
        )}
      >
        <span className="hidden sm:inline">관리자</span>
        <ChevronDown
          size={16}
          className={cn(
            'text-gray-500 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleSignout}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-body4 text-gray-800 hover:bg-gray-50"
          >
            <LogOut size={16} /> 로그아웃
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setConfirmDelete(true)}
            className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-3 text-left text-body4 text-error-500 hover:bg-gray-50"
          >
            <UserX size={16} /> 회원 탈퇴
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card">
            <h2 className="text-titleSmall text-gray-900">회원 탈퇴</h2>
            <p className="mt-2 text-body4 text-gray-600">
              계정을 정말 삭제할까요? 이 작업은 되돌릴 수 없어요.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleteAccount.isPending}
                className="rounded-lg border border-gray-200 px-4 py-2 text-body4 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => deleteAccount.mutate()}
                disabled={deleteAccount.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-error-500 px-4 py-2 text-body4 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteAccount.isPending && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                {deleteAccount.isPending ? '탈퇴 중…' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
