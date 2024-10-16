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
import { useEffect, useState } from "react";
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

export default function AppOauthPicker(paperProps: PaperProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedApps, setSelectedApps] = useState({
    gTasks: false,
    gCalendar: false,
    chatgpt: false,
  });
  const scriptType = useScriptType();
  const { data: userState, dataSyncing } = useUserState();

  useEffect(() => {
    if (!dataSyncing) {
      const { gTasks, gCalendar } = userState.selectedApps;

      if (userState.tokens.google) {
        setSelectedApps((selectedApps) => {
          return {
            ...selectedApps,
            gTasks: !!gTasks,
            gCalendar: !!gCalendar,
          };
        });
      }
    }
  }, [dataSyncing]);

  const handleAppClick = (app: keyof typeof selectedApps) => {
    setSelectedApps((selected) => {
      return { ...selected, [app]: !selected[app] };
    });
  };

  const getSelectedScopes = () => {
    const selectedScopes: string[] = [];
    if (selectedApps.gTasks) {
      selectedScopes.push(scopes.google.tasks);
    }
    if (selectedApps.gCalendar) {
      selectedScopes.push(scopes.google.calendar);
    }
    return selectedScopes;
  };

  const selectedScopes = getSelectedScopes();

  return (
    <Paper {...paperProps} sx={{ px: 2, py: 2, ...paperProps.sx }}>
      {scriptType === "Popup" ? (
        <Stack>
          <Typography variant="h6">Pick your Applications</Typography>
          <Typography variant="subtitle2" pb={1.5}>
            Don't worry, you can change this later.
          </Typography>
          <Stack direction="row" gap={1}>
            {/* {!step && (
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
            )} */}
            {step === 1 && (
              // && selectedApp === "google"
              <>
                <AppImg
                  title="Google Calendar"
                  selected={selectedApps.gCalendar}
                  onClick={() => handleAppClick("gCalendar")}
                  src={googleCalendar}
                />
                <AppImg
                  title="Google Tasks"
                  selected={selectedApps.gTasks}
                  onClick={() => handleAppClick("gTasks")}
                  src={`chrome-extension://${extensionId}${googleTasks}`}
                />
                <AppImg
                  title="Chatgpt"
                  selected={selectedApps.chatgpt}
                  src={`chrome-extension://${extensionId}${chatgptIcon}`}
                  onClick={() => handleAppClick("chatgpt")}
                />
              </>
            )}
          </Stack>
          <Stack direction="row" justifyContent="flex-end" marginTop={1}>
            {step === 0 && (
              <Button
                disabled={!selectedApps}
                variant="contained"
                onClick={() => setStep((step) => step + 1)}
              >
                Next
              </Button>
            )}
            {step === 1 && (
              // && selectedApp === "google"
              <GoogleOauthButton
                disabled={!selectedScopes.length}
                selectedScopes={selectedScopes}
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
        if (!tokenRes?.token) return;

        updateData({
          tokens: {
            ...tokens,
            google: tokenRes.token,
          },
          selectedApps: {
            gCalendar: !!tokenRes?.grantedScopes?.includes(
              scopes.google.calendar
            ),

            gTasks: !!tokenRes?.grantedScopes?.includes(scopes.google.tasks),
            chatGpt: false,
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
          border: "2px solid transparent",
          boxShadow: (theme) => theme.shadows[2],
          "&:hover": { boxShadow: (theme) => theme.shadows[4] },
          ...(selected && {
            borderColor: "primary.main",
            boxShadow: (theme) => theme.shadows[0],
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
