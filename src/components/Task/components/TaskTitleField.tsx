import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { TaskForm } from "../Task";
import { ElementRef, KeyboardEvent, forwardRef, useRef } from "react";

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

  function handleKeyDown(e: KeyboardEvent) {
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
            autoFocus={focused}
            multiline
            onKeyDown={handleKeyDown}
            placeholder="Title..."
            variant="standard"
            size="small"
            sx={{
              pt: 0.7,
              ml: 1,
              textDecoration: strikeThrough ? "line-through" : "auto",
            }}
            inputProps={{ style: { paddingBottom: 0 } }}
            onFocus={onFocus}
            InputProps={{ disableUnderline: true }}
          />
        );
      }}
    ></Controller>
  );
});
