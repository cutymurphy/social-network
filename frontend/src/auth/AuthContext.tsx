import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { FC } from "react";
import { setAccessToken, setOnUnauthorized } from "../api/client";
import * as authApi from "../api/auth";
import type { IAuthUser } from "../types/user";
import type { IAuthContextValue, IAuthProviderProps } from "./types";

const AuthContext = createContext<IAuthContextValue | null>(null);

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const reloadUser = useCallback(async () => {
    const me = await authApi.getMe();
    setUser(me);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken } = await authApi.login({ email, password });
    setAccessToken(accessToken);
    const me = await authApi.getMe();
    setUser(me);
  }, []);

  const register = useCallback(
    async (email: string, nickname: string, password: string) => {
      const { accessToken } = await authApi.register({
        email,
        nickname,
        password,
      });
      setAccessToken(accessToken);
      const me = await authApi.getMe();
      setUser(me);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      setAccessToken(null);
      setUser(null);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { accessToken } = await authApi.refresh();
        setAccessToken(accessToken);
        const me = await authApi.getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, reloadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
