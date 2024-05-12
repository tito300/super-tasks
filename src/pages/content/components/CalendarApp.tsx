import { AccordionSummary, Stack } from "@mui/material";
import { CalendarListManager } from "@src/components/Calendar/CalendarListManager";
import { DockStationAccordion } from "./DockStationAccordion";
import { DockStationAccordionDetails } from "./DockStationAccordionDetails";
import { ArrowDropDown } from "@mui/icons-material";
import { CalendarAccordionSummary } from "./CalendarAccordionSummary";
import { AccordionSummaryStyled } from "./AccordionSummary.styled";
import { CalendarsStateProvider } from "@src/components/Providers/CalendarStateProvider";
import { CalendarSettingsProvider } from "@src/components/Providers/CalendarSettingsProvider";
import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";

export function CalendarApp() {
  const scriptType = useScriptType();

  return (
    // <CalendarSettingsProvider>
    //   <CalendarsStateProvider>
    scriptType === "Content" ? (
      <DockStationAccordion>
        <AccordionSummaryStyled expandIcon={<ArrowDropDown />}>
          <CalendarAccordionSummary />
        </AccordionSummaryStyled>
        <DockStationAccordionDetails id="accordion-details">
          <Stack sx={{ height: "50vh", overflowY: "auto", overflowX: "clip" }}>
            <CalendarListManager />
          </Stack>
        </DockStationAccordionDetails>
      </DockStationAccordion>
    ) : (
      <CalendarListManager />
    )
    //   </CalendarsStateProvider>
    // </CalendarSettingsProvider>
  );
}
