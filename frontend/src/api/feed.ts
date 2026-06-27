import { apiFetch } from './client';
import type { IFeedResponse } from '../types/api';

export const getFeed = (skip = 0, limit = 15) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  return apiFetch<IFeedResponse>(`/feed?${params.toString()}`);
};
