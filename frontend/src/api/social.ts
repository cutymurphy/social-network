import { apiFetch } from './client';
import type { ISocialStatus } from '../types/social';

export const getStatus = (targetUserId: string) => {
  return apiFetch<ISocialStatus>(`/social/status/${targetUserId}`);
};
