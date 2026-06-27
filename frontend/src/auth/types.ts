import type { ReactNode } from "react";
import type { IAuthUser } from "../types/user";

export interface IAuthContextValue {
  user: IAuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    nickname: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

export interface IAuthProviderProps {
  children: ReactNode;
}
