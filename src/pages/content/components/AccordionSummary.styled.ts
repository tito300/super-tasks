import { AccordionSummary, accordionSummaryClasses, styled } from "@mui/material";

export const AccordionSummaryStyled = styled(AccordionSummary)(({ theme }) => ({
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