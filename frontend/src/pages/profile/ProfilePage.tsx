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
import { useAuth } from "../../store/useAuthStore";
import { useProfile } from "../../store/useProfileStore";
import { usePostsStore } from "../../store/usePostsStore";
import type { IPost } from "../../types/post";
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

  const {
    profile,
    status,
    setProfile,
    setStatus,
    updateProfile,
    adjustFollowers,
  } = useProfile();
  const [profileLoading, setProfileLoading] = useState<boolean>(true);

  const [posts, setPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [postsLoading, setPostsLoading] = useState<boolean>(true);
  const [privateBlocked, setPrivateBlocked] = useState<boolean>(false);
  const postsLoadingRef = useRef(false);
  const canViewPostsRef = useRef<boolean | undefined>(undefined);

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
        usePostsStore.getState().syncPosts(data.posts);
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

  const reloadPosts = useCallback(() => {
    setPosts([]);
    setSkip(0);
    setHasMore(false);
    setPrivateBlocked(false);
    setPostsLoading(true);
    loadPosts(0);
  }, [loadPosts]);

  const reloadStatus = async () => {
    setStatus(await socialApi.getStatus(id));
  };

  const handleFollow = async () => {
    try {
      const { pending } = await followsApi.follow(id);
      if (!pending) {
        adjustFollowers(1);
      }
      await reloadStatus();
    } catch (err) {
      toastError(err, "Не удалось подписаться");
    }
  };

  const handleUnfollow = async () => {
    try {
      await followsApi.unfollow(id);
      adjustFollowers(-1);
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
    let cancelled = false;

    setProfileLoading(true);
    setProfile(null);
    setStatus(null);

    const init = async () => {
      try {
        const profilePromise = usersApi.getUser(id);
        const statusPromise = isOwn ? null : socialApi.getStatus(id);

        const data = await profilePromise;
        if (cancelled) return;
        setProfile(data);

        if (statusPromise) {
          try {
            const socialStatus = await statusPromise;
            if (!cancelled) {
              setStatus(socialStatus);
            }
          } catch (err) {
            if (!cancelled) {
              toastError(err, "Не удалось загрузить статус подписки");
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          toastError(err, "Не удалось загрузить профиль");
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [id, isOwn, setProfile, setStatus]);

  useEffect(() => {
    canViewPostsRef.current = undefined;
    setPosts([]);
    setSkip(0);
    setHasMore(false);
    setPrivateBlocked(false);

    if (isOwn) {
      setPostsLoading(true);
      loadPosts(0);
    }
  }, [id, isOwn, loadPosts]);

  useEffect(() => {
    if (isOwn || !status || !profile) return;

    const canViewPosts = !profile.isPrivate || status.isFollowing;
    const prev = canViewPostsRef.current;

    if (prev === undefined) {
      canViewPostsRef.current = canViewPosts;
      setPostsLoading(true);
      loadPosts(0);
      return;
    }

    if (prev !== canViewPosts) {
      canViewPostsRef.current = canViewPosts;
      reloadPosts();
    }
  }, [status, profile, isOwn, loadPosts, reloadPosts]);

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
              onAvatarChange={(avatarUrl) => updateProfile({ avatarUrl })}
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
