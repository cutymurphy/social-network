import type { ReactNode } from "react";
import type { IAuthUser } from "../types/user";
import type { ILoginRequest, IRegisterRequest } from "../types/auth";

export interface IAuthContextValue {
  user: IAuthUser | null;
  loading: boolean;
  login: (data: ILoginRequest) => Promise<void>;
  register: (data: IRegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

export interface IAuthProviderProps {
  children: ReactNode;
}
