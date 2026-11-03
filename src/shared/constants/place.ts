export const PLACES: Record<number, string> = {
  1: '수완지점',
  2: '고실마을지점',
  4: '신창지점',
} as const;

export const HEADS: Record<number, string> = {
  1: '광산구도시재생공동체센터',
  2: '광산구자원봉사센터',
  3: '광산구지역사회보장협의체',
  4: '투게더광산나눔문화센터',
} as const;

export const HEAD_PLACES: Record<number, number[]> = {
  1: [1, 2, 4], // 광산구도시재생공동체센터: 수완지점, 고실마을지점, 신창지점
  2: [], // 광산구자원봉사센터
  3: [], // 광산구지역사회보장협의체
  4: [], // 투게더광산나눔문화센터
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

// 서버 응답은 placeName(문자열)을 내려주므로 이를 우선 사용하고, placeId만 있으면 상수 표로 보완해요.
export const memberPlaceLabel = (member: {
  placeName?: string | null;
  placeId?: number | null;
}): string =>
  (member.placeName && displayPlaceName(member.placeName)) ||
  placeLabel(member.placeId);

// 웹·앱·DB의 지점명 표기가 달라요(신창 / 신창동 / 신창지점). 공백과 접미사를 떼고 비교해요.
const PLACE_SUFFIXES = ['지점', '마을', '동'];

export const normalizePlaceName = (name: string): string => {
  let n = name.replace(/\s+/g, '');
  let stripped = true;
  while (stripped) {
    stripped = false;
    for (const suffix of PLACE_SUFFIXES) {
      if (n.length > suffix.length && n.endsWith(suffix)) {
        n = n.slice(0, -suffix.length);
        stripped = true;
      }
    }
  }
  return n;
};

export const isSamePlace = (a?: string | null, b?: string | null): boolean =>
  !!a && !!b && normalizePlaceName(a) === normalizePlaceName(b);

// 서버가 준 지점명(예: 신창동)을 확정된 지점명(예: 신창지점)으로 맞춰 보여줘요. 목록에 없으면 그대로 써요.
export const displayPlaceName = (name: string): string => {
  const trimmed = name.trim();
  return Object.values(PLACES).find((p) => isSamePlace(p, trimmed)) ?? trimmed;
};
