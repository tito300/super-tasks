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

export function OauthRequired({
  children,
  ...rest
}: PropsWithChildren & HTMLProps<HTMLDivElement>) {
  const tokenSetRef = useRef(false);
  const [token, setToken] = useState<string | undefined | null>(undefined);
  const [requiredScopesGranted, setRequiredScopesGranted] = useState(false);
  const { user: userServices } = useServicesContext();
  const messageEngine = useMessageEngine();

  useLayoutEffect(() => {
    userServices.getAuthToken({ interactive: false }).then((tokenRes) => {
      setToken(tokenRes.token || "");
      setRequiredScopesGranted(!!tokenRes.requiredScopesGranted);
      tokenSetRef.current = true;
    });

    messageEngine.onMessage("ReAuthenticate", async () => {
      setToken(undefined);
    });
  }, []);

  const handleClick = async () => {
    userServices.getAuthToken({ interactive: true }).then((tokenRes) => {
      setToken(tokenRes.token);
      setRequiredScopesGranted(!!tokenRes.requiredScopesGranted);
    });
  };

  if (document.location.href.includes("accounts.google.com/signin/oauth"))
    return null;

  const missingRequiredScopes = !!token && !requiredScopesGranted;
  return (
    <div {...rest}>
      {!tokenSetRef.current ? null : !token || missingRequiredScopes ? (
        <OauthScreen missingRequiredScopes={missingRequiredScopes} onLoginCLick={handleClick} />
      ) : (
        children
      )}
    </div>
  );
}
