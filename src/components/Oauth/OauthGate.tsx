import {
  HTMLProps,
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useServices } from "../Providers/ServicesProvider";
import { OauthScreen } from "./OauthScreen";

export function OauthRequired({
  children,
  ...rest
}: PropsWithChildren & HTMLProps<HTMLDivElement>) {
  const tokenSetRef = useRef(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const { user: userServices } = useServices();

  useLayoutEffect(() => {
    userServices.getAuthToken({ interactive: false }).then((tokenRes) => {
      setToken(tokenRes.token);
      tokenSetRef.current = true;
    });
  }, []);

  const handleClick = async () => {
    userServices.getAuthToken({ interactive: true }).then((tokenRes) => {
      setToken(tokenRes.token);
    });
  };

  if (document.location.href.includes("accounts.google.com/signin/oauth"))
    return null;

  return (
    <div {...rest}>
      {!tokenSetRef.current ? null : !token ? (
        <OauthScreen onLoginCLick={handleClick} />
      ) : (
        children
      )}
    </div>
  );
}
