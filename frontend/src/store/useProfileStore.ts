import { create } from "zustand";
import type { IPublicUser } from "../types/user";
import type { ISocialStatus } from "../types/social";

interface IProfileStore {
  profile: IPublicUser | null;
  status: ISocialStatus | null;
  setProfile: (profile: IPublicUser | null) => void;
  setStatus: (status: ISocialStatus | null) => void;
  updateProfile: (patch: Partial<IPublicUser>) => void;
  adjustFollowers: (delta: number) => void;
  adjustFollowing: (delta: number) => void;
}

export const useProfileStore = create<IProfileStore>((set) => ({
  profile: null,
  status: null,

  setProfile: (profile) => set({ profile }),

  setStatus: (status) => set({ status }),

  updateProfile: (patch) =>
    set((state) =>
      state.profile ? { profile: { ...state.profile, ...patch } } : state,
    ),

  adjustFollowers: (delta) =>
    set((state) =>
      state.profile
        ? {
            profile: {
              ...state.profile,
              followersCount: Math.max(0, state.profile.followersCount + delta),
            },
          }
        : state,
    ),

  adjustFollowing: (delta) =>
    set((state) =>
      state.profile
        ? {
            profile: {
              ...state.profile,
              followingCount: Math.max(0, state.profile.followingCount + delta),
            },
          }
        : state,
    ),
}));

export const useProfile = () => useProfileStore();
