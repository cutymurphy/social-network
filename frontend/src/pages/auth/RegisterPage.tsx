import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuthStore";
import { ERoutes } from "../../router";
import { toastError } from "../../lib/toast";
import styles from "./AuthPage.module.scss";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { PasswordField } from "../../components/atoms/PasswordField";
import { initialRegister, type IRegisterRequest } from "../../types/auth";
import { validateField } from "../../utils/validation";

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<IRegisterRequest>({ ...initialRegister });
  const [errors, setErrors] = useState<IRegisterRequest>({
    ...initialRegister,
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onChange = <K extends keyof IRegisterRequest>(
    field: K,
    value: IRegisterRequest[K],
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
    const errors: IRegisterRequest = {
      email: validateField("email", data.email),
      password: validateField("password", data.password),
      nickname: validateField("nickname", data.nickname),
    };
    setErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(data);
      navigate(ERoutes.main);
    } catch (err) {
      toastError(err, "Ошибка регистрации");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <Typography variant="h5">Регистрация</Typography>
      <form
        onSubmit={handleSubmit}
        className={styles.form}
        autoComplete="off"
        noValidate
      >
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
        <TextField
          fullWidth
          type="text"
          label="Никнейм"
          variant="outlined"
          value={data.nickname}
          onChange={(e) => onChange("nickname", e.target.value)}
          helperText={errors.nickname}
          error={!!errors.nickname}
        />
        <PasswordField
          password={data.password}
          setPassword={onChangePassword}
          placeholder="Пароль (мин. 6 символов)"
          autoComplete="new-password"
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
            "Зарегистрироваться"
          )}
        </Button>
      </form>
      <div className={styles.support}>
        <div>Уже есть аккаунт?</div>
        <Link to={ERoutes.login} style={{ color: "var(--purple)" }}>
          Войти
        </Link>
      </div>
    </main>
  );
};

export default RegisterPage;
