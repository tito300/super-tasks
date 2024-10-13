import { useUserState } from "./Providers/UserStateProvider";

export function AppRenderer({
  children,
}: {
  children: (ready: boolean) => React.ReactNode;
}) {
  const { dataSyncing } = useUserState();

  const ready = !dataSyncing;

  return children(ready);
}
