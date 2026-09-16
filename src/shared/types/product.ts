export const PRODUCT_TYPES = ['OBJECT', 'SERVICE'] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const PRODUCT_TYPE_KOR: Record<ProductType, string> = {
  OBJECT: '물건',
  SERVICE: '서비스',
};

export const productTypeOptions = PRODUCT_TYPES.map((value) => ({
  value,
  label: PRODUCT_TYPE_KOR[value],
}));

export const PRODUCT_MODES = ['GIVER', 'RECEIVER'] as const;
export type ProductMode = (typeof PRODUCT_MODES)[number];

// 유형 라벨은 구분에 따라 달라져요. (물건을 주는 쪽은 "팔아요", 서비스를 주는 쪽은 "할 수 있어요")
export const PRODUCT_MODE_KOR: Record<
  ProductType,
  Record<ProductMode, string>
> = {
  OBJECT: { GIVER: '팔아요', RECEIVER: '필요해요' },
  SERVICE: { GIVER: '할 수 있어요', RECEIVER: '필요해요' },
};

export const productModeLabel = (type: ProductType, mode: ProductMode) =>
  PRODUCT_MODE_KOR[type]?.[mode] ?? '-';

// 필터는 구분을 가리지 않으므로 두 라벨을 함께 보여줘요.
export const productModeOptions: { value: ProductMode; label: string }[] = [
  { value: 'GIVER', label: '팔아요 · 할 수 있어요' },
  { value: 'RECEIVER', label: '필요해요' },
];

export interface ProductMember {
  memberId: number;
  nickname: string;
  placeName?: string;
  placeId?: number;
  light?: number;
}

export interface ProductImage {
  imageId: number;
  imageUrl: string;
}

export interface Product {
  id: number;
  title: string;
  content: string;
  gwangsan: number;
  type: ProductType;
  mode: ProductMode;
  member: ProductMember;
  images?: ProductImage[];
  isCompleted?: boolean;
  createdAt?: string;
}
