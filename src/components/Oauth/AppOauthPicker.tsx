import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Paper,
  PaperProps,
  Stack,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import googleCalendar from "@assets/img/google-calendar-icon.png";
import googleTasks from "@assets/img/google-tasks-icon.png";
import googleIcon from "@assets/img/google-icon.png";
import chatgptIcon from "@assets/img/chatgpt-icon.png";
import { useState } from "react";
import { useUserState } from "../Providers/UserStateProvider";
import { useServicesContext } from "../Providers/ServicesProvider";
import { useScriptType } from "../Providers/ScriptTypeProvider";
import { constants } from "@src/config/constants";

const extensionId = chrome.runtime.id;

export const scopes = {
  google: {
    calendar: "https://www.googleapis.com/auth/calendar",
    tasks: "https://www.googleapis.com/auth/tasks",
  },
};

export default function AppOauthPicker() {
  const [step, setStep] = useState<number>(0);
  const [selectedApp, setSelectedApp] = useState<"google" | "chatgpt" | null>(
    null
  );
  const scriptType = useScriptType();
  const [selectedAppScopes, setSelectedAppScopes] = useState<string[]>([]);

  const handleScopeClick = (scope: string) => {
    setSelectedAppScopes((scopes) => {
      if (!scopes.includes(scope)) {
        scopes.push(scope);
        return [...scopes];
      } else {
        return scopes.filter((s) => s !== scope);
      }
    });
  };

  return (
    <Paper sx={{ px: 2, py: 2 }}>
      {scriptType === "Popup" ? (
        <Stack>
          <Typography variant="h6">Pick your Applications</Typography>
          <Typography variant="subtitle2" pb={1.5}>
            Don't worry, you can change this later.
          </Typography>
          <Stack direction="row" gap={1}>
            {!step && (
              <>
                <AppImg
                  title="Google"
                  selected={selectedApp === "google"}
                  src={`chrome-extension://${extensionId}${googleIcon}`}
                  onClick={() => {
                    setSelectedApp("google");
                  }}
                />
                <AppImg
                  title="Chatgpt"
                  selected={selectedApp === "chatgpt"}
                  src={`chrome-extension://${extensionId}${chatgptIcon}`}
                  onClick={() => {
                    setSelectedApp("chatgpt");
                  }}
                />
              </>
            )}
            {step === 1 && selectedApp === "google" && (
              <>
                <AppImg
                  title="Google Calendar"
                  selected={selectedAppScopes.includes(scopes.google.calendar)}
                  onClick={() => handleScopeClick(scopes.google.calendar)}
                  src={googleCalendar}
                />
                <AppImg
                  title="Google Tasks"
                  selected={selectedAppScopes.includes(scopes.google.tasks)}
                  onClick={() => handleScopeClick(scopes.google.tasks)}
                  src={`chrome-extension://${extensionId}${googleTasks}`}
                />
              </>
            )}
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            {step === 0 && (
              <Button
                disabled={!selectedApp}
                variant="contained"
                onClick={() => setStep((step) => step + 1)}
              >
                Next
              </Button>
            )}
            {step === 1 && selectedApp === "google" && (
              <GoogleOauthButton
                disabled={!selectedAppScopes.length}
                selectedScopes={selectedAppScopes}
              />
            )}
          </Stack>
        </Stack>
      ) : (
        <Stack>
          <Typography variant="h6">
            {constants.EXTENSION_NAME_CAPITALIZED}
          </Typography>
          <Typography variant="subtitle2" pb={1.5}>
            To use {constants.EXTENSION_NAME_CAPITALIZED}, select your
            applications by clicking on the extension icon in the browser
            toolbar.
          </Typography>
        </Stack>
      )}
    </Paper>
  );
}

const GoogleOauthButton = (
  props: ButtonProps & { selectedScopes: string[] }
) => {
  const { user: userServices } = useServicesContext();
  const {
    data: { tokens },
    updateData,
  } = useUserState();
  const { selectedScopes, ...rest } = props;

  const handleClick = async () => {
    userServices
      .getGoogleAuthToken({ interactive: true, scopes: selectedScopes })
      .then((tokenRes) => {
        updateData({
          tokens: {
            ...tokens,
            google: {
              token: tokenRes.token,
              scopesGranted: {
                calendar: tokenRes?.grantedScopes?.includes(
                  scopes.google.calendar
                ),
                tasks: tokenRes?.grantedScopes?.includes(scopes.google.tasks),
              },
            },
          },
        });
      });
  };
  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      startIcon={
        <IconImage
          src={`chrome-extension://${extensionId}${googleIcon}`}
          sx={{ width: 14, height: 14 }}
        />
      }
      {...rest}
      sx={{ textTransform: "none", ...rest.sx }}
    >
      Sign in with Google
    </Button>
  );
};

const AppImg = (props: PaperProps & { src: string; selected?: boolean }) => {
  const { src, selected, ...rest } = props;

  return (
    <Tooltip title={props.title}>
      <Paper
        elevation={0}
        onClick={props.onClick}
        {...rest}
        sx={{
          p: 1,
          cursor: "pointer",
          "&:hover": { boxShadow: (theme) => theme.shadows[3] },
          ...(selected && {
            border: "1px solid",
            borderColor: "primary.main",
            boxShadow: (theme) => theme.shadows[3],
          }),
          ...props.sx,
        }}
      >
        <IconImage src={src} />
      </Paper>
    </Tooltip>
  );
};

const IconImage = styled("img")(({ theme }) => ({
  width: 34,
  height: 34,
}));
export const AppOauthPickerContainer = styled(Stack)({});
