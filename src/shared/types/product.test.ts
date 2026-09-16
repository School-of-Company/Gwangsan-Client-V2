import { productModeLabel } from './product';

describe('productModeLabel', () => {
  it('labels the giver side differently per type', () => {
    expect(productModeLabel('OBJECT', 'GIVER')).toBe('팔아요');
    expect(productModeLabel('SERVICE', 'GIVER')).toBe('할 수 있어요');
  });

  it('labels the receiver side the same way', () => {
    expect(productModeLabel('OBJECT', 'RECEIVER')).toBe('필요해요');
    expect(productModeLabel('SERVICE', 'RECEIVER')).toBe('필요해요');
  });
});
