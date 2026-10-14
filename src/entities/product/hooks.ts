'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ADMIN_PRODUCT_PAGE_SIZE,
  deleteAdminProduct,
  listAdminProducts,
  type ProductFilter,
} from './api';

export const productKeys = {
  all: ['products'] as const,
  list: (filter: ProductFilter) => ['products', 'list', filter] as const,
};

export const useAdminProducts = (filter: ProductFilter = {}) =>
  useInfiniteQuery({
    queryKey: productKeys.list(filter),
    queryFn: ({ pageParam }) =>
      listAdminProducts({ ...filter, lastId: pageParam }),
    initialPageParam: undefined as number | undefined,
    // 마지막(가장 작은) id가 다음 페이지의 커서예요.
    getNextPageParam: (lastPage) =>
      lastPage.length < ADMIN_PRODUCT_PAGE_SIZE
        ? undefined
        : lastPage[lastPage.length - 1]?.id,
  });

export const useDeleteAdminProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => deleteAdminProduct(productId),
    onSuccess: () => {
      toast.success('게시글을 삭제했어요.');
      void qc.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: () => toast.error('게시글 삭제에 실패했어요.'),
  });
};
