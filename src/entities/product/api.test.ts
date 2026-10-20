import { api } from '@/shared/lib/api';
import {
  ADMIN_PRODUCT_PAGE_SIZE,
  deleteAdminProduct,
  listAdminProducts,
} from './api';

jest.mock('@/shared/lib/api', () => ({
  api: {
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('product api', () => {
  beforeEach(() => jest.clearAllMocks());

  it('passes type, mode, and the cursor to the admin product endpoint', async () => {
    const getMock = api.get as jest.Mock;
    getMock.mockResolvedValue({ data: [] });

    await listAdminProducts({ type: 'SERVICE', mode: 'RECEIVER', lastId: 42 });

    expect(getMock).toHaveBeenCalledWith('/admin/product', {
      params: {
        type: 'SERVICE',
        mode: 'RECEIVER',
        last_id: 42,
        size: ADMIN_PRODUCT_PAGE_SIZE,
      },
    });
  });

  it('omits empty filters so every place is listed from the first page', async () => {
    const getMock = api.get as jest.Mock;
    getMock.mockResolvedValue({ data: [] });

    await listAdminProducts();

    expect(getMock).toHaveBeenCalledWith('/admin/product', {
      params: { size: ADMIN_PRODUCT_PAGE_SIZE },
    });
  });

  it('deletes a product by id', async () => {
    const deleteMock = api.delete as jest.Mock;
    deleteMock.mockResolvedValue({ data: null });

    await deleteAdminProduct(7);

    expect(deleteMock).toHaveBeenCalledWith('/admin/product/7');
  });
});
