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
import { googleScopes } from "@src/config/googleScopes";
import { TabName } from "@src/config/settingsDefaults";
import { LoadingButton } from "@mui/lab";

const extensionId = chrome.runtime.id;
type SelectedApp = {
  gTasks: boolean;
  gCalendar: boolean;
  chatGpt: boolean;
};

export default function AppOauthPicker(paperProps: PaperProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedApps, setSelectedApps] = useState<SelectedApp>({
    gTasks: false,
    gCalendar: false,
    chatGpt: false,
  });
  const scriptType = useScriptType();
  const {
    data: { selectedApps: userSelectedApps, tokens, authWarningDismissed },
    dataSyncing,
    updateData: updateUserState,
  } = useUserState();
  const { user: userService } = useServicesContext();

  useEffect(() => {
    if (!dataSyncing) {
      const { gTasks, gCalendar, chatGpt } = userSelectedApps;

      setSelectedApps((selectedApps) => {
        return {
          ...selectedApps,
          gTasks: !!gTasks,
          gCalendar: !!gCalendar,
          chatGpt: !!chatGpt,
        };
      });
    }
  }, [dataSyncing]);

  const handleAppClick = (app: keyof typeof selectedApps) => {
    setSelectedApps((selected) => {
      return { ...selected, [app]: !selected[app] };
    });
  };

  const getSelectedScopes = () => {
    const selectedScopes: string[] = [googleScopes.email, googleScopes.openId];
    if (selectedApps.gTasks) {
      selectedScopes.push(googleScopes.tasks);
    }
    if (selectedApps.gCalendar) {
      selectedScopes.push(googleScopes.calendars);
    }
    return selectedScopes;
  };

  const handleClose = () => {
    updateUserState({
      authWarningDismissed: true,
      authWarningDismissedAt: Date.now(),
      buttonExpanded: false,
    });
  };

  const handleOpenPopup = () => {
    userService.openPopup();
  };

  const selectedScopes = getSelectedScopes();
  const hasSelectedApps = Object.values(selectedApps).some(
    (selected) => selected
  );
  const allAppsSelected = Object.values(userSelectedApps).every(
    (selected) => selected
  );
  const hasExistingSelectedApps = Object.values(userSelectedApps).some(
    (selected) => selected
  );

  if (authWarningDismissed && scriptType !== "Popup") return null;

  return (
    <Paper
      elevation={scriptType === "Popup" ? 0 : undefined}
      {...paperProps}
      sx={{ px: 2, py: 2, ...paperProps.sx }}
    >
      {scriptType === "Popup" ? (
        <Stack gap={1.5}>
          {hasExistingSelectedApps && (
            <Stack>
              <Typography variant="h6">Existing Applications</Typography>
              <Stack direction="row" gap={1}>
                {userSelectedApps.gCalendar && (
                  <AppImg
                    title="Google Calendar"
                    selected={selectedApps.gCalendar}
                    onClick={() => handleAppClick("gCalendar")}
                    src={googleCalendar}
                  />
                )}
                {userSelectedApps.gTasks && (
                  <AppImg
                    title="Google Tasks"
                    selected={selectedApps.gTasks}
                    onClick={() => handleAppClick("gTasks")}
                    src={`chrome-extension://${extensionId}${googleTasks}`}
                  />
                )}
                {userSelectedApps.chatGpt && (
                  <AppImg
                    title="Chatgpt"
                    selected={selectedApps.chatGpt}
                    src={`chrome-extension://${extensionId}${chatgptIcon}`}
                    onClick={() => handleAppClick("chatGpt")}
                  />
                )}
              </Stack>
            </Stack>
          )}
          <Stack>
            <Typography variant="h6">
              {allAppsSelected && hasExistingSelectedApps
                ? "Re-signin below"
                : hasExistingSelectedApps
                ? "Add more Applications"
                : "Pick your Applications"}
            </Typography>
            {!hasExistingSelectedApps && (
              <Typography variant="subtitle2" pb={1.5}>
                Don't worry, you can change this later.
              </Typography>
            )}
            <Stack direction="row" gap={1}>
              {!userSelectedApps.gCalendar && (
                <AppImg
                  title="Google Calendar"
                  selected={selectedApps.gCalendar}
                  onClick={() => handleAppClick("gCalendar")}
                  src={googleCalendar}
                />
              )}
              {!userSelectedApps.gTasks && (
                <AppImg
                  title="Google Tasks"
                  selected={selectedApps.gTasks}
                  onClick={() => handleAppClick("gTasks")}
                  src={`chrome-extension://${extensionId}${googleTasks}`}
                />
              )}
              {!userSelectedApps.chatGpt && (
                <AppImg
                  title="Chatgpt"
                  selected={selectedApps.chatGpt}
                  src={`chrome-extension://${extensionId}${chatgptIcon}`}
                  onClick={() => handleAppClick("chatGpt")}
                />
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
                  disabled={!hasSelectedApps}
                  selectedScopes={selectedScopes}
                  selectedApps={selectedApps}
                />
              )}
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <Stack>
          <Typography variant="h6">
            {constants.EXTENSION_NAME_CAPITALIZED}
          </Typography>
          <Typography variant="subtitle2" pb={1.5}>
            Sign in to get started!
          </Typography>
          <Stack direction="row" justifyContent="flex-end" gap={0.5}>
            <Button size="small" variant="contained" onClick={handleOpenPopup}>
              Sign In
            </Button>
            <Button size="small" variant="contained" onClick={handleClose}>
              Dismiss
            </Button>
          </Stack>
        </Stack>
      )}
    </Paper>
  );
}

const currentTabMap: Record<keyof SelectedApp, TabName> = {
  gTasks: "tasks",
  gCalendar: "calendar",
  chatGpt: "chatGpt",
};

const GoogleOauthButton = (
  props: ButtonProps & {
    selectedScopes: string[];
    selectedApps: { gTasks: boolean; gCalendar: boolean; chatGpt: boolean };
  }
) => {
  const [loading, setLoading] = useState(false);
  const { user: userServices } = useServicesContext();
  const {
    data: { tokens },
    updateData,
  } = useUserState();
  const { selectedScopes, selectedApps, ...rest } = props;

  const handleClick = async () => {
    setLoading(true);
    userServices
      .getGoogleAuthToken({ interactive: true, scopes: selectedScopes })
      .then(async (tokenRes) => {
        if (!tokenRes?.token) return;
        const grantedScopes = tokenRes.grantedScopes || [];

        const authorizedSelectedApps = {
          gTasks: grantedScopes.includes(googleScopes.tasks),
          gCalendar: grantedScopes.includes(googleScopes.calendars),
          chatGpt: selectedApps.chatGpt,
        };

        const { jwtToken, user } = await userServices
          .createUser({
            email: tokenRes.email,
            accountId: tokenRes.chromeId,
            subscriptionType: "free",
            googleToken: tokenRes.token,
          })
          .catch((err: any) => {
            console.error(err);
            return { jwtToken: "", user: { subscriptionType: "free" } };
          });

        userServices.setJwtTokenHeader(jwtToken);

        const currentApp = Object.keys(selectedApps).find(
          (app) => selectedApps[app as keyof typeof selectedApps]
        ) as keyof typeof selectedApps;

        updateData({
          tokens: {
            ...tokens,
            jwt: jwtToken,
            google: tokenRes.token,
          },
          currentTab: currentTabMap[currentApp] || "chatGpt",
          email: tokenRes.email,
          chromeId: tokenRes.chromeId,
          subscriptionType: user.subscriptionType,
          selectedApps: authorizedSelectedApps,
          authWarningDismissed: false,
          authWarningDismissedAt: null,
        });
      })
      .finally(() => setLoading(false));
  };
  return (
    <LoadingButton
      variant="outlined"
      loading={loading}
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
    </LoadingButton>
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
          border: "3px solid transparent",
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
