import { Controller, useFormContext, useWatch } from "react-hook-form";
import { TaskForm } from "../Task";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import dayjs from "dayjs";

export function TaskDate({ onSubmit }: { onSubmit: () => void }) {
  const [focused, setFocused] = useState(false);
  const formFields = useFormContext<TaskForm>();

  const title = useWatch({ name: "title", control: formFields.control });

  return (
    <Controller
      control={formFields.control}
      name="due"
      render={({ field }) =>
        focused ? (
          <DatePicker
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => {
              field.onChange(date ? date?.toISOString() : null);
              onSubmit();
            }}
            sx={{ py: 1 }}
            slotProps={{ textField: { size: "small" } }}
          />
        ) : (
          <Button
            disabled={!title}
            startIcon={<CalendarMonth fontSize="small" />}
            onClick={() => setFocused(true)}
          >
            <Typography variant="subtitle2">Date/time</Typography>
          </Button>
        )
      }
    />
  );
}
