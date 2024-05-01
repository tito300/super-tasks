import { ArrowDropDown } from "@mui/icons-material";
import {
  AccordionSummary as MuiAccordionSummary,
  accordionSummaryClasses,
  styled,
} from "@mui/material";
import { TasksAccordionSummary } from "./TasksAccordionSummary";
import { CalendarAccordionSummary } from "./CalendarAccordionSummary";
import { TabsManager } from "@src/components/TabsManager";

export const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.background.accent,
  width: "100%",
  borderRadius: "14px 16px 0 14px",
  [`&.${accordionSummaryClasses.expanded}`]: {
    minHeight: 45,
  },
  [`& .${accordionSummaryClasses.content}`]: {
    width: "100%",
    margin: 0,
    [`&.${accordionSummaryClasses.expanded}`]: {
      margin: 0,
    },
  },
}));

export function DockStationAccordionSummary() {
  return (
    <AccordionSummary expandIcon={<ArrowDropDown />}>
      <TabsManager
        hideTabs
        tabs={{
          tasks: <TasksAccordionSummary />,
          calendar: <CalendarAccordionSummary />,
        }}
      ></TabsManager>
    </AccordionSummary>
  );
}
