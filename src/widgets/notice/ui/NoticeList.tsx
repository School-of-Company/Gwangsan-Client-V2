'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileText, Megaphone, Search } from 'lucide-react';
import { useNotices } from '@/entities/notice';
import { Card, CardHeader } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { SearchInput } from '@/shared/ui/SearchInput';
import { cn } from '@/shared/lib/cn';

export function NoticeList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get('id');
  const [keyword, setKeyword] = useState('');
  const { data, isLoading } = useNotices();

  const filtered = useMemo(() => {
    if (!data) return [];
    const k = keyword.trim().toLowerCase();
    if (!k) return data;
    return data.filter(
      (n) =>
        n.title.toLowerCase().includes(k) ||
        n.content.toLowerCase().includes(k),
    );
  }, [data, keyword]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Megaphone size={18} className="text-main-600" />
          <h2 className="text-body1 text-gray-900">게시된 공지</h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-caption font-semibold text-gray-700">
            {data?.length ?? 0}
          </span>
        </div>
      </CardHeader>

      <div className="border-b border-gray-100 px-6 py-3">
        <SearchInput
          value={keyword}
          onChange={setKeyword}
          placeholder="제목 또는 내용 검색"
        />
      </div>

      <div className="max-h-[calc(100vh-280px)] min-h-0 flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={keyword ? <Search size={20} /> : <FileText size={20} />}
            title={keyword ? '검색 결과가 없어요' : '아직 작성된 공지가 없어요'}
            description={keyword ? '다른 키워드로 검색해 보세요.' : '오른쪽에서 공지를 작성해 보세요.'}
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {filtered.map((n) => {
              const isActive = String(n.id) === activeId;
              return (
                <li key={n.id}>
                  <div
                    className={cn(
                      'group rounded-xl border bg-white p-4 transition',
                      isActive
                        ? 'border-main-500 ring-1 ring-main-300'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/detail/${n.id}`}
                        className="flex-1 min-w-0"
                      >
                        <h3 className="line-clamp-1 text-body3 text-gray-900 group-hover:text-main-700">
                          {n.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-body5 text-gray-600">
                          {n.content}
                        </p>
                      </Link>
                      <button
                        type="button"
                        onClick={() => router.push(`/notice?id=${n.id}`)}
                        className="rounded-lg border border-gray-200 px-2.5 py-1 text-caption font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                      >
                        수정
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
