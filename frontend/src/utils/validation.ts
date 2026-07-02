import { EErrors } from "./errors";
import { emailPattern } from "./patterns";

export const validateField = (field: string, value: string): string => {
  const trimmed = value.trim();

  switch (field) {
    case "nickname":
      return !trimmed
        ? EErrors.ERROR_EMPTY
        : trimmed.length < 3 || trimmed.length > 30
          ? EErrors.ERROR_NICKNAME
          : "";

    case "bio":
      return trimmed.length > 150 ? EErrors.ERROR_BIO : "";

    case "email":
      return !trimmed
        ? EErrors.ERROR_EMPTY
        : !emailPattern.test(trimmed)
          ? EErrors.ERROR_EMAIL
          : "";

    case "password":
      return !value
        ? EErrors.ERROR_EMPTY
        : value.length < 6
          ? EErrors.ERROR_PASSWORD
          : "";

    default:
      return "";
  }
};
