'use client';

import { useMemo, useState } from 'react';
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Download } from 'lucide-react';
import {
  STATS_PERIODS,
  downloadTradeExcel,
  useHeadStats,
  usePlaceStats,
  type StatsPeriod,
} from '@/entities/stats';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Select } from '@/shared/ui/Select';
import {
  PLACES,
  headOptions,
  placeOptions,
} from '@/shared/constants/place';
import { formatNumber } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';

ChartJS.register(ArcElement, Tooltip, Legend);

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

export function StatsView() {
  const [period, setPeriod] = useState<StatsPeriod>('DAY');
  const [headId, setHeadId] = useState<number>(
    Number(headOptions[0]?.value ?? 12),
  );
  const [placeIdRaw, setPlaceIdRaw] = useState<string>(ALL);

  const placeId = placeIdRaw !== ALL ? Number(placeIdRaw) : undefined;
  const isPlaceMode = !!placeId;

  const headStats = useHeadStats(period, !isPlaceMode ? headId : undefined);
  const placeStats = usePlaceStats(period, placeId);

  const { labels, values, totalCount } = useMemo(() => {
    if (isPlaceMode && placeStats.data) {
      const name = PLACES[placeId!] ?? '선택 지점';
      return {
        labels: [name],
        values: [placeStats.data.count],
        totalCount: placeStats.data.count,
      };
    }
    if (!isPlaceMode && headStats.data) {
      const data = headStats.data;
      return {
        labels: data.map((d) => d.place.name),
        values: data.map((d) => d.tradeCount),
        totalCount: data.reduce((sum, d) => sum + d.tradeCount, 0),
      };
    }
    return { labels: [] as string[], values: [] as number[], totalCount: 0 };
  }, [isPlaceMode, placeStats.data, headStats.data, placeId]);

  const chartData: ChartData<'doughnut'> = {
    labels,
    datasets: [
      {
        label: '거래 수',
        data: values,
        backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]!),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, boxWidth: 10, boxHeight: 10, color: '#4F4F51' },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${formatNumber(ctx.parsed)} 건`,
        },
      },
    },
  };

  const loading = isPlaceMode ? placeStats.isLoading : headStats.isLoading;
  const hasData = values.length > 0 && values.some((v) => v > 0);

  const handleExcel = () => downloadTradeExcel(period, headId);

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
        </div>
        <Select
          label="본점"
          value={String(headId)}
          onChange={(v) => setHeadId(Number(v))}
          options={headOptions}
        />
        <Select
          label="지점"
          value={placeIdRaw === ALL ? undefined : placeIdRaw}
          onChange={(v) => setPlaceIdRaw(v || ALL)}
          placeholder="본점 전체"
          options={[{ value: '', label: '본점 전체' }, ...placeOptions]}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <h2 className="text-body1 text-gray-900">
              {isPlaceMode ? '지점별 거래' : '본점 전체 거래'}
            </h2>
            <span className="rounded-full bg-main-100 px-2 py-0.5 text-caption font-semibold text-main-700">
              총 {formatNumber(totalCount)}건
            </span>
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
          ) : !hasData ? (
            <EmptyState
              title="해당 조건의 데이터가 없어요"
              description="기간이나 본점/지점을 다시 선택해보세요."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_280px)] lg:items-center">
              <div className="relative h-[420px]">
                <Doughnut data={chartData} options={chartOptions} />
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
                      <div className="flex items-center gap-2 min-w-0">
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
