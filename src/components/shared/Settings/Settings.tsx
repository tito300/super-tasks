import { ExpandMore } from "@mui/icons-material";
import {
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button,
} from "@mui/material";
import { ExtensionSettings } from "./ExtensionSettings";
import { AiSettings } from "@src/components/chatGpt/settings/AiSettings";
import { useUserState } from "@src/components/Providers/UserStateProvider";
import { useServicesContext } from "@src/components/Providers/ServicesProvider";

export function Settings() {
  return (
    <Stack py={1.5}>
      <Typography px={2} variant="h5">
        Axess Settings
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Extension Settings
        </AccordionSummary>
        <AccordionDetails>
          <ExtensionSettings />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          AI Settings
        </AccordionSummary>
        <AccordionDetails>
          <AiSettings />
        </AccordionDetails>
      </Accordion>
      {/* <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Calendar Settings
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
        <AccordionActions>
          <Button>Cancel</Button>
          <Button>Agree</Button>
        </AccordionActions>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Tasks Settings
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
        <AccordionActions>
          <Button>Cancel</Button>
          <Button>Agree</Button>
        </AccordionActions>
      </Accordion> */}
      <Stack
        width="100%"
        direction="row"
        gap={1}
        px={2}
        py={1.5}
        alignItems="center"
        justifyContent={"flex-end"}
      >
        <AddMoreIntegrations />
        <SignOut />
      </Stack>
    </Stack>
  );
}

function SignOut() {
  const { data: userState, updateData } = useUserState();
  const { user: userService } = useServicesContext();
  const handleClick = () => {
    userService.revokeUserToken(userState.tokens.google).then(() => {
      updateData({
        tokens: {
          ...userState.tokens,
          google: "",
        },
      });
    });
  };

  if (!userState.tokens.google) return null;

  return (
    <Button variant="contained" color="error" onClick={handleClick}>
      Sign Out
    </Button>
  );
}

function AddMoreIntegrations() {
  const { updateData } = useUserState();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        updateData({ currentTab: "add" });
      }}
    >
      Modify Integrations
    </Button>
  );
}
