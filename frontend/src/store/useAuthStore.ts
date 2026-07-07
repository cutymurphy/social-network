import { create } from "zustand";
import { setAccessToken, setOnUnauthorized } from "../api/client";
import * as authApi from "../api/auth";
import type { IAuthUser } from "../types/user";
import type { ILoginRequest, IRegisterRequest } from "../types/auth";

interface IAuthStore {
  user: IAuthUser | null;
  loading: boolean;
  init: () => Promise<void>;
  reloadUser: () => Promise<void>;
  login: (data: ILoginRequest) => Promise<void>;
  register: (data: IRegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  loading: true,

  init: async () => {
    try {
      const { accessToken } = await authApi.refresh();
      setAccessToken(accessToken);
      const me = await authApi.getMe();
      set({ user: me });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  reloadUser: async () => {
    const me = await authApi.getMe();
    set({ user: me });
  },

  login: async (data) => {
    const { accessToken } = await authApi.login(data);
    setAccessToken(accessToken);
    const me = await authApi.getMe();
    set({ user: me });
  },

  register: async (data) => {
    const { accessToken } = await authApi.register(data);
    setAccessToken(accessToken);
    const me = await authApi.getMe();
    set({ user: me });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {}
    setAccessToken(null);
    set({ user: null });
  },
}));

setOnUnauthorized(() => {
  setAccessToken(null);
  useAuthStore.setState({ user: null });
});

export const useAuth = () => useAuthStore();
