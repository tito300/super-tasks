import { Checkbox, TextField } from "@mui/material";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { TaskForm } from "../Task";
import { CheckCircle, CircleOutlined } from "@mui/icons-material";
import { useUpdateTask } from "../../../api/task.api";

export function CompletedCheckbox({ listId }: { listId: string }) {
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
              ...getValues(),
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
          icon={<CircleOutlined fontSize="small" />}
          checkedIcon={<CheckCircle fontSize="small" />}
        />
      )}
    ></Controller>
  );
}
