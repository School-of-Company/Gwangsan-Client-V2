'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Calendar,
  ChevronRight,
  MapPin,
  Smartphone,
  Tag,
  UserCircle2,
  X,
} from 'lucide-react';
import { Button } from '@zaemoru/react';
import {
  useAdminFeedback,
  useAnswerFeedback,
  useUpdateFeedbackStatus,
} from '@/entities/feedback';
import { BackHeader } from '@/shared/ui/BackHeader';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { formatDateTime } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';
import {
  FEEDBACK_STATUS_KOR,
  FEEDBACK_TYPE_KOR,
  OS_TYPE_KOR,
  type FeedbackImage,
  type FeedbackStatusUpdate,
} from '@/shared/types/feedback';
import { AnswerConfirmDialog } from './AnswerConfirmDialog';
import { FeedbackStatusBadge } from './FeedbackStatusBadge';

const ANSWER_MAX = 1000;
const STATUS_ACTIONS: FeedbackStatusUpdate[] = ['IN_PROGRESS', 'DONE'];

interface FeedbackDetailViewProps {
  id: string;
}

export function FeedbackDetailView({ id }: FeedbackDetailViewProps) {
  const feedbackId = Number(id);
  const { data, isLoading, isError } = useAdminFeedback(feedbackId);
  const answerMutation = useAnswerFeedback();
  const statusMutation = useUpdateFeedbackStatus();
  const [answer, setAnswer] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [preview, setPreview] = useState<FeedbackImage | null>(null);

  // 저장된 답변이 바뀌면(최초 로드·저장 후) 입력창도 맞춰요.
  const savedAnswer = data?.answer ?? '';
  useEffect(() => {
    setAnswer(savedAnswer);
  }, [savedAnswer]);

  const trimmed = answer.trim();
  const canSave = !!trimmed && trimmed !== savedAnswer.trim();

  const handleSave = () => {
    answerMutation.mutate(
      { feedbackId, answer: trimmed },
      { onSuccess: () => setConfirmOpen(false) },
    );
  };

  return (
    <div className="-mx-6 -mt-8">
      <BackHeader title="문의 상세" fallbackHref="/feedback" />

      <div className="mx-auto max-w-3xl px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-7 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
            <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
          </div>
        ) : isError || !data ? (
          <Card>
            <CardBody>
              <p className="text-center text-body4 text-gray-700">
                문의를 불러오지 못했어요.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <FeedbackStatusBadge status={data.status} />
                <span className="inline-flex items-center gap-1.5 text-body5 text-gray-600">
                  <Tag size={14} />
                  {FEEDBACK_TYPE_KOR[data.type] ?? data.type}
                </span>
                <span className="inline-flex items-center gap-1.5 text-body5 text-gray-600">
                  <Calendar size={14} />
                  {formatDateTime(data.createdAt)}
                </span>
              </div>
              <div className="whitespace-pre-wrap text-body2 leading-relaxed text-gray-800">
                {data.content}
              </div>
            </header>

            {data.images && data.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.images.map((image, i) => (
                  <button
                    key={image.imageId}
                    type="button"
                    onClick={() => setPreview(image)}
                    aria-label={`첨부 이미지 ${i + 1} 크게 보기`}
                    className="relative h-32 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 transition hover:opacity-90"
                  >
                    <Image
                      src={image.imageUrl}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="py-3">
                  <h2 className="inline-flex items-center gap-1.5 text-body3 text-gray-900">
                    <UserCircle2 size={16} className="text-main-600" />
                    작성자
                  </h2>
                </CardHeader>
                <CardBody className="flex flex-col gap-2 py-4">
                  <p className="text-body4 font-semibold text-gray-900">
                    {data.member.nickname}
                  </p>
                  {data.member.placeName ? (
                    <p className="inline-flex items-center gap-1.5 text-body5 text-gray-600">
                      <MapPin size={14} />
                      {data.member.placeName}
                    </p>
                  ) : null}
                  <Link
                    href={`/profile/${data.member.memberId}`}
                    className="mt-1 inline-flex items-center gap-0.5 self-start text-body5 font-medium text-main-700 hover:underline"
                  >
                    회원 상세 보기 <ChevronRight size={14} />
                  </Link>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <h2 className="inline-flex items-center gap-1.5 text-body3 text-gray-900">
                    <Smartphone size={16} className="text-main-600" />
                    기기 정보
                  </h2>
                </CardHeader>
                <CardBody className="py-4">
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-body5">
                    <dt className="text-gray-500">앱 버전</dt>
                    <dd className="text-gray-900">{data.appVersion || '-'}</dd>
                    <dt className="text-gray-500">OS</dt>
                    <dd className="text-gray-900">
                      {data.osType
                        ? (OS_TYPE_KOR[data.osType] ?? data.osType)
                        : '-'}
                      {data.osVersion ? ` ${data.osVersion}` : ''}
                    </dd>
                    <dt className="text-gray-500">기기 모델</dt>
                    <dd className="text-gray-900">{data.deviceModel || '-'}</dd>
                  </dl>
                </CardBody>
              </Card>
            </div>

            <Card>
              <CardHeader className="py-3">
                <h2 className="text-body3 text-gray-900">상태 변경</h2>
                <div className="flex gap-2">
                  {STATUS_ACTIONS.map((status) => {
                    const active = data.status === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        disabled={active || statusMutation.isPending}
                        onClick={() =>
                          statusMutation.mutate({ feedbackId, status })
                        }
                        className={cn(
                          'rounded-lg border px-3 py-1.5 text-body5 font-medium transition',
                          active
                            ? 'border-main-500 bg-main-100 text-main-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
                          statusMutation.isPending && 'opacity-60',
                        )}
                      >
                        {FEEDBACK_STATUS_KOR[status]}
                      </button>
                    );
                  })}
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <h2 className="text-body3 text-gray-900">답변</h2>
                {data.answeredAt ? (
                  <span className="text-caption text-gray-500">
                    {formatDateTime(data.answeredAt)}
                    {data.answeredBy ? ` · ${data.answeredBy}` : ''}
                  </span>
                ) : null}
              </CardHeader>
              <CardBody className="flex flex-col gap-3">
                <textarea
                  value={answer}
                  onChange={(e) =>
                    setAnswer(e.target.value.slice(0, ANSWER_MAX))
                  }
                  placeholder="작성자에게 보낼 답변을 입력하세요"
                  rows={6}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-body4 text-gray-900 transition placeholder:text-gray-400 focus:border-main-500 focus:outline-none focus:ring-2 focus:ring-main-100"
                />
                <div className="flex items-center justify-between">
                  <span className="text-caption text-gray-500">
                    {answer.length} / {ANSWER_MAX}
                  </span>
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => setConfirmOpen(true)}
                    disabled={!canSave || answerMutation.isPending}
                  >
                    {data.answer ? '답변 수정' : '답변 저장'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>

      <AnswerConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSave}
        nickname={data?.member.nickname ?? ''}
        isEdit={!!data?.answer}
        pending={answerMutation.isPending}
      />

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="첨부 이미지"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setPreview(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
          <div className="relative h-[90vh] w-full max-w-3xl">
            <Image
              src={preview.imageUrl}
              alt="첨부 이미지"
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
