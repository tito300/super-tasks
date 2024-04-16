import { Close, Remove } from "@mui/icons-material";
import { IconButton, styled } from "@mui/material";

const Container = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: "100%",
  right: 0,
  display: "flex",
  boxShadow: theme.shadows[0],
  padding: theme.spacing(0, 0.5),
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  borderTop: `1px solid ${theme.palette.divider}`,
  borderRight: `1px solid ${theme.palette.divider}`,
  borderLeft: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export function DockStationControls({
  onMinimize,
  onRemove,
}: {
  onMinimize: () => void;
  onRemove: () => void;
}) {
  console.log("render")
  return (
    <Container>
      <IconButton onClick={onRemove} size="small" sx={{ fontSize: 15 }}>
        <Close fontSize="inherit" />
      </IconButton>
      <IconButton onClick={onMinimize} size="small" sx={{ fontSize: 15 }}>
        <Remove fontSize="inherit" />
      </IconButton>
    </Container>
  );
}
