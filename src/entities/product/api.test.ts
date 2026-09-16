import { api } from '@/shared/lib/api';
import { deleteAdminProduct, listAdminProducts } from './api';

jest.mock('@/shared/lib/api', () => ({
  api: {
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('product api', () => {
  beforeEach(() => jest.clearAllMocks());

  it('passes type and mode filters to the admin product endpoint', async () => {
    const getMock = api.get as jest.Mock;
    getMock.mockResolvedValue({ data: [] });

    await listAdminProducts({ type: 'SERVICE', mode: 'RECEIVER' });

    expect(getMock).toHaveBeenCalledWith('/admin/product', {
      params: { type: 'SERVICE', mode: 'RECEIVER' },
    });
  });

  it('omits empty filters so every place is listed', async () => {
    const getMock = api.get as jest.Mock;
    getMock.mockResolvedValue({ data: [] });

    await listAdminProducts();

    expect(getMock).toHaveBeenCalledWith('/admin/product', { params: {} });
  });

  it('deletes a product by id', async () => {
    const deleteMock = api.delete as jest.Mock;
    deleteMock.mockResolvedValue({ data: null });

    await deleteAdminProduct(7);

    expect(deleteMock).toHaveBeenCalledWith('/admin/product/7');
  });
});
