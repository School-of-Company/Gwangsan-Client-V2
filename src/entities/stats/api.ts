import { api } from '@/shared/lib/api';

export type StatsPeriod = 'DAY' | 'WEEK' | 'MONTH';

export const STATS_PERIODS: { value: StatsPeriod; label: string }[] = [
  { value: 'DAY', label: '오늘' },
  { value: 'WEEK', label: '이번 주' },
  { value: 'MONTH', label: '이번 달' },
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

export const downloadTradeExcel = async (
  period: StatsPeriod,
  headId: number,
) => {
  const res = await api.get(`/trade/excel?period=${period}&head_id=${headId}`, {
    responseType: 'blob',
    headers: {
      Accept:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
  const blob = new Blob([res.data]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `trade_${period}_${headId}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
