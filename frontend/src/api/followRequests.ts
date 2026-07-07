import { apiFetch } from './client';
import type {
  IIncomingRequestsResponse,
  IOutgoingRequestsResponse,
  ISuccessResponse,
} from '../types/api';

export const getIncomingCount = () => {
  return apiFetch<number>('/follow-requests/incoming-count');
};

export const getIncoming = (skip = 0, limit = 20) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  return apiFetch<IIncomingRequestsResponse>(
    `/follow-requests/incoming?${params.toString()}`,
  );
};

export const getOutgoing = (skip = 0, limit = 20) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  return apiFetch<IOutgoingRequestsResponse>(
    `/follow-requests/outgoing?${params.toString()}`,
  );
};

export const acceptRequest = (requestId: string) => {
  return apiFetch<ISuccessResponse>(
    `/follow-requests/${requestId}/accept`,
    { method: 'POST' },
  );
};

export const rejectRequest = (requesterId: string) => {
  return apiFetch<ISuccessResponse>(
    `/follow-requests/${requesterId}/reject`,
    { method: 'POST' },
  );
};

export const cancelRequest = (targetUserId: string) => {
  return apiFetch<ISuccessResponse>(
    `/follow-requests/${targetUserId}/cancel`,
    { method: 'POST' },
  );
};
