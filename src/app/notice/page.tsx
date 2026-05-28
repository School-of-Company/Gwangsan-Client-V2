import { Suspense } from 'react';
import { NoticeList } from '@/widgets/notice/ui/NoticeList';
import { NoticeWriter } from '@/widgets/notice/ui/NoticeWriter';

export const metadata = { title: '공지 · 광산 어드민' };

export default function NoticePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-titleMedium2 text-gray-900">공지</h1>
        <p className="text-body4 text-gray-600">
          지점별로 공지를 작성하고 관리해요.
        </p>
      </div>

      <Suspense
        fallback={<div className="h-64 animate-pulse rounded-2xl bg-gray-50" />}
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,_420px)_minmax(0,_1fr)]">
          <NoticeList />
          <NoticeWriter />
        </div>
      </Suspense>
    </div>
  );
}
