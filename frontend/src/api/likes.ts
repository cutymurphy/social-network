import { apiFetch } from './client';
import type { ISuccessResponse } from '../types/api';

export const likePost = (postId: string) => {
  return apiFetch<ISuccessResponse>(`/likes/${postId}`, { method: 'POST' });
};

export const unlikePost = (postId: string) => {
  return apiFetch<ISuccessResponse>(`/likes/${postId}`, {
    method: 'DELETE',
  });
};
