import { createTheme, Theme } from "@mui/material";

export const commonTheme: Theme = createTheme({
  typography: {
    htmlFontSize: 16,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
