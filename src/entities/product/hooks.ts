'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  deleteAdminProduct,
  listAdminProducts,
  type ProductFilter,
} from './api';

export const productKeys = {
  all: ['products'] as const,
  list: (filter: ProductFilter) => ['products', 'list', filter] as const,
};

export const useAdminProducts = (filter: ProductFilter = {}) =>
  useQuery({
    queryKey: productKeys.list(filter),
    queryFn: () => listAdminProducts(filter),
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
