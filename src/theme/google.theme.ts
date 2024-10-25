import { Theme } from "@mui/material";
import { blue } from "@mui/material/colors";
import { deepmerge } from "@mui/utils";
import { commonTheme } from "./common.theme";

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
    primary: {},
  },
} as Theme);
