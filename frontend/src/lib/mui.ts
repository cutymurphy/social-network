import { createTheme } from "@mui/material/styles";

const autofillStyles = {
  WebkitBoxShadow: "0 0 0 100px #151521 inset",
  WebkitTextFillColor: "#ececec",
  transition: "background-color 5000s ease-in-out 0s",
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#5d4de3" },
    secondary: { main: "#34bbf2" },
    background: {
      default: "#151521",
      paper: "#151821",
    },
    text: {
      primary: "#ececec",
      secondary: "#5b5d6a",
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": autofillStyles,
          "&:-webkit-autofill:hover": autofillStyles,
          "&:-webkit-autofill:focus": autofillStyles,
          "&:-webkit-autofill:active": autofillStyles,
        },
      },
    },
  },
});
