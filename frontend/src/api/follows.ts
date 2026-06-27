import { apiFetch } from './client';
import type {
  IFollowersResponse,
  IFollowingResponse,
  IFollowResponse,
  ISuccessResponse,
} from '../types/api';

export const getFollowing = (userId: string, skip = 0, limit = 20) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  return apiFetch<IFollowingResponse>(
    `/follows/following/${userId}?${params.toString()}`,
  );
};

export const getFollowers = (userId: string, skip = 0, limit = 20) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  return apiFetch<IFollowersResponse>(
    `/follows/followers/${userId}?${params.toString()}`,
  );
};

export const follow = (userId: string) => {
  return apiFetch<IFollowResponse>(`/follows/${userId}`, { method: 'POST' });
};

export const unfollow = (userId: string) => {
  return apiFetch<ISuccessResponse>(`/follows/${userId}`, {
    method: 'DELETE',
  });
};
