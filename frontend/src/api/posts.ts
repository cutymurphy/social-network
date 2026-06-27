import { apiFetch } from './client';
import type { IPost, ICreatePostRequest } from '../types/post';
import type { IUserPostsResponse, ISuccessResponse } from '../types/api';

export const getUserPosts = (userId: string, skip = 0, limit = 20) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  return apiFetch<IUserPostsResponse>(
    `/posts/user/${userId}?${params.toString()}`,
  );
};

export const getPost = (postId: string) => {
  return apiFetch<IPost>(`/posts/${postId}`);
};

export const createPost = (data: ICreatePostRequest) => {
  const form = new FormData();
  form.append('file', data.file);
  form.append('caption', data.caption);
  form.append('mediaType', data.mediaType);
  return apiFetch<IPost>('/posts', {
    method: 'POST',
    body: form,
  });
};

export const deletePost = (postId: string) => {
  return apiFetch<ISuccessResponse>(`/posts/${postId}`, {
    method: 'DELETE',
  });
};
