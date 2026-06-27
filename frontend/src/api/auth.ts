import { apiFetch, jsonBody } from "./client";
import type { IAuthUser } from "../types/user";
import type { ILoginRequest, IRegisterRequest } from "../types/auth";
import type { ITokenResponse, ISuccessResponse } from "../types/api";

export const register = (data: IRegisterRequest) => {
  return apiFetch<ITokenResponse>("/auth/register", {
    method: "POST",
    ...jsonBody(data),
  });
};

export const login = (data: ILoginRequest) => {
  return apiFetch<ITokenResponse>("/auth/login", {
    method: "POST",
    ...jsonBody(data),
  });
};

export const refresh = () => {
  return apiFetch<ITokenResponse>("/auth/refresh", { method: "POST" });
};

export const logout = () => {
  return apiFetch<ISuccessResponse>("/auth/logout", { method: "POST" });
};

export const getMe = () => {
  return apiFetch<IAuthUser>("/auth/me");
};
