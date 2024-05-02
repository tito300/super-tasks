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
}));

export function DockStationAccordionSummary() {
  const scriptSource = useScriptType();

  return (
    <AccordionSummary expandIcon={<ArrowDropDown />}>
      <TabsManager
        hideTabs={scriptSource === "Popup"}
        tabIconButtonProps={{
          color: "primary",
          onClick: (e) => e.stopPropagation(),
        }}
        renderTabsElement={(tabsEl) => (
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              bottom: "calc(100% - 10px)",
              right: 38,
              zIndex: -1,
              paddingBottom: 8,
              backgroundColor: (theme) => theme.palette.primary.main,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              padding: "0px 4px 6px",
            }}
          >
            {tabsEl}
          </Box>
        )}
        tabs={{
          tasks: <TasksAccordionSummary />,
          calendar: <CalendarAccordionSummary />,
        }}
      ></TabsManager>
    </AccordionSummary>
  );
}
