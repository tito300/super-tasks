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

  console.log("dataSyncing", dataSyncing);
  console.log("userState", userState.tokens);
  console.log("loading", loading);

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
      userServices
        .getGoogleAuthToken({ interactive: false, scopes: getGrantedScopes() })
        .then((tokenRes) => {
          if (!tokenRes.token) return;

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
    } else if (!dataSyncing) {
      setLoading(false);
    }
  }, [dataSyncing, userState?.tokens?.google]);

  useEffect(() => {
    messageEngine.onMessage("ReAuthenticate", async () => {
      updateUserState({
        tokens: {
          ...userState.tokens,
          google: "",
        },
      });
    });
  }, []);

  if (document.location.href.includes("accounts.google.com/signin/oauth"))
    return null;

  const hasOneAppToken = !!userState.tokens.google;

  return (
    <div {...rest}>
      {loading ? (
        <div>loading...</div>
      ) : !hasOneAppToken ? (
        <AppOauthPicker />
      ) : (
        children
      )}
    </div>
  );
}
