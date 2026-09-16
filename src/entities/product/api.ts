import { api } from '@/shared/lib/api';
import type { Product, ProductMode, ProductType } from '@/shared/types/product';

export interface ProductFilter {
  type?: ProductType;
  mode?: ProductMode;
}

// 동네(지점) 구분 없이 전체 게시글을 가져오는 관리자 전용 엔드포인트예요.
export const listAdminProducts = async (
  filter: ProductFilter = {},
): Promise<Product[]> => {
  const params: Record<string, string> = {};
  if (filter.type) params['type'] = filter.type;
  if (filter.mode) params['mode'] = filter.mode;
  const { data } = await api.get<Product[]>('/admin/product', { params });
  return data;
};

export const deleteAdminProduct = (productId: number) =>
  api.delete(`/admin/product/${productId}`).then((r) => r.data);
