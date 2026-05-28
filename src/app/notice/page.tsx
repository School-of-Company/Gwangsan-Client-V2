import { Suspense } from 'react';
import { NoticeList } from '@/widgets/notice/ui/NoticeList';
import { NoticeWriter } from '@/widgets/notice/ui/NoticeWriter';

export const metadata = { title: '공지 · 광산 어드민' };

export default function NoticePage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <header className="flex-shrink-0">
        <h1 className="text-titleMedium2 text-gray-900">공지</h1>
        <p className="text-body5 text-gray-600">
          지점별로 공지를 작성하고 관리해요.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="flex-1 animate-pulse rounded-2xl bg-gray-50" />
        }
      >
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,_420px)_minmax(0,_1fr)]">
          <NoticeList />
          <NoticeWriter />
        </div>
      </Suspense>
    </div>
  );
}
