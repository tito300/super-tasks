import {
  AccordionDetails,
  accordionDetailsClasses,
  collapseClasses,
  styled,
} from "@mui/material";

export const DockStationAccordionDetails = styled(AccordionDetails)(
  ({ theme }) => ({
    maxHeight: "60vh",
    overflowY: "auto",
    overflowX: "clip",
    padding: 0,
  })
);
