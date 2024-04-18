import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { TaskForm } from "../Task";
import { ElementRef, KeyboardEvent, forwardRef, useRef } from "react";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { constants } from "@src/config/constants";

export const TaskTitleField = forwardRef<
  HTMLDivElement,
  {
    onFocus: () => void;
    focused?: boolean;
    onblur: () => void;
    strikeThrough: boolean;
  }
>(({ onFocus, focused, onblur, strikeThrough }) => {
  const { control } = useFormContext<TaskForm>();
  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const { userSettings } = useUserSettingsContext();

  function handleKeyDown(e: KeyboardEvent) {
    // some websites take focus away on certain
    e.stopPropagation();
    if (e.key === "Enter") {
      onblur();
      textFieldRef.current?.blur();
    }
  }

  return (
    <Controller
      control={control}
      name="title"
      render={({ field }) => {
        return (
          <TextField
            inputRef={textFieldRef}
            {...field}
            id={`${constants.EXTENSION_NAME}-task-title-field`}
            autoFocus={focused}
            multiline
            onKeyDown={handleKeyDown}
            placeholder="Title..."
            variant="standard"
            size="small"
            sx={{
              pt: 0.7,
              ml: 1,
              filter: userSettings.blurText && !focused ? "blur(7px)" : "none",
              textDecoration: strikeThrough ? "line-through" : "auto",
            }}
            inputProps={{
              style: {
                paddingBottom: 0,
                cursor: focused ? "text" : "pointer",
              },
            }}
            onFocus={onFocus}
            InputProps={{ disableUnderline: true }}
          />
        );
      }}
    ></Controller>
  );
});
