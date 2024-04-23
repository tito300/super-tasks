import { TypeBackground, TypeBackgroundOptions } from "@mui/material";

declare module "@mui/material" {
  interface TypeBackground {
    gTasks: string;
    gCalendar: string;
  }
  interface TypeBackgroundOptions {
    gTasks?: string;
    gCalendar?: string;
  }
}
