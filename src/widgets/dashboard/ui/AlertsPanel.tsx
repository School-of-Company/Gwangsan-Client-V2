'use client';

import { Bell, CheckCircle2, X } from 'lucide-react';
import { Button } from '@zaemoru/react';
import {
  REPORT_TYPE_KOR,
  useAcceptSignup,
  useAlerts,
  useCancelTrade,
  useDismissAlert,
} from '@/entities/alert';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { placeLabel } from '@/shared/constants/place';
import { formatDateTime } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';

type Section = 'signup' | 'report' | 'tradeCancel';

const SECTION_LABEL: Record<Section, string> = {
  signup: '가입 승인 요청',
  report: '신고 접수',
  tradeCancel: '거래 취소 요청',
};

export function AlertsPanel() {
  const { data, isLoading } = useAlerts();
  const accept = useAcceptSignup();
  const cancel = useCancelTrade();
  const dismiss = useDismissAlert();

  const signups = data?.signups ?? [];
  const reports = data?.reports ?? [];
  const tradeCancels = data?.tradeCancels ?? [];
  const total = signups.length + reports.length + tradeCancels.length;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-main-600" />
          <h2 className="text-body1 text-gray-900">알림</h2>
          <span className="rounded-full bg-main-100 px-2 py-0.5 text-caption font-semibold text-main-700">
            {isLoading ? '…' : total}
          </span>
        </div>
      </CardHeader>

      <div className="flex max-h-[680px] flex-col gap-5 overflow-y-auto px-6 py-5">
        {isLoading ? (
          <SkeletonList />
        ) : total === 0 ? (
          <EmptyState
            icon={<CheckCircle2 size={20} />}
            title="모든 알림을 처리했어요"
            description="새 가입 요청, 신고, 거래 취소가 도착하면 여기에서 알려드려요."
          />
        ) : (
          <>
            {signups.length > 0 && (
              <Section title={SECTION_LABEL.signup} count={signups.length}>
                {signups.map((s) => (
                  <AlertRow
                    key={s.id}
                    title={`${s.nickname}님이 가입을 요청했어요`}
                    meta={[
                      placeLabel(s.placeId),
                      `추천인: ${s.recommenderNickname || '없음'}`,
                      formatDateTime(s.created_at),
                    ]}
                    primaryAction={{
                      label: '승인',
                      onClick: () => accept.mutate(s.id),
                      loading: accept.isPending,
                    }}
                    onDismiss={() => dismiss.mutate(s.id)}
                  />
                ))}
              </Section>
            )}

            {reports.length > 0 && (
              <Section title={SECTION_LABEL.report} count={reports.length}>
                {reports.map((r) => (
                  <AlertRow
                    key={r.id}
                    title={`${REPORT_TYPE_KOR[r.report.reportType] ?? '신고'} · ${r.title}`}
                    description={r.report.content}
                    meta={[
                      placeLabel(r.placeId),
                      `신고자: ${r.nickname}`,
                      `대상: ${r.reportedMemberName}`,
                      formatDateTime(r.createdAt),
                    ]}
                    onDismiss={() => dismiss.mutate(r.id)}
                  />
                ))}
              </Section>
            )}

            {tradeCancels.length > 0 && (
              <Section
                title={SECTION_LABEL.tradeCancel}
                count={tradeCancels.length}
              >
                {tradeCancels.map((t) => (
                  <AlertRow
                    key={t.id}
                    title={`${t.product.title} 거래 취소 요청`}
                    description={t.reason}
                    meta={[
                      placeLabel(t.placeId),
                      `요청자: ${t.nickname}`,
                      formatDateTime(t.createdAt),
                    ]}
                    primaryAction={{
                      label: '취소 처리',
                      onClick: () => cancel.mutate(t.id),
                      loading: cancel.isPending,
                    }}
                    onDismiss={() => dismiss.mutate(t.id)}
                  />
                ))}
              </Section>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2 px-1">
        <h3 className="text-body3 text-gray-900">{title}</h3>
        <span className="text-caption text-gray-500">{count}건</span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

interface AlertRowProps {
  title: string;
  description?: string;
  meta: string[];
  primaryAction?: { label: string; onClick: () => void; loading?: boolean };
  onDismiss: () => void;
}

function AlertRow({
  title,
  description,
  meta,
  primaryAction,
  onDismiss,
}: AlertRowProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 transition hover:bg-gray-50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={cn('text-body3 text-gray-900')}>{title}</p>
          {description && (
            <p className="mt-1 line-clamp-2 text-body5 text-gray-700">
              {description}
            </p>
          )}
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-caption text-gray-500">
            {meta.filter(Boolean).map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>·</span>}
                <span>{m}</span>
              </span>
            ))}
          </p>
        </div>
        <button
          type="button"
          aria-label="닫기"
          onClick={onDismiss}
          className="-mr-1 -mt-1 rounded-full p-1.5 text-gray-500 hover:bg-gray-200/70"
        >
          <X size={16} />
        </button>
      </div>
      {primaryAction && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="primary"
            size="small"
            onClick={primaryAction.onClick}
            loading={primaryAction.loading}
            disabled={primaryAction.loading}
          >
            {primaryAction.label}
          </Button>
        </div>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-xl bg-gray-100"
          aria-hidden
        />
      ))}
    </div>
  );
}
