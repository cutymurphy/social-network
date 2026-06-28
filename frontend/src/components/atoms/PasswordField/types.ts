export interface IPasswordField {
  password: string;
  placeholder?: string;
  autoComplete?: string;
  error?: boolean;
  helperText?: string;
  setPassword: (password: string) => void;
}
