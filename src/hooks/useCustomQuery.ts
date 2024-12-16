import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useTabVisibility } from "./useTabVisibility";
import { useUserState } from "@src/components/Providers/UserStateProvider";
import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";
import { useEffect, useRef } from "react";

const minute = 1000 * 60;

export type UseCustomQueryOptions<T> = UseQueryOptions<T>;

export function useCustomQuery<T>(options: UseCustomQueryOptions<T>) {
  const optionsRef = useRef(options);
  const isTabVisible = useTabVisibility();
  const scriptType = useScriptType();
  const queryResultsRef = useRef<UseQueryResult<T>>(null!);
  const {
    data: { buttonExpanded },
  } = useUserState();

  optionsRef.current = options;

  useEffect(() => {
    if (buttonExpanded && isTabVisible) {
      queryResultsRef.current.refetch();
    }
  }, [buttonExpanded]);

  const enabled =
    options.enabled != null
      ? options.enabled
      : ["Popup", "Panel"].includes(scriptType)
      ? true
      : !isTabVisible
      ? false
      : !buttonExpanded
      ? false
      : undefined;

  const queryResults = useQuery({
    ...options,
    refetchInterval: buttonExpanded && isTabVisible ? 1 * minute : false,
    refetchOnWindowFocus: buttonExpanded,
    enabled,
  });

  queryResultsRef.current = queryResults;
  return queryResults;
}
