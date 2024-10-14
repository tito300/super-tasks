import { Controller, useFormContext, useWatch } from "react-hook-form";
import { TaskForm } from "../Task";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Button, Chip, Stack, Typography } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(isYesterday);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(relativeTime);

export function TaskDate({ onSubmit }: { onSubmit: () => void }) {
  const [focused, setFocused] = useState(false);
  const formFields = useFormContext<TaskForm>();

  const title = useWatch({ name: "title", control: formFields.control });

  return (
    <Controller
      control={formFields.control}
      name="due"
      render={({ field }) => {
        const label = dayjs(field.value).isToday()
          ? "Today"
          : dayjs(field.value).isTomorrow()
          ? "Tomorrow"
          : dayjs(field.value).isYesterday()
          ? "Yesterday"
          : dayjs(field.value).fromNow();

        return focused ? (
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
        ) : field.value ? (
          <Chip onClick={() => setFocused(true)} label={label} size="small" />
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
        );
      }}
    />
  );
}
