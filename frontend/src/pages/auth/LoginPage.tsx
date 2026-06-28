import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { ERoutes } from "../../router";
import { toastError } from "../../lib/toast";
import styles from "./AuthPage.module.scss";
import {
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { PasswordField } from "../../components/atoms/PasswordField";
import { initialLogin, type ILoginRequest } from "../../types/auth";
import { validateField } from "../../utils/validation";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<ILoginRequest>({ ...initialLogin });
  const [errors, setErrors] = useState<ILoginRequest>({
    ...initialLogin,
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onChange = <K extends keyof ILoginRequest>(
    field: K,
    value: ILoginRequest[K],
  ) => {
    setData({ ...data, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const onChangePassword = (password: string) => {
    onChange("password", password);
  };

  const validate = () => {
    const errors: ILoginRequest = {
      email: validateField("email", data.email),
      password: validateField("password", data.password),
    };
    setErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(data);
      navigate(ERoutes.main);
    } catch (err) {
      toastError(err, "Ошибка входа");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <Typography variant="h5">Вход</Typography>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <TextField
          fullWidth
          type="email"
          label="Email"
          variant="outlined"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          helperText={errors.email}
          error={!!errors.email}
        />
        <PasswordField
          password={data.password}
          setPassword={onChangePassword}
          helperText={errors.password}
          error={!!errors.password}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{ height: "40px" }}
        >
          {submitting ? (
            <CircularProgress aria-label="Loading…" size="25px" />
          ) : (
            "Войти"
          )}
        </Button>
      </form>
      <Typography>
        Нет аккаунта? <Link href={ERoutes.register}>Регистрация</Link>
      </Typography>
    </main>
  );
};

export default LoginPage;
