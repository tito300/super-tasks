import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { TaskForm } from "../Task";
import { Notes } from "@mui/icons-material";
import { KeyboardEvent, useRef } from "react";

export function DescriptionTextField({ onblur }: { onblur: () => void }) {
  const { control } = useFormContext<TaskForm>();
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      onblur();
      textFieldRef.current?.blur();
    }
  }

  return (
    <Controller
      control={control}
      name="notes"
      render={({ field }) => (
        <TextField
          inputRef={textFieldRef}
          {...field}
          onKeyDown={handleKeyDown}
          variant="standard"
          size="small"
          sx={{ ml: 1 }}
          InputProps={{
            sx: {
              height: (theme) => theme.spacing(2.75),
              color: (theme) => theme.palette.text.secondary,
            },
            disableUnderline: true,
            placeholder: "Details",
            startAdornment: !field.value && (
              <Notes color="disabled" fontSize="small" sx={{ mr: 1 }} />
            ),
          }}
        />
      )}
    ></Controller>
  );
}
