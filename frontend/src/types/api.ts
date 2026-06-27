import type { IHasMore } from "./common";
import type { IPost } from "./post";
import type { IComment } from "./comment";
import type { IUserPreview } from "./user";
import type { INotification } from "./notification";
import type {
  IFollowEdgeFollowing,
  IFollowEdgeFollower,
  IFollowRequestIncoming,
  IFollowRequestOutgoing,
} from "./follow";

export interface ITokenResponse {
  accessToken: string;
}

export interface ISuccessResponse {
  success: boolean;
}

export interface IFollowResponse extends ISuccessResponse {
  pending?: boolean;
}

export interface IAvatarResponse {
  avatarUrl: string;
}

export interface IFeedResponse extends IHasMore {
  posts: IPost[];
}

export interface IUserPostsResponse extends IHasMore {
  posts: IPost[];
}

export interface ICommentsResponse extends IHasMore {
  comments: IComment[];
}

export interface ISearchResponse extends IHasMore {
  users: IUserPreview[];
}

export interface INotificationsResponse extends IHasMore {
  notifications: INotification[];
}

export interface IFollowingResponse extends IHasMore {
  followings: IFollowEdgeFollowing[];
}

export interface IFollowersResponse extends IHasMore {
  followers: IFollowEdgeFollower[];
}

export interface IIncomingRequestsResponse extends IHasMore {
  incomingRequests: IFollowRequestIncoming[];
}

export interface IOutgoingRequestsResponse extends IHasMore {
  outgoingRequests: IFollowRequestOutgoing[];
}
