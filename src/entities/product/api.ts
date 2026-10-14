import { api } from '@/shared/lib/api';
import type { Product, ProductMode, ProductType } from '@/shared/types/product';

/** 서버 기본값은 10건이지만, 관리자 화면은 한 번에 더 많이 훑어요. */
export const ADMIN_PRODUCT_PAGE_SIZE = 50;

export interface ProductFilter {
  type?: ProductType;
  mode?: ProductMode;
}

export interface ProductPageParams extends ProductFilter {
  /** 커서. 직전 페이지 마지막 게시글의 id (목록은 id 내림차순) */
  lastId?: number;
  size?: number;
}

// 동네(지점) 구분 없이 전체 게시글을 가져오는 관리자 전용 엔드포인트예요.
export const listAdminProducts = async ({
  type,
  mode,
  lastId,
  size = ADMIN_PRODUCT_PAGE_SIZE,
}: ProductPageParams = {}): Promise<Product[]> => {
  const params: Record<string, string | number> = { size };
  if (type) params['type'] = type;
  if (mode) params['mode'] = mode;
  if (lastId) params['last_id'] = lastId;
  const { data } = await api.get<Product[]>('/admin/product', { params });
  return data;
};

export const deleteAdminProduct = (productId: number) =>
  api.delete(`/admin/product/${productId}`).then((r) => r.data);
