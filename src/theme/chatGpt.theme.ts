import { Theme } from "@mui/material";
import { blue, cyan } from "@mui/material/colors";
import { deepmerge } from "@mui/utils";
import { commonTheme } from "./common.theme";

export const chatGptTheme = deepmerge(commonTheme, {
  palette: {
    primary: {},
  },
} as Theme);
