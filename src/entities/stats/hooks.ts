'use client';

import { useQuery } from '@tanstack/react-query';
import { getHeadStats, getPlaceStats, type StatsPeriod } from './api';

export const statsKeys = {
  head: (period: StatsPeriod, headId: number) =>
    ['stats', 'head', period, headId] as const,
  place: (period: StatsPeriod, placeId: number) =>
    ['stats', 'place', period, placeId] as const,
};

export const useHeadStats = (period: StatsPeriod, headId: number | undefined) =>
  useQuery({
    queryKey: statsKeys.head(period, headId ?? 0),
    queryFn: () => getHeadStats(period, headId as number),
    enabled: !!headId,
  });

export const usePlaceStats = (
  period: StatsPeriod,
  placeId: number | undefined,
) =>
  useQuery({
    queryKey: statsKeys.place(period, placeId ?? 0),
    queryFn: () => getPlaceStats(period, placeId as number),
    enabled: !!placeId,
  });
