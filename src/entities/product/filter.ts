import { placeLabel } from '@/shared/constants/place';
import type { Product } from '@/shared/types/product';

export const productPlaceName = (product: Product): string =>
  product.member.placeName?.trim() || placeLabel(product.member.placeId);

/** 제목 / 작성자 / 동네를 한 번에 훑는 검색이에요. */
export const filterProducts = (
  products: Product[],
  query: string,
): Product[] => {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return products;
  return products.filter((product) =>
    [product.title, product.member.nickname, productPlaceName(product)]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(keyword)),
  );
};
