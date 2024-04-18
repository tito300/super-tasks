import {
  AccordionDetails,
  accordionDetailsClasses,
  collapseClasses,
  styled,
} from "@mui/material";

export const DockStationAccordionDetails = styled(AccordionDetails)(
  ({ theme }) => ({
    maxHeight: "50vh",
    overflowY: "auto",
    overflowX: "clip",
    padding: theme.spacing(0, 1, 2),
  })
);
