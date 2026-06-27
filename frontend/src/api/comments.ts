import { apiFetch, jsonBody } from './client';
import type { IComment, ICreateCommentRequest } from '../types/comment';
import type { ICommentsResponse, ISuccessResponse } from '../types/api';

export const getComments = (postId: string, skip = 0, limit = 20) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  return apiFetch<ICommentsResponse>(
    `/comments/${postId}?${params.toString()}`,
  );
};

export const createComment = (data: ICreateCommentRequest) => {
  return apiFetch<IComment>('/comments', {
    method: 'POST',
    ...jsonBody(data),
  });
};

export const deleteComment = (commentId: string) => {
  return apiFetch<ISuccessResponse>(`/comments/${commentId}`, {
    method: 'DELETE',
  });
};
