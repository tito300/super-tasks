import { ArrowDropDown } from "@mui/icons-material";
import {
  Box,
  AccordionSummary as MuiAccordionSummary,
  accordionSummaryClasses,
  styled,
} from "@mui/material";
import { TasksAccordionSummary } from "./TasksAccordionSummary";
import { CalendarAccordionSummary } from "./CalendarAccordionSummary";
import { TabsManager } from "@src/components/TabsManager";
import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";

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
  ":hover #summary-tabs-container": {
    bottom: "calc(100% - 10px)",
    transition: "bottom 0.1s",
  }
}));

export function DockStationAccordionSummary() {
  const scriptSource = useScriptType();

  return (
    <AccordionSummary expandIcon={<ArrowDropDown />}>
      <TabsManager
        hideTabs={scriptSource === "Popup"}    
        tabs={{
          tasks: <TasksAccordionSummary />,
          calendar: <CalendarAccordionSummary />,
        }}
      ></TabsManager>
    </AccordionSummary>
  );
}
