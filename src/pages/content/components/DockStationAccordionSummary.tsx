import { ArrowDropDown } from "@mui/icons-material";
import { AccordionSummary, Typography } from "@mui/material";
import { useTasks } from "@src/api/task.api";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";

export function DockStationAccordionSummary() {
  const { selectedTaskListId } = useTasksGlobalState();
  const { data: tasks, isFetching } = useTasks({ listId: selectedTaskListId });
  const title = isFetching
    ? "loading..."
    : tasks.find((task) => task.status !== "completed" && task.title)?.title;

  return (
    <AccordionSummary
      sx={{ backgroundColor: (theme) => theme.palette.background.accent }}
      expandIcon={<ArrowDropDown />}
    >
      <Typography fontWeight={500}>{title}</Typography>
    </AccordionSummary>
  );
}
