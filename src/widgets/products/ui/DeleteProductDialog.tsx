'use client';

import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@zaemoru/react';
import { useDeleteAdminProduct, productPlaceName } from '@/entities/product';
import type { Product } from '@/shared/types/product';

interface DeleteProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export function DeleteProductDialog({
  open,
  onClose,
  product,
}: DeleteProductDialogProps) {
  const mutation = useDeleteAdminProduct();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open || !product) return null;

  const handleSubmit = () => {
    mutation.mutate(product.id, { onSuccess: () => onClose() });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="게시글 삭제"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-error-500">
              <AlertTriangle size={18} />
            </span>
            <h2 className="text-titleSmall text-gray-900">게시글 삭제</h2>
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
          아래 게시글을 삭제할까요? 삭제하면 되돌릴 수 없어요.
        </p>

        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-body4 font-semibold text-gray-900">
            {product.title}
          </p>
          <p className="mt-1 text-caption text-gray-600">
            {product.member.nickname} · {productPlaceName(product)}
          </p>
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
            variant="danger"
            size="medium"
            onClick={handleSubmit}
            loading={mutation.isPending}
            disabled={mutation.isPending}
          >
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
