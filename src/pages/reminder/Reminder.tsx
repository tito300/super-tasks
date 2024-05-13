import { Notifications } from "@mui/icons-material";
import { Alert, AlertTitle, Button, Stack, alertClasses, styled } from "@mui/material";

export function Reminder() {
  return (
    <AlertStyled
      icon={<Notifications />}
      severity="warning"
      slotProps={{ }}
      action={<></>
        // <Stack direction={"row"} alignItems={"center"}>
        //   <Button size="small" color="warning">Snooze</Button>
        //   <Button size="small" color="success" variant="outlined">Clear</Button>
        // </Stack>
      }
    >
      <AlertTitle sx={{ mb: 0 }}>Reminder</AlertTitle>
      Check your tasks.
    </AlertStyled>
  );
}

const AlertStyled = styled(Alert)(() => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  [`& .${alertClasses.action}`]: {
    pl: 0.5,
    alignItems: "center",
  }
}));
