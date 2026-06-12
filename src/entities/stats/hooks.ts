'use client';

import { useMemo } from 'react';
import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query';
import { PLACES, headOptions, placeOptions } from '@/shared/constants/place';

const HEAD_IDS = headOptions.map((opt) => Number(opt.value));
import {
  getHeadStats,
  getHeadStatsByDateRange,
  getPlaceStats,
  getPlaceStatsByDateRange,
  type StatsPeriod,
} from './api';

export const statsKeys = {
  head: (period: StatsPeriod, headId: number) =>
    ['stats', 'head', period, headId] as const,
  place: (period: StatsPeriod, placeId: number) =>
    ['stats', 'place', period, placeId] as const,
  headByDate: (startDate: string, endDate: string, headId: number) =>
    ['stats', 'head', 'custom', startDate, endDate, headId] as const,
  placeByDate: (startDate: string, endDate: string, placeId: number) =>
    ['stats', 'place', 'custom', startDate, endDate, placeId] as const,
};

export const useHeadStats = (period: StatsPeriod, headId: number | undefined) =>
  useQuery({
    queryKey: statsKeys.head(period, headId ?? 0),
    queryFn: () => getHeadStats(period, headId as number),
    enabled: !!headId,
    placeholderData: keepPreviousData,
  });

export const usePlaceStats = (
  period: StatsPeriod,
  placeId: number | undefined,
) =>
  useQuery({
    queryKey: statsKeys.place(period, placeId ?? 0),
    queryFn: () => getPlaceStats(period, placeId as number),
    enabled: !!placeId,
    placeholderData: keepPreviousData,
  });

export const useHeadStatsByDateRange = (
  startDate: string,
  endDate: string,
  headId: number | undefined,
) =>
  useQuery({
    queryKey: statsKeys.headByDate(startDate, endDate, headId ?? 0),
    queryFn: () =>
      getHeadStatsByDateRange(startDate, endDate, headId as number),
    enabled: !!headId && !!startDate && !!endDate && startDate <= endDate,
    placeholderData: keepPreviousData,
  });

export const usePlaceStatsByDateRange = (
  startDate: string,
  endDate: string,
  placeId: number | undefined,
) =>
  useQuery({
    queryKey: statsKeys.placeByDate(startDate, endDate, placeId ?? 0),
    queryFn: () =>
      getPlaceStatsByDateRange(startDate, endDate, placeId as number),
    enabled: !!placeId && !!startDate && !!endDate && startDate <= endDate,
  });

export const useFilteredPlaceStats = (
  period: StatsPeriod,
  placeIds: number[],
  enabled: boolean,
) => {
  const results = useQueries({
    queries: placeIds.map((id) => ({
      queryKey: statsKeys.place(period, id),
      queryFn: () => getPlaceStats(period, id),
      enabled: enabled && placeIds.length > 0,
      placeholderData: keepPreviousData,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isFetching = results.some((r) => r.isFetching);
  const isError = results.some((r) => r.isError);
  const data =
    !isLoading && !isError && placeIds.length > 0
      ? placeIds.map((id, i) => ({
          place: { id, name: PLACES[id] ?? String(id) },
          tradeCount: results[i]?.data?.count ?? 0,
        }))
      : undefined;

  return { isLoading, isFetching, isError, data };
};

export const useFilteredPlaceStatsByDateRange = (
  startDate: string,
  endDate: string,
  placeIds: number[],
  enabled: boolean,
) => {
  const canFetch =
    enabled &&
    placeIds.length > 0 &&
    !!startDate &&
    !!endDate &&
    startDate <= endDate;
  const results = useQueries({
    queries: placeIds.map((id) => ({
      queryKey: statsKeys.placeByDate(startDate, endDate, id),
      queryFn: () => getPlaceStatsByDateRange(startDate, endDate, id),
      enabled: canFetch,
      placeholderData: keepPreviousData,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isFetching = results.some((r) => r.isFetching);
  const isError = results.some((r) => r.isError);
  const data =
    !isLoading && !isError && placeIds.length > 0
      ? placeIds.map((id, i) => ({
          place: { id, name: PLACES[id] ?? String(id) },
          tradeCount: results[i]?.data?.count ?? 0,
        }))
      : undefined;

  return { isLoading, isFetching, isError, data };
};

export const useAllPlaceStats = (period: StatsPeriod, enabled: boolean) => {
  const results = useQueries({
    queries: placeOptions.map((opt) => ({
      queryKey: statsKeys.place(period, Number(opt.value)),
      queryFn: () => getPlaceStats(period, Number(opt.value)),
      enabled,
      placeholderData: keepPreviousData,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isFetching = results.some((r) => r.isFetching);
  const isError = results.some((r) => r.isError);
  const data =
    !isLoading && !isError
      ? placeOptions.map((opt, i) => ({
          place: { id: Number(opt.value), name: opt.label },
          tradeCount: results[i]?.data?.count ?? 0,
        }))
      : undefined;

  return { isLoading, isFetching, isError, data };
};

export const useAllPlaceStatsByDateRange = (
  startDate: string,
  endDate: string,
  enabled: boolean,
) => {
  const canFetch = enabled && !!startDate && !!endDate && startDate <= endDate;
  const results = useQueries({
    queries: placeOptions.map((opt) => ({
      queryKey: statsKeys.placeByDate(startDate, endDate, Number(opt.value)),
      queryFn: () =>
        getPlaceStatsByDateRange(startDate, endDate, Number(opt.value)),
      enabled: canFetch,
      placeholderData: keepPreviousData,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isFetching = results.some((r) => r.isFetching);
  const isError = results.some((r) => r.isError);
  const data =
    !isLoading && !isError
      ? placeOptions.map((opt, i) => ({
          place: { id: Number(opt.value), name: opt.label },
          tradeCount: results[i]?.data?.count ?? 0,
        }))
      : undefined;

  return { isLoading, isFetching, isError, data };
};

// 각 본점의 총 거래량 (소속 지점 합산)
export const useAllHeadsStats = (period: StatsPeriod, enabled: boolean) => {
  const headListResults = useQueries({
    queries: HEAD_IDS.map((id) => ({
      queryKey: statsKeys.head(period, id),
      queryFn: () => getHeadStats(period, id),
      enabled,
      placeholderData: keepPreviousData,
    })),
  });

  const headListsReady = headListResults.every((r) => !r.isLoading && !r.isError);

  const { placeToHead, allPlaceIds } = useMemo(() => {
    const map: Record<number, number> = {};
    const ids: number[] = [];
    headListResults.forEach((r, i) => {
      r.data?.forEach((row) => {
        if (row.place.id in PLACES) {
          map[row.place.id] = HEAD_IDS[i]!;
          if (!ids.includes(row.place.id)) ids.push(row.place.id);
        }
      });
    });
    return { placeToHead: map, allPlaceIds: ids };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headListsReady]);

  const placeResults = useQueries({
    queries: allPlaceIds.map((id) => ({
      queryKey: statsKeys.place(period, id),
      queryFn: () => getPlaceStats(period, id),
      enabled: enabled && headListsReady && allPlaceIds.length > 0,
      placeholderData: keepPreviousData,
    })),
  });

  const isLoading =
    headListResults.some((r) => r.isLoading) || placeResults.some((r) => r.isLoading);
  const isFetching =
    headListResults.some((r) => r.isFetching) || placeResults.some((r) => r.isFetching);
  const isError =
    headListResults.some((r) => r.isError) || placeResults.some((r) => r.isError);

  const data = useMemo(() => {
    if (isLoading || isError || allPlaceIds.length === 0) return undefined;
    const totals: Record<number, number> = Object.fromEntries(HEAD_IDS.map((id) => [id, 0]));
    allPlaceIds.forEach((placeId, i) => {
      const hid = placeToHead[placeId];
      if (hid !== undefined) totals[hid] = (totals[hid] ?? 0) + (placeResults[i]?.data?.count ?? 0);
    });
    return headOptions.map((opt) => ({
      head: { id: Number(opt.value), name: opt.label },
      tradeCount: totals[Number(opt.value)] ?? 0,
    }));
  }, [isLoading, isError, allPlaceIds, placeToHead, placeResults]);

  return { isLoading, isFetching, isError, data };
};

export const useAllHeadsStatsByDateRange = (
  startDate: string,
  endDate: string,
  enabled: boolean,
) => {
  const canFetch = enabled && !!startDate && !!endDate && startDate <= endDate;

  const headListResults = useQueries({
    queries: HEAD_IDS.map((id) => ({
      queryKey: statsKeys.headByDate(startDate, endDate, id),
      queryFn: () => getHeadStatsByDateRange(startDate, endDate, id),
      enabled: canFetch,
      placeholderData: keepPreviousData,
    })),
  });

  const headListsReady = headListResults.every((r) => !r.isLoading && !r.isError);

  const { placeToHead, allPlaceIds } = useMemo(() => {
    const map: Record<number, number> = {};
    const ids: number[] = [];
    headListResults.forEach((r, i) => {
      r.data?.forEach((row) => {
        if (row.place.id in PLACES) {
          map[row.place.id] = HEAD_IDS[i]!;
          if (!ids.includes(row.place.id)) ids.push(row.place.id);
        }
      });
    });
    return { placeToHead: map, allPlaceIds: ids };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headListsReady, startDate, endDate]);

  const placeResults = useQueries({
    queries: allPlaceIds.map((id) => ({
      queryKey: statsKeys.placeByDate(startDate, endDate, id),
      queryFn: () => getPlaceStatsByDateRange(startDate, endDate, id),
      enabled: canFetch && headListsReady && allPlaceIds.length > 0,
      placeholderData: keepPreviousData,
    })),
  });

  const isLoading =
    headListResults.some((r) => r.isLoading) || placeResults.some((r) => r.isLoading);
  const isFetching =
    headListResults.some((r) => r.isFetching) || placeResults.some((r) => r.isFetching);
  const isError =
    headListResults.some((r) => r.isError) || placeResults.some((r) => r.isError);

  const data = useMemo(() => {
    if (isLoading || isError || allPlaceIds.length === 0) return undefined;
    const totals: Record<number, number> = Object.fromEntries(HEAD_IDS.map((id) => [id, 0]));
    allPlaceIds.forEach((placeId, i) => {
      const hid = placeToHead[placeId];
      if (hid !== undefined) totals[hid] = (totals[hid] ?? 0) + (placeResults[i]?.data?.count ?? 0);
    });
    return headOptions.map((opt) => ({
      head: { id: Number(opt.value), name: opt.label },
      tradeCount: totals[Number(opt.value)] ?? 0,
    }));
  }, [isLoading, isError, allPlaceIds, placeToHead, placeResults]);

  return { isLoading, isFetching, isError, data };
};
