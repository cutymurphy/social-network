import { toast } from 'sonner';
import { ApiError } from '../api/client';

export const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
};

export const toastError = (err: unknown, fallback = 'Что-то пошло не так') => {
  toast.error(getErrorMessage(err, fallback));
};

export const toastSuccess = (message: string) => {
  toast.success(message);
};
