import { Checkbox, CheckboxProps, TextField } from "@mui/material";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { TaskForm } from "../Task";
import { CheckCircle, CircleOutlined } from "@mui/icons-material";
import { useUpdateTask } from "../../../api/task.api";

export function CompletedCheckbox({
  listId,
  sx,
  ...rest
}: { listId: string } & CheckboxProps) {
  const { control, getValues } = useFormContext<TaskForm>();

  const updateMutation = useUpdateTask(listId);

  return (
    <Controller
      control={control}
      name="status"
      render={({ field }) => (
        <Checkbox
          onChange={(e) => {
            const checked = e.target.checked;
            const now = new Date().toISOString();
            updateMutation.mutate({
              id: getValues("id"),
              completed: checked ? now : undefined,
              status: checked ? "completed" : "needsAction",
            });
            field.onChange({
              ...e,
              target: {
                ...e.target,
                value: checked ? "completed" : "needsAction",
              },
            });
          }}
          checked={field.value === "completed"}
          size="small"
          sx={{ padding: 0.75, ...sx }}
          icon={<CircleOutlined fontSize="small" />}
          checkedIcon={<CheckCircle fontSize="small" />}
          {...rest}
        />
      )}
    ></Controller>
  );
}

// convert 24 hour time to 12 hour time with AM/PM
function convertHours(hours: number) {
  return hours > 12 ? `${hours - 12} PM` : `${hours} AM`;
}
