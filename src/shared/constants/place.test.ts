import { isSamePlace, memberPlaceLabel, normalizePlaceName } from './place';

describe('memberPlaceLabel', () => {
  it('prefers the placeName sent by the server', () => {
    expect(memberPlaceLabel({ placeName: '수완마을', placeId: 2 })).toBe(
      '수완마을',
    );
  });

  it('falls back to the placeId table, then to a dash', () => {
    expect(memberPlaceLabel({ placeId: 2 })).toBe('고실마을지점');
    expect(memberPlaceLabel({})).toBe('-');
    expect(memberPlaceLabel({ placeName: null })).toBe('-');
  });
});

describe('normalizePlaceName', () => {
  it('strips whitespace and 지점/마을/동 suffixes', () => {
    expect(normalizePlaceName('신창동')).toBe('신창');
    expect(normalizePlaceName('신창지점')).toBe('신창');
    expect(normalizePlaceName('고실마을지점')).toBe('고실');
    expect(normalizePlaceName(' 수완 마을 ')).toBe('수완');
    expect(normalizePlaceName('월곡1')).toBe('월곡1');
  });

  it('never strips a name down to nothing', () => {
    expect(normalizePlaceName('동')).toBe('동');
  });
});

describe('isSamePlace', () => {
  it('matches names that differ only in suffix', () => {
    expect(isSamePlace('신창동', '신창지점')).toBe(true);
    expect(isSamePlace('수완마을', '수완지점')).toBe(true);
  });

  it('does not match different places or empty names', () => {
    expect(isSamePlace('월곡1', '월곡2')).toBe(false);
    expect(isSamePlace('신가', '신창지점')).toBe(false);
    expect(isSamePlace(null, '신창지점')).toBe(false);
  });
});
