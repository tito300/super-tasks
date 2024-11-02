import {
  HTMLProps,
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useServicesContext } from "../Providers/ServicesProvider";
import { useMessageEngine } from "../Providers/MessageEngineProvider";
import AppOauthPicker, { scopes } from "./AppOauthPicker";
import { useUserState } from "../Providers/UserStateProvider";

export function OauthRequired({
  children,
  ...rest
}: PropsWithChildren & HTMLProps<HTMLDivElement>) {
  const tokenSetRef = useRef(false);
  const {
    data: userState,
    updateData: updateUserState,
    dataSyncing,
  } = useUserState();
  const [loading, setLoading] = useState(true);
  const { user: userServices } = useServicesContext();
  const messageEngine = useMessageEngine();

  function getGrantedScopes() {
    const scopes = [];
    if (userState.selectedApps.gCalendar)
      scopes.push("https://www.googleapis.com/auth/calendar");
    if (userState.selectedApps.gTasks)
      scopes.push("https://www.googleapis.com/auth/tasks");
    return scopes;
  }

  useLayoutEffect(() => {
    if (userState.tokens.google) {
      userServices.setGoogleTokenHeader(userState.tokens.google);
    }
  }, [userState.tokens.google]);

  useEffect(() => {
    if (!dataSyncing && !userState.tokens.google) {
      getAuthToken();
    } else if (!dataSyncing) {
      setLoading(false);
    }
  }, [dataSyncing, userState?.tokens?.google]);

  useEffect(() => {
    messageEngine.onMessage("ReAuthenticate", async () => {
      getAuthToken({ retries: 1, resetToken: true });
    });
  }, []);

  function getAuthToken({
    retries = 0,
    resetToken = false,
  }: {
    retries?: number;
    resetToken?: boolean;
  } = {}) {
    userServices
      .getGoogleAuthToken({ interactive: false, scopes: getGrantedScopes() })
      .then((tokenRes) => {
        if (!tokenRes.token) {
          if (retries) {
            getAuthToken({ retries: retries - 1, resetToken });
            return;
          } else {
            if (resetToken) {
              updateUserState({
                tokens: {
                  ...userState.tokens,
                  google: "",
                },
              });
            }
            console.error("Failed to get google token");
            return;
          }
        }

        updateUserState({
          tokens: {
            ...userState.tokens,
            google: tokenRes.token,
          },
          selectedApps: {
            ...userState.selectedApps,
            gCalendar: !!tokenRes?.grantedScopes?.includes(
              scopes.google.calendar
            ),
            gTasks: !!tokenRes?.grantedScopes?.includes(scopes.google.tasks),
          },
        });
        tokenSetRef.current = true;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (document.location.href.includes("accounts.google.com/signin/oauth"))
    return null;

  const hasOneAppToken = !!userState.tokens.google;

  if (loading) return null;

  return <div {...rest}>{!hasOneAppToken ? <AppOauthPicker /> : children}</div>;
}
