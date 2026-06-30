import { EErrors } from "./errors";
import { emailPattern } from "./patterns";

export const validateField = (field: string, value: string): string => {
  switch (field) {
    case "nickname":
      return !value.trim()
        ? EErrors.ERROR_EMPTY
        : value.length < 3 || value.length > 30
          ? EErrors.ERROR_NICKNAME
          : "";
    case "bio":
      return !value.trim()
        ? EErrors.ERROR_EMPTY
        : value.length > 150
          ? EErrors.ERROR_BIO
          : "";
    case "email":
      return !value.trim()
        ? EErrors.ERROR_EMPTY
        : !emailPattern.test(value.trim())
          ? EErrors.ERROR_EMAIL
          : "";
    case "password":
      return !value.trim()
        ? EErrors.ERROR_EMPTY
        : value.length < 6
          ? EErrors.ERROR_PASSWORD
          : "";
    default:
      return "";
  }
};
