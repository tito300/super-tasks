import { ScriptType } from "@src/messageEngine/types/taskMessages";
import React from "react";

const ScriptTypeContext = React.createContext<ScriptType>(null!);

export function ScriptTypeProvider({
  children,
  scriptType,
}: {
  children: React.ReactNode;
  scriptType: ScriptType;
}) {
  return (
    <ScriptTypeContext.Provider value={scriptType}>
      {children}
    </ScriptTypeContext.Provider>
  );
}

export function useScriptType() {
  const scriptType = React.useContext(ScriptTypeContext);
  if (!scriptType)
    throw new Error("useScriptType must be used within a ScriptTypeProvider");

  return scriptType;
}
