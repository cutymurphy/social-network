import { apiFetch } from "./client";
import type { INotificationsResponse, ISuccessResponse } from "../types/api";

export const getNotifications = (skip = 0, limit = 20) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  return apiFetch<INotificationsResponse>(
    `/notifications?${params.toString()}`,
  );
};

export const getUnreadCount = () => {
  return apiFetch<number>("/notifications/unread-count");
};

export const markAsSeen = () => {
  return apiFetch<ISuccessResponse>("/notifications/mark-seen", {
    method: "POST",
  });
};
