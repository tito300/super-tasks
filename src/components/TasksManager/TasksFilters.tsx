import { ChipProps, Chip, Stack } from "@mui/material";
import { useTasksSettings } from "@src/api/task.api";

export function TasksFilters() {
  const { tasksSettings, updateTasksSettings } = useTasksSettings();
  const { tasksFilters } = tasksSettings;

  function handleFilterClick(filter: keyof typeof tasksFilters) {
    updateTasksSettings({
      tasksFilters: {
        ...tasksFilters,
        [filter]: !tasksFilters[filter],
      },
    });
  }
  return (
    <Stack direction="row" mb={0.5} px={0.5} gap={0.5}>
      <TaskFilterChip
        onClick={() => handleFilterClick("today")}
        selected={tasksFilters.today}
        label="Today"
      />
      <TaskFilterChip
        onClick={() => handleFilterClick("pastDue")}
        selected={tasksFilters.pastDue}
        label="Past Due"
      />
      <TaskFilterChip
        onClick={() => handleFilterClick("upcoming")}
        selected={tasksFilters.upcoming}
        label="Upcoming"
      />
    </Stack>
  );
}

function TaskFilterChip({
  selected,
  ...rest
}: { selected: boolean } & ChipProps) {
  return (
    <Chip
      size="small"
      sx={{
        cursor: "pointer",
        fontSize: 12,
        textTransform: "uppercase",
        boxShadow: selected ? 1 : 0,
      }}
      label="Today"
      color={selected ? "info" : "default"}
      {...rest}
    />
  );
}
