import Accordion, { AccordionProps } from "@mui/material/Accordion";
import { useUIControls } from "@src/components/Providers/UIControlsProvider";
import { useMemo } from "react";

export function DockStationAccordion({ children, ...props }: AccordionProps) {
  const { userSettings } = useUIControls();
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
