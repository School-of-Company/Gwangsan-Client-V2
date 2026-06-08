'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
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
    queryFn: () => getHeadStatsByDateRange(startDate, endDate, headId as number),
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
