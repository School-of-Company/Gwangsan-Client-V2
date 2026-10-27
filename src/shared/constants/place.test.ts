import { memberPlaceLabel } from './place';

describe('memberPlaceLabel', () => {
  it('prefers the placeName sent by the server', () => {
    expect(memberPlaceLabel({ placeName: '수완마을', placeId: 2 })).toBe(
      '수완마을',
    );
  });

  it('falls back to the placeId table, then to a dash', () => {
    expect(memberPlaceLabel({ placeId: 2 })).toBe('고실마을');
    expect(memberPlaceLabel({})).toBe('-');
    expect(memberPlaceLabel({ placeName: null })).toBe('-');
  });
});
