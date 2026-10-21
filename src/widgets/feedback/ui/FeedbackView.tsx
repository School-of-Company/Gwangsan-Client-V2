'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@zaemoru/react';
import { AxiosError } from 'axios';
import { useAdminFeedbackList } from '@/entities/feedback';
import { Card, CardHeader } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Select } from '@/shared/ui/Select';
import { placeOptions } from '@/shared/constants/place';
import { getRole } from '@/shared/lib/auth';
import { formatDateTime, formatNumber } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';
import {
  FEEDBACK_TYPE_KOR,
  feedbackStatusOptions,
  feedbackTypeOptions,
  type FeedbackStatus,
  type FeedbackType,
} from '@/shared/types/feedback';
import { FeedbackStatusBadge } from './FeedbackStatusBadge';

const ALL = '';

const requestErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status === 401)
      return '로그인이 만료되었어요. 다시 로그인해주세요. (401)';
    if (status === 403) return '조회 권한이 없는 계정이에요. (403)';
    if (status === 404) return '서버에 문의 관리 API가 없어요. (404)';
    if (status) return `요청이 실패했어요. (${status})`;
    if (error.code === 'ERR_NETWORK') {
      return 'API 서버에 연결할 수 없어요. NEXT_PUBLIC_API_URL을 확인해주세요.';
    }
  }
  return '잠시 후 다시 시도해주세요.';
};

export function FeedbackView() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [status, setStatus] = useState<string>(ALL);
  const [type, setType] = useState<string>(ALL);
  const [placeId, setPlaceId] = useState<string>(ALL);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getRole());
  }, []);

  // 지점 관리자는 자기 지점 문의와 모든 지점의 오류·버그 문의를 받아요. (범위는 서버가 정해요)
  const showPlaceFilter = role === 'ROLE_HEAD_ADMIN';

  const filter = useMemo(
    () => ({
      status: (status || undefined) as FeedbackStatus | undefined,
      type: (type || undefined) as FeedbackType | undefined,
      placeId: showPlaceFilter && placeId ? Number(placeId) : undefined,
    }),
    [placeId, showPlaceFilter, status, type],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAdminFeedbackList(filter);

  const feedbacks = useMemo(() => data?.pages.flat() ?? [], [data]);
  const hasFilter = !!status || !!type || !!filter.placeId;

  const open = (feedbackId: number) =>
    startTransition(() => router.push(`/feedback/${feedbackId}`));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-titleMedium2 text-gray-900">문의 관리</h1>
        <p className="text-body4 text-gray-600">
          앱에서 보낸 문의를 확인하고 답변해요. 답변을 저장하면 작성자에게
          알림이 가요.
        </p>
      </div>

      <div
        className={cn(
          'grid grid-cols-1 gap-3',
          showPlaceFilter ? 'md:grid-cols-3' : 'md:grid-cols-2',
        )}
      >
        <Select
          label="상태"
          value={status || undefined}
          onChange={setStatus}
          placeholder="전체 상태"
          options={[
            { value: ALL, label: '전체 상태' },
            ...feedbackStatusOptions,
          ]}
        />
        <Select
          label="문의유형"
          value={type || undefined}
          onChange={setType}
          placeholder="전체 유형"
          options={[{ value: ALL, label: '전체 유형' }, ...feedbackTypeOptions]}
        />
        {showPlaceFilter && (
          <Select
            label="지점"
            value={placeId || undefined}
            onChange={setPlaceId}
            placeholder="전체 지점"
            options={[{ value: ALL, label: '전체 지점' }, ...placeOptions]}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-main-600" />
            <h2 className="text-body1 text-gray-900">
              문의 {data ? formatNumber(feedbacks.length) : '…'}건
              {hasNextPage ? '+' : ''}
            </h2>
            {isFetching && !isLoading ? (
              <Loader2 size={14} className="animate-spin text-gray-400" />
            ) : null}
          </div>
        </CardHeader>

        {isLoading ? (
          <div className="flex flex-col gap-px p-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-md bg-gray-100"
              />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={<AlertCircle size={20} />}
            title="문의를 불러오지 못했어요"
            description={requestErrorMessage(error)}
            action={
              <Button
                variant="secondary"
                size="medium"
                onClick={() => void refetch()}
              >
                다시 시도
              </Button>
            }
          />
        ) : feedbacks.length === 0 ? (
          <EmptyState
            icon={<MessageSquare size={20} />}
            title="문의가 없어요"
            description={
              hasFilter ? '필터를 바꿔보세요.' : '아직 접수된 문의가 없어요.'
            }
          />
        ) : (
          <div className="max-h-[640px] overflow-auto border-t border-gray-100">
            <table className="w-full min-w-[880px]">
              <thead className="sticky top-0 z-[1] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                <tr className="text-left text-caption text-gray-600">
                  <th className="px-6 py-3 font-medium">접수일</th>
                  <th className="px-3 py-3 font-medium">문의유형</th>
                  <th className="px-3 py-3 font-medium">내용</th>
                  <th className="px-3 py-3 font-medium">작성자</th>
                  <th className="px-6 py-3 text-right font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr
                    key={feedback.feedbackId}
                    tabIndex={0}
                    onClick={() => open(feedback.feedbackId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') open(feedback.feedbackId);
                    }}
                    className={cn(
                      'cursor-pointer border-t border-gray-100 transition hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
                      feedback.status === 'RECEIVED' && 'bg-red-50/40',
                    )}
                  >
                    <td className="whitespace-nowrap px-6 py-3 text-body5 tabular-nums text-gray-700">
                      {formatDateTime(feedback.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-body5 text-gray-700">
                      {FEEDBACK_TYPE_KOR[feedback.type] ?? feedback.type}
                    </td>
                    <td className="max-w-[360px] px-3 py-3">
                      <p className="truncate text-body4 text-gray-900">
                        {feedback.content}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-body5 text-gray-700">
                      {feedback.member.nickname}
                      {feedback.member.placeName ? (
                        <span className="text-gray-500">
                          {' '}
                          · {feedback.member.placeName}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <FeedbackStatusBadge status={feedback.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasNextPage && !isLoading ? (
          <div className="flex justify-center border-t border-gray-100 px-6 py-4">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => void fetchNextPage()}
              loading={isFetchingNextPage}
              disabled={isFetchingNextPage}
            >
              더 보기
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
