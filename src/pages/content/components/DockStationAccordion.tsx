import { collapseClasses, styled } from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { useMemo } from "react";

const Accordion = styled(MuiAccordion)(() => ({
  [`& .${collapseClasses.hidden}`]: {
    display: "none",
  },
}));

export function DockStationAccordion({ children, ...props }: AccordionProps) {
  const { userSettings } = useUserSettingsContext();
  const defaultExpanded = useMemo(
    () =>
      userSettings.tasksOpenOnNewTab &&
      document.location.search.includes("=newtab"),
    [userSettings.tasksOpenOnNewTab]
  );

  return (
    <Accordion defaultExpanded={defaultExpanded} {...props}>
      {children}
    </Accordion>
  );
}
