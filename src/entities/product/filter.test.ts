import type { Product } from '@/shared/types/product';
import { filterProducts, productPlaceName } from './filter';

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: '자전거 팔아요',
  content: '거의 새것',
  gwangsan: 100,
  type: 'OBJECT',
  mode: 'GIVER',
  member: { memberId: 1, nickname: '광산이', placeName: '수완마을' },
  ...overrides,
});

describe('filterProducts', () => {
  const products = [
    product(),
    product({
      id: 2,
      title: '수학 과외 할 수 있어요',
      type: 'SERVICE',
      member: { memberId: 2, nickname: '하남이', placeId: 10 },
    }),
  ];

  it('returns everything when the keyword is blank', () => {
    expect(filterProducts(products, '  ')).toHaveLength(2);
  });

  it('matches by title, author, and place name', () => {
    expect(filterProducts(products, '자전거').map((p) => p.id)).toEqual([1]);
    expect(filterProducts(products, '하남이').map((p) => p.id)).toEqual([2]);
    expect(filterProducts(products, '수완').map((p) => p.id)).toEqual([1]);
  });

  it('resolves the place name from placeId when the API omits it', () => {
    expect(productPlaceName(products[1]!)).toBe('하남');
    expect(filterProducts(products, '하남').map((p) => p.id)).toEqual([2]);
  });
});
