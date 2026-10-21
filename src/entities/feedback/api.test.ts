import { api } from '@/shared/lib/api';
import {
  ADMIN_FEEDBACK_PAGE_SIZE,
  answerAdminFeedback,
  getAdminFeedback,
  listAdminFeedback,
  updateAdminFeedbackStatus,
} from './api';

jest.mock('@/shared/lib/api', () => ({
  api: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('feedback api', () => {
  beforeEach(() => jest.clearAllMocks());

  it('passes status, type, place, and the cursor to the admin feedback endpoint', async () => {
    const getMock = api.get as jest.Mock;
    getMock.mockResolvedValue({ data: [] });

    await listAdminFeedback({
      status: 'RECEIVED',
      type: 'BUG',
      placeId: 3,
      lastId: 42,
    });

    expect(getMock).toHaveBeenCalledWith('/admin/feedback', {
      params: {
        status: 'RECEIVED',
        type: 'BUG',
        place_id: 3,
        last_id: 42,
        size: ADMIN_FEEDBACK_PAGE_SIZE,
      },
    });
  });

  it('omits empty filters on the first page', async () => {
    const getMock = api.get as jest.Mock;
    getMock.mockResolvedValue({ data: [] });

    await listAdminFeedback();

    expect(getMock).toHaveBeenCalledWith('/admin/feedback', {
      params: { size: ADMIN_FEEDBACK_PAGE_SIZE },
    });
  });

  it('gets a feedback by id', async () => {
    const getMock = api.get as jest.Mock;
    getMock.mockResolvedValue({ data: { feedbackId: 7 } });

    await expect(getAdminFeedback(7)).resolves.toEqual({ feedbackId: 7 });
    expect(getMock).toHaveBeenCalledWith('/admin/feedback/7');
  });

  it('patches the answer and the status', async () => {
    const patchMock = api.patch as jest.Mock;
    patchMock.mockResolvedValue({ data: null });

    await answerAdminFeedback(7, '확인했어요.');
    await updateAdminFeedbackStatus(7, 'IN_PROGRESS');

    expect(patchMock).toHaveBeenCalledWith('/admin/feedback/7/answer', {
      answer: '확인했어요.',
    });
    expect(patchMock).toHaveBeenCalledWith('/admin/feedback/7/status', {
      status: 'IN_PROGRESS',
    });
  });
});
