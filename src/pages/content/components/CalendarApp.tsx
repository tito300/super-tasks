import { AccordionSummary, Stack } from "@mui/material";
import { CalendarListManager } from "@src/components/Calendar/CalendarListManager";
import { DockStationAccordion } from "./DockStationAccordion";
import { DockStationAccordionDetails } from "./DockStationAccordionDetails";
import { DockStationAccordionSummary } from "./DockStationAccordionSummary";
import { ArrowDropDown } from "@mui/icons-material";
import { CalendarAccordionSummary } from "./CalendarAccordionSummary";
import { AccordionSummaryStyled } from "./AccordionSummary.styled";
import { CalendarGlobalStateProvider } from "@src/components/Providers/CalendarGlobalStateProvider";
import { CalendarLocalStateProvider } from "@src/components/Providers/CalendarLocalStateProvider";
import { CalendarSettingsProvider } from "@src/components/Providers/CalendarSettingsProvider";

export function CalendarApp() {
  return (
    <CalendarSettingsProvider>
      <CalendarGlobalStateProvider>
        <CalendarLocalStateProvider>
          <DockStationAccordion>
            <AccordionSummaryStyled expandIcon={<ArrowDropDown />}>
              <CalendarAccordionSummary />
            </AccordionSummaryStyled>
            <DockStationAccordionDetails id="accordion-details">
              <Stack
                sx={{ height: "50vh", overflowY: "auto", overflowX: "clip" }}
              >
                <CalendarListManager />
              </Stack>
            </DockStationAccordionDetails>
          </DockStationAccordion>
        </CalendarLocalStateProvider>
      </CalendarGlobalStateProvider>
    </CalendarSettingsProvider>
  );
}
