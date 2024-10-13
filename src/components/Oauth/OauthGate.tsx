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
import { getCommonHeaders, setupToken } from "@src/services/fetcher";

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
  const { user: userServices } = useServicesContext();
  const messageEngine = useMessageEngine();

  function getGrantedScopes() {
    const scopes = [];
    if (userState.tokens.google?.scopesGranted.calendar)
      scopes.push("https://www.googleapis.com/auth/calendar");
    if (userState.tokens.google?.scopesGranted.tasks)
      scopes.push("https://www.googleapis.com/auth/tasks");
    return scopes;
  }

  useLayoutEffect(() => {
    if (userState.tokens.google?.token) {
      userServices.setGoogleTokenHeader(userState.tokens.google.token);
    }
  }, [userState.tokens.google?.token]);

  useEffect(() => {
    if (!dataSyncing && !userState.tokens.google?.token) {
      userServices
        .getGoogleAuthToken({ interactive: false, scopes: getGrantedScopes() })
        .then((tokenRes) => {
          if (!tokenRes.token) return;

          updateUserState({
            tokens: {
              ...userState.tokens,
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
          tokenSetRef.current = true;
        });
    }
  }, [dataSyncing, userState?.tokens?.google?.token]);

  useEffect(() => {
    messageEngine.onMessage("ReAuthenticate", async () => {
      updateUserState({
        tokens: {
          ...userState.tokens,
          google: {
            ...(userState.tokens?.google || ({} as any)),
            token: null,
          },
        },
      });
    });
  }, []);

  if (document.location.href.includes("accounts.google.com/signin/oauth"))
    return null;

  const hasOneAppToken = !!userState.tokens.google?.token;

  return (
    <div {...rest}>
      {dataSyncing ? (
        <div>loading...</div>
      ) : !hasOneAppToken ? (
        <AppOauthPicker />
      ) : (
        children
      )}
    </div>
  );
}
