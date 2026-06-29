import { apiFetch, jsonBody } from "./client";
import type {
  IMeUser,
  IPublicUser,
  IUpdateUserRequest,
  IChangePasswordRequest,
} from "../types/user";
import type {
  ISearchResponse,
  ISuccessResponse,
  IAvatarResponse,
} from "../types/api";

export const searchUsers = (q: string, skip = 0, limit = 20) => {
  const params = new URLSearchParams({
    q,
    skip: String(skip),
    limit: String(limit),
  });
  return apiFetch<ISearchResponse>(`/users/search?${params.toString()}`);
};

export const getMe = () => {
  return apiFetch<IMeUser>("/users/me");
};

export const getUser = (id: string) => {
  return apiFetch<IPublicUser>(`/users/${id}`);
};

export const updateMe = (data: IUpdateUserRequest) => {
  return apiFetch<IMeUser>("/users/me", {
    method: "PATCH",
    ...jsonBody(data),
  });
};

export const changePassword = (data: IChangePasswordRequest) => {
  return apiFetch<ISuccessResponse>("/users/me/password", {
    method: "PATCH",
    ...jsonBody(data),
  });
};

export const uploadAvatar = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return apiFetch<IAvatarResponse>("/users/me/avatar", {
    method: "POST",
    body: form,
  });
};

export const deleteAvatar = () => {
  return apiFetch<ISuccessResponse>("/users/me/avatar", { method: "DELETE" });
};

export const deleteMe = () => {
  return apiFetch<ISuccessResponse>("/users/me", { method: "DELETE" });
};
