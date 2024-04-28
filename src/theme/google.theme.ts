import { createTheme, Theme } from "@mui/material";
import { blue, cyan } from "@mui/material/colors";
import { deepmerge } from "@mui/utils";
import { Button, ButtonProps } from "@mui/material";

export const commonTheme: Theme = createTheme({
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

export const calendarTheme = deepmerge(commonTheme, {
  palette: {
    primary: {
      main: blue[600],
      light: blue[400],
      dark: blue[800],
      contrastText: "#fff",
    },
    background: {
      accent: blue[600],
    },
  },
  components: {},
} as Theme);

export const tasksTheme = deepmerge(calendarTheme, {
  palette: {
    background: {},
  },
} as Theme);
