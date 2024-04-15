import { TypeBackground, TypeBackgroundOptions } from "@mui/material";

declare module "@mui/material" {
  interface TypeBackground {
    accent: string;
  }
  interface TypeBackgroundOptions {
    accent?: string;
  }
}
