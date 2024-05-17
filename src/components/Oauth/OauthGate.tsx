import {
  HTMLProps,
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useServicesContext } from "../Providers/ServicesProvider";
import { OauthScreen } from "./OauthScreen";
import { useMessageEngine } from "../Providers/MessageEngineProvider";
import AppOauthPicker, { scopes } from "./AppOauthPicker";
import { useUserState } from "../Providers/UserStateProvider";

export function OauthRequired({
  children,
  ...rest
}: PropsWithChildren & HTMLProps<HTMLDivElement>) {
  const tokenSetRef = useRef(false);
  const { data: useState, updateData: updateUserState } = useUserState();
  const { user: userServices } = useServicesContext();
  const messageEngine = useMessageEngine();

  useEffect(() => {
    console.log("mounted OauthRequired");
  }, []);

  useLayoutEffect(() => {
    userServices.getAuthToken({ interactive: false }).then((tokenRes) => {
      updateUserState({
        tokens: {
          ...useState.tokens,
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

    messageEngine.onMessage("ReAuthenticate", async () => {
      updateUserState({
        tokens: {
          ...useState.tokens,
          google: {
            token: null,
            scopesGranted: {
              calendar: false,
              tasks: false,
            },
          },
        },
      });
    });
  }, []);

  if (document.location.href.includes("accounts.google.com/signin/oauth"))
    return null;

  const hasOneAppToken = useState.tokens.google?.token;

  return (
    <div {...rest}>
      {!tokenSetRef.current ? null : !hasOneAppToken ? (
        <AppOauthPicker />
      ) : (
        children
      )}
    </div>
  );
}
