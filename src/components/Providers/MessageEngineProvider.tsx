import {
  MessageEngine,
  getMessageEngine,
} from "@src/messageEngine/MessageEngine";
import { ScriptType } from "@src/messageEngine/types/taskMessages";
import React from "react";
import { PropsWithChildren, useMemo } from "react";

const messageEngineContext = React.createContext<MessageEngine>(null as any);

export function MessageEngineProvider({
  children,
  scriptType,
}: PropsWithChildren & { scriptType: ScriptType }) {
  const messageEngine = useMemo(() => getMessageEngine(scriptType), []);
  return (
    <messageEngineContext.Provider value={messageEngine}>
      {children}
    </messageEngineContext.Provider>
  );
}

export function useMessageEngine() {
  const messageEngine = React.useContext(messageEngineContext);
  if (!messageEngine)
    throw new Error(
      "useMessageEngine must be used within a MessageEngineProvider"
    );

  return messageEngine;
}
