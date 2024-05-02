import { Close, Remove } from "@mui/icons-material";
import { IconButton, styled } from "@mui/material";

const Container = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: "100%",
  display: "flex",
  boxShadow: theme.shadows[0],
  padding: 0,
  // borderTop: `1px solid ${theme.palette.grey[600]}`,
  // borderRight: `1px solid ${theme.palette.grey[600]}`,
  // borderBottom: `1px solid ${theme.palette.grey[600]}`,
  // backgroundColor: theme.palette.background.paper,
}));

export function DockStationControls({
  onMinimize,
  onRemove,
}: {
  onMinimize: () => void;
  onRemove: () => void;
}) {
  return (
    <Container>
      {/* <IconButton onClick={onMinimize} size="small" sx={{ fontSize: 15 }}>
        <Remove fontSize="inherit" />
      </IconButton> */}
      <IconButton
        onClick={onMinimize}
        size="small"
        color="primary"
        sx={{
          border: (theme) => `1px solid ${theme.palette.grey[400]}`,
          backgroundColor: (theme) => theme.palette.grey[100],
          fontSize: 15,
          p: 0,
        }}
      >
        <Close fontSize="inherit" color="inherit" />
      </IconButton>
    </Container>
  );
}
