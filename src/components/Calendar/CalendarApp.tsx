import { AccordionSummary, Stack } from "@mui/material";
import { CalendarListManager } from "@src/components/Calendar/CalendarListManager";
import { DockStationAccordion } from "../../pages/content/components/DockStationAccordion";
import { DockStationAccordionDetails } from "../../pages/content/components/DockStationAccordionDetails";
import { ArrowDropDown } from "@mui/icons-material";
import { CalendarAccordionSummary } from "../../pages/content/components/CalendarAccordionSummary";
import { AccordionSummaryStyled } from "../../pages/content/components/AccordionSummary.styled";
import { CalendarsStateProvider } from "@src/components/Providers/CalendarStateProvider";
import { CalendarSettingsProvider } from "@src/components/Providers/CalendarSettingsProvider";
import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";
import { constants } from "@src/config/constants";

export function CalendarApp() {
  const scriptType = useScriptType();

  return (
    // <CalendarSettingsProvider>
    //   <CalendarsStateProvider>
    // scriptType === "Content" ? (
    //   <DockStationAccordion>
    //     <AccordionSummaryStyled expandIcon={<ArrowDropDown />}>
    //       <CalendarAccordionSummary />
    //     </AccordionSummaryStyled>
    //     <DockStationAccordionDetails id="accordion-details">
    //       <Stack
    //         id={`${constants.EXTENSION_NAME}-scrollable-container`}
    //         sx={{ height: "50vh", overflowY: "auto", overflowX: "clip" }}
    //       >
    //         <CalendarListManager />
    //       </Stack>
    //     </DockStationAccordionDetails>
    //   </DockStationAccordion>
    // ) : (

    <CalendarListManager />
    // )
    //   </CalendarsStateProvider>
    // </CalendarSettingsProvider>
  );
}
