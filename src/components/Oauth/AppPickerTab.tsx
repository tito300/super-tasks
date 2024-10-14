import { ArrowDropDown } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { AccordionSummaryStyled } from "@src/pages/content/components/AccordionSummary.styled";
import { CalendarAccordionSummary } from "@src/pages/content/components/CalendarAccordionSummary";
import { DockStationAccordion } from "@src/pages/content/components/DockStationAccordion";
import { DockStationAccordionDetails } from "@src/pages/content/components/DockStationAccordionDetails";
import { useScriptType } from "../Providers/ScriptTypeProvider";
import AppOauthPicker from "./AppOauthPicker";
import { constants } from "@src/config/constants";

export function AppPickerTab() {
  const scriptType = useScriptType();

  return scriptType === "Content" ? (
    <DockStationAccordion>
      <AccordionSummaryStyled expandIcon={<ArrowDropDown />}>
        <div>Test</div>
      </AccordionSummaryStyled>
      <DockStationAccordionDetails id="accordion-details">
        <Stack
          id={`${constants.EXTENSION_NAME}-scrollable-container`}
          sx={{ height: "50vh", overflowY: "auto", overflowX: "clip" }}
        >
          <AppOauthPicker elevation={0} sx={{ marginTop: "100px" }} />
        </Stack>
      </DockStationAccordionDetails>
    </DockStationAccordion>
  ) : (
    <AppOauthPicker elevation={0} sx={{ marginTop: "100px" }} />
  );
}
