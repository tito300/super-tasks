import { styled } from "@mui/material";

export const StyledTask = styled("div")<{ pinned?: boolean }>(
  ({ theme, pinned }) => ({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    cursor: "pointer",
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    paddingLeft: theme.spacing(0.25),
    backgroundColor: pinned
      ? "rgb(182, 208, 225, 0.25)"
      : theme.palette.background.paper,
    " #supertasks-options": {
      visibility: "hidden",
    },
    " .supertasks-drag-icon": {
      visibility: "hidden",
    },
    ":hover, :focus-within": {
      backgroundColor: theme.palette.action.hover,

      " #supertasks-options": {
        visibility: "visible",
      },
      " .supertasks-drag-icon": {
        visibility: "visible",
      },

      " #axess-add-reminder-button, #axess-pin-task-button": {
        visibility: "visible",
      },
    },
  })
);

type ExpandedContainerProps = { expanded: boolean };
export const ExpandContainer = styled("div")<ExpandedContainerProps>(
  ({ expanded }) => ({
    overflow: "hidden",
    maxHeight: expanded ? "1000px" : "0px",
    transition: expanded ? "max-height 1.5s" : "none",
  })
);

export const TaskOptionsContainer = styled("div")(() => ({}));
