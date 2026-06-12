export const PLACES: Record<number, string> = {
  1: '수완마을',
  2: '고실마을',
  3: '신가',
  4: '신창',
  5: '도산',
  6: '우산',
  7: '월곡1',
  8: '첨단2',
  9: '월곡2',
  10: '하남',
  11: '평동',
} as const;

export const HEADS: Record<number, string> = {
  12: '광산구도시재생공동체센터',
  13: '광산구자원봉사센터',
  14: '광산구지역사회보장협의체',
  15: '투게더광산나눔문화센터',
} as const;

export const HEAD_PLACES: Record<number, number[]> = {
  12: [1, 2, 3, 4],   // 광산구도시재생공동체센터: 수완마을, 고실마을, 신가, 신창
  13: [5, 6, 7, 8],   // 광산구자원봉사센터: 도산, 우산, 월곡1, 첨단2
  14: [11, 9, 10],    // 광산구지역사회보장협의체: 평동, 월곡2, 하남
  15: [],             // 투게더광산나눔문화센터
} as const;

export const placeOptions = Object.entries(PLACES).map(([value, label]) => ({
  value,
  label,
}));

export const headOptions = Object.entries(HEADS).map(([value, label]) => ({
  value,
  label,
}));

export const placeLabel = (placeId?: number | string | null): string => {
  if (placeId == null) return '-';
  const n = typeof placeId === 'string' ? Number(placeId) : placeId;
  return PLACES[n] ?? HEADS[n] ?? '-';
};
