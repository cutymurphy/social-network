export enum ERoutes {
  main = "/",
  login = "/login",
  register = "/register",
  create = "/create",
  search = "/search",
  profile = "/profile",
  settings = "/settings",
  post = "/post",
  notifications = "/notifications",
  requests = "/requests",
}

export enum EProfileRoutes {
  followers = "followers",
  following = "following",
}

export const profilePath = (id: string) => `${ERoutes.profile}/${id}`;

export const profileFollowersPath = (id: string) =>
  `${ERoutes.profile}/${id}/${EProfileRoutes.followers}`;

export const profileFollowingPath = (id: string) =>
  `${ERoutes.profile}/${id}/${EProfileRoutes.following}`;

export const postPath = (id: string) => `${ERoutes.post}/${id}`;
