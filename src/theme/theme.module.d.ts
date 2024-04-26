import { PaletteColor, Palette } from "@mui/material";

declare module "@mui/material" {
  interface TypeBackground {
    accent: string;
  }
  interface TypeBackgroundOptions {
    accent?: string;
  }
}
