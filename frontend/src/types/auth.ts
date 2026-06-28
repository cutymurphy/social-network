export interface IRegisterRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export const initialRegister: IRegisterRequest = {
  email: "",
  nickname: "",
  password: "",
};

export const initialLogin: ILoginRequest = {
  email: "",
  password: "",
};
