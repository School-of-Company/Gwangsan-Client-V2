import {
  displayPlaceName,
  isSamePlace,
  memberPlaceLabel,
  normalizePlaceName,
  placeOptions,
} from './place';

describe('memberPlaceLabel', () => {
  it('prefers the placeName sent by the server, shown as the unified name', () => {
    expect(memberPlaceLabel({ placeName: '신창동', placeId: 2 })).toBe(
      '신창지점',
    );
    expect(memberPlaceLabel({ placeName: '본부', placeId: 2 })).toBe('본부');
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

describe('displayPlaceName', () => {
  it('maps server place names to the unified place names', () => {
    expect(displayPlaceName('신창동')).toBe('신창지점');
    expect(displayPlaceName('수완마을')).toBe('수완지점');
    expect(displayPlaceName('고실마을')).toBe('고실마을지점');
    expect(displayPlaceName(' 신창 동 ')).toBe('신창지점');
  });

  it('keeps unknown names as they are', () => {
    expect(displayPlaceName('어딘가')).toBe('어딘가');
    expect(displayPlaceName('신가동')).toBe('신가동');
  });
});

describe('placeOptions', () => {
  it('only lists the unified places', () => {
    expect(placeOptions.map((o) => o.label)).toEqual([
      '수완지점',
      '고실마을지점',
      '신창지점',
    ]);
  });
});
