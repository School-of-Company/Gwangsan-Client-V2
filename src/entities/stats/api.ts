import { api } from '@/shared/lib/api';

export type StatsPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export const STATS_PERIODS: { value: StatsPeriod; label: string }[] = [
  { value: 'DAY', label: '오늘' },
  { value: 'WEEK', label: '이번 주' },
  { value: 'MONTH', label: '이번 달' },
  { value: 'YEAR', label: '이번 해' },
];

export interface HeadStatsRow {
  place: { id: number; name: string };
  tradeCount: number;
}

export interface PlaceStatsRow {
  count: number;
}

export const getHeadStats = (period: StatsPeriod, headId: number) =>
  api
    .get<HeadStatsRow[]>(`/trade/graph/head?period=${period}&head_id=${headId}`)
    .then((r) => r.data);

export const getPlaceStats = (period: StatsPeriod, placeId: number) =>
  api
    .get<PlaceStatsRow>(`/trade/graph/place?period=${period}&place_id=${placeId}`)
    .then((r) => r.data);

export const getHeadStatsByDateRange = (
  startDate: string,
  endDate: string,
  headId: number,
) =>
  api
    .get<HeadStatsRow[]>(
      `/trade/statistics/head?head_id=${headId}&start_date=${startDate}&end_date=${endDate}`,
    )
    .then((r) => r.data);

export const getPlaceStatsByDateRange = (
  startDate: string,
  endDate: string,
  placeId: number,
) =>
  api
    .get<PlaceStatsRow>(
      `/trade/statistics/place?place_id=${placeId}&start_date=${startDate}&end_date=${endDate}`,
    )
    .then((r) => r.data);

export const downloadTradeExcel = async (
  periodLabel: string,
  headId: number,
  rows: { label: string; count: number }[],
) => {
  const XLSX = await import('xlsx');
  const total = rows.reduce((s, r) => s + r.count, 0);
  const sheetData = [
    ['지점명', '거래량', '비율(%)'],
    ...rows.map((r) => [
      r.label,
      r.count,
      total ? Math.round((r.count / total) * 100) : 0,
    ]),
    ['합계', total, total ? 100 : 0],
  ];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '거래통계');
  XLSX.writeFile(wb, `trade_${periodLabel}_${headId}.xlsx`);
};
