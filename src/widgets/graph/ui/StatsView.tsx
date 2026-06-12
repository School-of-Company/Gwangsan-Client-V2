'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Download } from 'lucide-react';
import {
  STATS_PERIODS,
  downloadTradeExcel,
  useAllHeadsStats,
  useAllHeadsStatsByDateRange,
  useFilteredPlaceStats,
  useFilteredPlaceStatsByDateRange,
  usePlaceStats,
  usePlaceStatsByDateRange,
  type StatsPeriod,
} from '@/entities/stats';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Select } from '@/shared/ui/Select';
import { PLACES, HEAD_PLACES, headOptions, placeOptions } from '@/shared/constants/place';
import { formatNumber } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';

const StatsDoughnutChart = dynamic(
  () => import('./StatsDoughnutChart').then((mod) => mod.StatsDoughnutChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="h-48 w-48 animate-pulse rounded-full bg-gray-100" />
      </div>
    ),
  },
);

const PALETTE = [
  '#8FC31D',
  '#0075C2',
  '#F6AC01',
  '#3391CE',
  '#A5CF4A',
  '#F8BD34',
  '#005E9B',
  '#729C17',
  '#FACD67',
  '#66ACDA',
  '#BCDB77',
];

const ALL = '__all__';
const ALL_HEADS = '__all_heads__';

export function StatsView() {
  const [filterMode, setFilterMode] = useState<'period' | 'custom'>('period');
  const [period, setPeriod] = useState<StatsPeriod>('DAY');
  const [startDate, setStartDate] = useState<string>(
    () =>
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10),
  );
  const [endDate, setEndDate] = useState<string>(
    () =>
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10),
  );
  const [headIdRaw, setHeadIdRaw] = useState<string>(
    String(headOptions[0]?.value ?? 1),
  );
  const [placeIdRaw, setPlaceIdRaw] = useState<string>(ALL);

  const isAllHeads = headIdRaw === ALL_HEADS;
  const headId = isAllHeads ? undefined : Number(headIdRaw);

  // HEAD_PLACES 정적 매핑으로 현재 본점 소속 지점 ID 파악
  const currentPlaceIds = useMemo(
    () => (headId ? (HEAD_PLACES[headId] ?? []) : []),
    [headId],
  );

  const filteredPlaceOptions = useMemo(
    () => placeOptions.filter((opt) => currentPlaceIds.includes(Number(opt.value))),
    [currentPlaceIds],
  );

  const placeId = placeIdRaw !== ALL ? Number(placeIdRaw) : undefined;
  const isPlaceMode = !isAllHeads && !!placeId;
  const isCustom = filterMode === 'custom';

  // 본점이 바뀌면 지점 선택 초기화
  useEffect(() => {
    setPlaceIdRaw(ALL);
  }, [headIdRaw]);

  // 전체 본점 모드: 각 본점별 거래량 합산
  const allHeadsStats = useAllHeadsStats(period, isAllHeads && !isCustom);
  const allHeadsStatsByDate = useAllHeadsStatsByDateRange(
    startDate,
    endDate,
    isAllHeads && isCustom,
  );
  const activeAllHeadsStats = isCustom ? allHeadsStatsByDate : allHeadsStats;

  // 실제 count는 개별 지점 API로 조회 (head API의 tradeCount 버그 우회)
  const headStats = useFilteredPlaceStats(period, currentPlaceIds, !isPlaceMode && !isCustom && !isAllHeads);
  const placeStats = usePlaceStats(
    period,
    isPlaceMode && !isCustom ? placeId : undefined,
  );
  const headStatsByDate = useFilteredPlaceStatsByDateRange(
    startDate,
    endDate,
    currentPlaceIds,
    !isPlaceMode && isCustom && !isAllHeads,
  );
  const placeStatsByDate = usePlaceStatsByDateRange(
    startDate,
    endDate,
    isPlaceMode && isCustom ? placeId : undefined,
  );

  const activeHeadStats = isCustom ? headStatsByDate : headStats;
  const activePlaceStats = isCustom ? placeStatsByDate : placeStats;

  const { labels, values, totalCount } = useMemo(() => {
    if (isAllHeads && activeAllHeadsStats.data) {
      const data = activeAllHeadsStats.data;
      return {
        labels: data.map((d) => d.head.name),
        values: data.map((d) => d.tradeCount),
        totalCount: data.reduce((sum, d) => sum + d.tradeCount, 0),
      };
    }
    if (isPlaceMode && activePlaceStats.data) {
      const name = PLACES[placeId!] ?? '선택 지점';
      return {
        labels: [name],
        values: [activePlaceStats.data.count],
        totalCount: activePlaceStats.data.count,
      };
    }
    if (!isAllHeads && !isPlaceMode && activeHeadStats.data) {
      const data = activeHeadStats.data;
      return {
        labels: data.map((d) => d.place.name),
        values: data.map((d) => d.tradeCount),
        totalCount: data.reduce((sum, d) => sum + d.tradeCount, 0),
      };
    }
    return { labels: [] as string[], values: [] as number[], totalCount: 0 };
  }, [isAllHeads, isPlaceMode, activeAllHeadsStats.data, activePlaceStats.data, activeHeadStats.data, placeId]);

  const loading = isAllHeads
    ? activeAllHeadsStats.isLoading
    : isPlaceMode
      ? activePlaceStats.isLoading
      : activeHeadStats.isLoading;
  const fetching = isAllHeads
    ? activeAllHeadsStats.isFetching
    : isPlaceMode
      ? activePlaceStats.isFetching
      : activeHeadStats.isFetching;
  const isError = isAllHeads
    ? activeAllHeadsStats.isError
    : isPlaceMode
      ? activePlaceStats.isError
      : activeHeadStats.isError;
  const hasData = values.length > 0 && values.some((v) => v > 0);

  const periodLabel = isCustom ? `${startDate}~${endDate}` : period;
  const handleExcel = () => {
    if (loading || !hasData) return;
    let rows: { label: string; count: number }[];
    if (isAllHeads || isPlaceMode) {
      rows = labels.map((label, i) => ({ label, count: values[i] ?? 0 }));
    } else {
      const apiData = (isCustom ? headStatsByDate : headStats).data ?? [];
      const apiMap = new Map(
        apiData
          .filter((d) => d.place?.id != null)
          .map((d) => [d.place.id, d.tradeCount]),
      );
      rows = filteredPlaceOptions.map((opt) => ({
        label: opt.label,
        count: apiMap.get(Number(opt.value)) ?? 0,
      }));
    }
    downloadTradeExcel(periodLabel, headId ?? 0, rows);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-titleMedium2 text-gray-900">거래 통계</h1>
        <p className="text-body4 text-gray-600">
          기간과 본점·지점별 거래량을 한눈에 확인하고 엑셀로 받아볼 수 있어요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-label text-gray-700">기간</span>
          <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setFilterMode('period')}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-body5 font-medium transition',
                filterMode === 'period'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
              )}
            >
              기간 선택
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('custom')}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-body5 font-medium transition',
                filterMode === 'custom'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
              )}
            >
              직접 입력
            </button>
          </div>
          {filterMode === 'period' ? (
            <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
              {STATS_PERIODS.map((p) => {
                const active = p.value === period;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPeriod(p.value)}
                    className={cn(
                      'flex-1 rounded-lg px-3 py-2 text-body5 font-medium transition',
                      active
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900',
                    )}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-body5 text-gray-900 focus:border-main-500 focus:outline-none"
              />
              <span className="text-body5 text-gray-500">~</span>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-body5 text-gray-900 focus:border-main-500 focus:outline-none"
              />
            </div>
          )}
        </div>
        <Select
          label="본점"
          value={headIdRaw}
          onChange={(v) => setHeadIdRaw(v || String(headOptions[0]?.value ?? 1))}
          options={[{ value: ALL_HEADS, label: '전체 본점' }, ...headOptions]}
        />
        {!isAllHeads && (
          <Select
            label="지점"
            value={placeIdRaw === ALL ? undefined : placeIdRaw}
            onChange={(v) => setPlaceIdRaw(v || ALL)}
            placeholder="본점 전체"
            options={[{ value: '', label: '본점 전체' }, ...filteredPlaceOptions]}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <h2 className="text-body1 text-gray-900">
              {isAllHeads ? '전체 본점 거래' : isPlaceMode ? '지점별 거래' : '본점 전체 거래'}
            </h2>
            <span className="rounded-full bg-main-100 px-2 py-0.5 text-caption font-semibold text-main-700">
              총 {formatNumber(totalCount)}건
            </span>
            {fetching && !loading ? (
              <span className="text-caption text-gray-500">갱신 중</span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleExcel}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-body5 font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            <Download size={14} /> 엑셀 내려받기
          </button>
        </CardHeader>

        <CardBody>
          {loading ? (
            <div className="flex h-[420px] items-center justify-center">
              <div className="h-48 w-48 animate-pulse rounded-full bg-gray-100" />
            </div>
          ) : isError ? (
            <EmptyState
              title="통계를 불러오지 못했어요"
              description="서버 오류가 발생했어요. 잠시 후 다시 시도해주세요."
            />
          ) : !hasData ? (
            <EmptyState
              title="해당 조건의 데이터가 없어요"
              description="기간이나 본점/지점을 다시 선택해보세요."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_280px)] lg:items-center">
              <div className="relative h-[420px]">
                <StatsDoughnutChart
                  labels={labels}
                  values={values}
                  colors={PALETTE}
                />
              </div>
              <div className="flex flex-col gap-2">
                {labels.map((label, i) => {
                  const value = values[i] ?? 0;
                  const pct = totalCount
                    ? Math.round((value / totalCount) * 100)
                    : 0;
                  return (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-3 w-3 shrink-0 rounded-sm"
                          style={{
                            backgroundColor: PALETTE[i % PALETTE.length]!,
                          }}
                          aria-hidden
                        />
                        <span className="truncate text-body4 text-gray-800">
                          {label}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-body3 font-semibold text-gray-900">
                          {formatNumber(value)}
                        </span>
                        <span className="text-caption text-gray-500">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
