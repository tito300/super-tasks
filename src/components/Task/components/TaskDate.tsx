import { Controller, useFormContext, useWatch } from "react-hook-form";
import { TaskForm } from "../Task";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Button, Chip, Stack, Typography } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import dayjs from "dayjs";

export function TaskDate({ onSubmit }: { onSubmit: () => void }) {
  const [focused, setFocused] = useState(false);
  const formFields = useFormContext<TaskForm>();

  const title = useWatch({ name: "title", control: formFields.control });
  const due = formFields.getValues("due");

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
            open={focused}
            onClose={() => setFocused(false)}
            sx={{ py: 1, textTransform: "none" }}
            slotProps={{ textField: { size: "small" }, dialog: {} }}
          />
        ) : due ? (
          <Chip
            onClick={() => setFocused(true)}
            label={dayjs(due).format("DD/MM/YYYY")}
            size="small"
          />
        ) : (
          <Button
            disabled={!title}
            size="small"
            startIcon={<CalendarMonth sx={{ fontSize: 14 }} />}
            onClick={() => setFocused(true)}
            sx={{ p: (theme) => theme.spacing(0.25, 1.2) }}
          >
            <Typography fontSize={14} textTransform="none" variant="subtitle2">
              Date/time
            </Typography>
          </Button>
        )
      }
    />
  );
}
