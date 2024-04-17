import {
  HTMLProps,
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useServices } from "../Providers/ServicesProvider";
import { OauthScreen } from "./OauthScreen";

export function OauthRequired({
  children,
  ...rest
}: PropsWithChildren & HTMLProps<HTMLDivElement>) {
  const [token, setToken] = useState<string | undefined>(undefined);
  const { user: userServices } = useServices();

  useLayoutEffect(() => {
    userServices.getAuthToken({ interactive: false }).then((tokenRes) => {
      setToken(tokenRes.token);
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
      {!token ? <OauthScreen onLoginCLick={handleClick} /> : children}
    </div>
  );
}
