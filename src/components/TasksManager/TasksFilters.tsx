import { ChipProps, Chip, Stack } from "@mui/material";
import { useUserSettingsContext } from "../Providers/UserSettingsContext";

export function TasksFilters() {
  const { userSettings, updateUserSettings } = useUserSettingsContext();

  function handleFilterClick(filter: keyof typeof userSettings.tasksFilters) {
    updateUserSettings({
      tasksFilters: {
        ...userSettings.tasksFilters,
        [filter]: !userSettings.tasksFilters[filter],
      },
    });
  }
  return (
    <Stack direction="row" mb={0.5} px={0.5} gap={0.5}>
      <TaskFilterChip
        onClick={() => handleFilterClick("today")}
        selected={userSettings.tasksFilters.today}
        label="Today"
      />
      <TaskFilterChip
        onClick={() => handleFilterClick("pastDue")}
        selected={userSettings.tasksFilters.pastDue}
        label="Past Due"
      />
      <TaskFilterChip
        onClick={() => handleFilterClick("upcoming")}
        selected={userSettings.tasksFilters.upcoming}
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
