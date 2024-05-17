import { Hidden, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { TaskForm } from "../Task";
import { Notes } from "@mui/icons-material";
import { KeyboardEvent, useRef, useState } from "react";

export function DescriptionTextField({ onblur }: { onblur: () => void }) {
  const [focused, setFocused] = useState(false);
  const { control, getFieldState } = useFormContext<TaskForm>();
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Controller
      control={control}
      name="notes"
      render={({ field }) => (
        <TextField
          inputRef={textFieldRef}
          {...field}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onblur();
          }}
          draggable={focused ? false : true}
          onDragStart={(e) => (focused ? e.preventDefault() : undefined)}
          multiline
          variant="standard"
          size="small"
          sx={{ ml: 1, pt: 0.5 }}
          InputProps={{
            sx: {
              overflow: "auto",
              width: "100%",
              color: (theme) => theme.palette.text.secondary,
              pb: 0,
              fontSize: 16,
              lineHeight: 1,
            },
            disableUnderline: true,
            placeholder: "Details",
            startAdornment: !field.value && (
              <Notes color="disabled" sx={{ mr: 1, fontSize: 16 }} />
            ),
          }}
        />
      )}
    ></Controller>
  );
}
