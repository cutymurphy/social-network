import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  createModalState,
  ERoutes,
  profileFollowersPath,
  profileFollowingPath,
} from "../../router";
import * as usersApi from "../../api/users";
import * as postsApi from "../../api/posts";
import * as socialApi from "../../api/social";
import * as followsApi from "../../api/follows";
import * as frApi from "../../api/followRequests";
import { ApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import type { IPost } from "../../types/post";
import type { IPublicUser } from "../../types/user";
import type { ISocialStatus } from "../../types/social";
import { PostList } from "../../components/organisms/PostList";
import { toastError } from "../../lib/toast";
import styles from "./ProfilePage.module.scss";
import { Avatar, Button, Typography } from "@mui/material";
import {
  getFollowersLabel,
  getFollowingLabel,
  getPostsLabel,
} from "../../utils/getWordForm";
import { UploadAvatar } from "../../components/atoms/UploadAvatar";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { SupportContent } from "../../components/atoms/SupportContent";
import { delay } from "../../utils/delay";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const LIMIT = 12;
const AVATAR_SIZE = "150px";

export const ProfilePage = () => {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const isOwn = user?.userId === id;

  const [profile, setProfile] = useState<IPublicUser | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<ISocialStatus | null>(null);

  const [posts, setPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [postsLoading, setPostsLoading] = useState<boolean>(true);
  const [privateBlocked, setPrivateBlocked] = useState<boolean>(false);
  const postsLoadingRef = useRef(false);

  const followersLinkProps = {
    to: profileFollowersPath(id),
    state: createModalState(location),
  };

  const followingLinkProps = {
    to: profileFollowingPath(id),
    state: createModalState(location),
  };

  const loadPosts = useCallback(
    async (currentSkip: number) => {
      if (postsLoadingRef.current) return;

      postsLoadingRef.current = true;
      await delay(1000);
      setPostsLoading(true);

      try {
        const data = await postsApi.getUserPosts(id, currentSkip, LIMIT);
        setPosts((prev) =>
          currentSkip === 0 ? data.posts : [...prev, ...data.posts],
        );
        setHasMore(data.hasMore);
        setSkip(currentSkip + data.posts.length);
        setPrivateBlocked(false);
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          setPrivateBlocked(true);
          setPosts([]);
          setHasMore(false);
        } else {
          toastError(err, "Не удалось загрузить посты");
        }
      } finally {
        postsLoadingRef.current = false;
        setPostsLoading(false);
      }
    },
    [id],
  );

  const reloadStatus = async () => {
    setStatus(await socialApi.getStatus(id));
  };

  const handleFollow = async () => {
    try {
      await followsApi.follow(id);
      await reloadStatus();
    } catch (err) {
      toastError(err, "Не удалось подписаться");
    }
  };

  const handleUnfollow = async () => {
    try {
      await followsApi.unfollow(id);
      await reloadStatus();
    } catch (err) {
      toastError(err, "Не удалось отписаться");
    }
  };

  const handleCancelRequest = async () => {
    try {
      await frApi.cancelRequest(id);
      await reloadStatus();
    } catch (err) {
      toastError(err, "Не удалось отменить заявку");
    }
  };

  useEffect(() => {
    setProfileLoading(true);
    setProfile(null);
    setStatus(null);

    const loadProfile = async () => {
      try {
        const data = await usersApi.getUser(id);
        setProfile(data);
      } catch (err) {
        toastError(err, "Не удалось загрузить профиль");
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();

    if (!isOwn) {
      socialApi
        .getStatus(id)
        .then(setStatus)
        .catch((err) => {
          toastError(err, "Не удалось загрузить статус подписки");
        });
    }
  }, [id, isOwn]);

  useEffect(() => {
    setPosts([]);
    setSkip(0);
    setHasMore(false);
    setPrivateBlocked(false);
    setPostsLoading(true);
    loadPosts(0);
  }, [loadPosts, status?.isFollowing]);

  if (profileLoading) {
    return <SupportContent isLoading={true} />;
  }

  if (!profile) {
    return (
      <SupportContent type="error" message="Не удалось загрузить профиль" />
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.profile}>
        <div className={styles.profileInfo}>
          {isOwn ? (
            <UploadAvatar
              src={profile.avatarUrl || ""}
              size={AVATAR_SIZE}
              onAvatarChange={(avatarUrl) =>
                setProfile((prev) =>
                  prev ? { ...prev, avatarUrl } : prev,
                )
              }
            />
          ) : (
            <Avatar
              src={profile?.avatarUrl || ""}
              sx={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
              }}
            />
          )}
          <div className={styles.info}>
            <div className={styles.nicknameWrapper}>
              <Typography variant="h5" className={styles.nickname}>
                {profile.nickname}
              </Typography>
              {isOwn && (
                <Link to={ERoutes.settings}>
                  <SettingsOutlinedIcon className={styles.settingsIcon} />
                </Link>
              )}
            </div>
            <span className={styles.bio}>{profile.bio}</span>
            <div className={styles.numberInfo}>
              <span>
                <b>{profile.postsCount}</b> {getPostsLabel(profile.postsCount)}
              </span>
              <Link {...followersLinkProps} className={styles.itemLink}>
                <span className={styles.followText}>
                  <b>{profile.followersCount}</b>{" "}
                  {getFollowersLabel(profile.followersCount)}
                </span>
              </Link>
              <Link {...followingLinkProps} className={styles.itemLink}>
                <span className={styles.followText}>
                  <b>{profile.followingCount}</b>{" "}
                  {getFollowingLabel(profile.followingCount)}
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.profileBtns}>
          {!isOwn && status && (
            <>
              {status.isFollowing ? (
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleUnfollow}
                  fullWidth
                >
                  Отписаться
                </Button>
              ) : status.hasOutgoingRequest ? (
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleCancelRequest}
                  fullWidth
                >
                  Отменить заявку
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleFollow}
                  fullWidth
                >
                  Подписаться
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <div className={styles.postsWrapper}>
        {privateBlocked ? (
          <div className={styles.privateMessage}>
            <LockOutlinedIcon
              sx={{
                width: "50px",
                height: "50px",
                border: "1.5px solid var(--grey)",
                padding: "8px",
                borderRadius: "100%",
              }}
            />
            Это закрытый профиль. Подпишитесь на этого пользователя, чтобы
            видеть его фото и видео.
          </div>
        ) : (
          <PostList
            posts={posts}
            hasMore={hasMore}
            loading={postsLoading}
            onLoadMore={() => loadPosts(skip)}
          />
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
