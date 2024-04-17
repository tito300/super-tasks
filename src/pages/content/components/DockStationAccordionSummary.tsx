import { ArrowDropDown } from "@mui/icons-material";
import {
  AccordionSummary as MuiAccordionSummary,
  Typography,
  accordionSummaryClasses,
  styled,
} from "@mui/material";
import { useTasks } from "@src/api/task.api";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.background.accent,
  width: "100%",
  [`& .${accordionSummaryClasses.content}`]: {
    width: "100%",
  },
}));

export function DockStationAccordionSummary() {
  const { selectedTaskListId } = useTasksGlobalState();
  const { data: tasks, isFetching } = useTasks({ listId: selectedTaskListId });
  const title = isFetching
    ? "loading..."
    : tasks.find((task) => task.status !== "completed" && task.title && task.id)
        ?.title;

  return (
    <AccordionSummary expandIcon={<ArrowDropDown />}>
      <Typography
        fontWeight={500}
        pl={1}
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
      >
        {title}
      </Typography>
    </AccordionSummary>
  );
}
