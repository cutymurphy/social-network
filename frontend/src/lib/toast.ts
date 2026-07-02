import { toast } from "sonner";
import { ApiError } from "../api/client";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid credentials": "Неверный email или пароль",
  "User already exists": "Пользователь с таким email уже существует",
  "Old password is incorrect": "Введен некорректный старый пароль",
};

export const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof ApiError) {
    return AUTH_ERROR_MESSAGES[err.message] ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};

export const toastError = (err: unknown, fallback = "Что-то пошло не так") => {
  toast.error(getErrorMessage(err, fallback));
};

export const toastSuccess = (message: string) => {
  toast.success(message);
};

export const toastInfo = (message: string) => {
  toast.info(message);
};
