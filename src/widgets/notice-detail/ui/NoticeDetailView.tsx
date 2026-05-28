'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Pencil, Trash2, UserCircle2 } from 'lucide-react';
import { Button } from '@zaemoru/react';
import { useDeleteNotice, useNotice } from '@/entities/notice';
import { BackHeader } from '@/shared/ui/BackHeader';
import { Card, CardBody } from '@/shared/ui/Card';
import { placeLabel } from '@/shared/constants/place';
import { formatDate, roleLabel } from '@/shared/lib/format';
import { NoticeImageGallery } from './NoticeImageGallery';

interface NoticeDetailViewProps {
  id: string;
}

export function NoticeDetailView({ id }: NoticeDetailViewProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useNotice(id);
  const deleteNotice = useDeleteNotice();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    deleteNotice.mutate(id, {
      onSuccess: () => {
        setConfirmDelete(false);
        router.replace('/notice');
      },
    });
  };

  return (
    <div className="-mx-6 -mt-8">
      <BackHeader
        title="공지 상세"
        fallbackHref="/notice"
        rightSlot={
          data?.isMe ? (
            <>
              <button
                type="button"
                onClick={() => router.push(`/notice?id=${id}`)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-body5 font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <Pencil size={14} /> 수정
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-body5 font-medium text-error-500 transition hover:bg-red-100"
              >
                <Trash2 size={14} /> 삭제
              </button>
            </>
          ) : null
        }
      />

      <div className="mx-auto max-w-3xl px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-7 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
            <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
          </div>
        ) : isError || !data ? (
          <Card>
            <CardBody>
              <p className="text-center text-body4 text-gray-700">
                공지를 불러오지 못했어요.
              </p>
            </CardBody>
          </Card>
        ) : (
          <article className="flex flex-col gap-6">
            <header className="flex flex-col gap-3">
              <h1 className="text-titleLarge text-gray-900">{data.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body5 text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <UserCircle2 size={14} />
                  {roleLabel(data.role)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {placeLabel(data.place)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(data.createdAt)}
                </span>
              </div>
            </header>

            {data.images && data.images.length > 0 && (
              <NoticeImageGallery images={data.images} />
            )}

            <div className="whitespace-pre-wrap text-body2 leading-relaxed text-gray-800">
              {data.content}
            </div>
          </article>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card">
            <h2 className="text-titleSmall text-gray-900">공지 삭제</h2>
            <p className="mt-2 text-body4 text-gray-600">
              삭제한 공지는 되돌릴 수 없어요. 정말 삭제할까요?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="medium"
                onClick={() => setConfirmDelete(false)}
                disabled={deleteNotice.isPending}
              >
                취소
              </Button>
              <Button
                variant="danger"
                size="medium"
                onClick={handleDelete}
                loading={deleteNotice.isPending}
                disabled={deleteNotice.isPending}
              >
                삭제하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
