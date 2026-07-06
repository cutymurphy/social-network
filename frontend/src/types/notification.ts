import type { IUserPreview } from "./user";

export enum ENotificationType {
  like = "like",
  comment = "comment",
  follow = "follow",
  follow_request = "follow_request",
  follow_request_accepted = "follow_request_accepted",
}

export interface INotificationPostPreview {
  _id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
}

export interface INotification {
  _id: string;
  userId: string;
  type: ENotificationType;
  fromUserId: IUserPreview;
  postId?: string;
  post?: INotificationPostPreview;
  read: boolean;
  createdAt: string;
}

export const NOTIFICATION_TEXT: Record<ENotificationType, string> = {
  [ENotificationType.like]: "поставил(а) лайк",
  [ENotificationType.comment]: "прокомментировал(а)",
  [ENotificationType.follow]: "подписался(ась) на вас",
  [ENotificationType.follow_request]: "отправил(а) заявку на подписку",
  [ENotificationType.follow_request_accepted]: "принял(а) вашу заявку",
};
