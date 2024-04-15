import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { setupServices } from "@src/services";
import React, { PropsWithChildren, useMemo } from "react";

export const ServicesContext = React.createContext<ReturnType<typeof setupServices>>(null as any);

export function ServicesProvider({ children, scriptType }: PropsWithChildren & { scriptType: ScriptType }) {
    const services = useMemo(() => setupServices(scriptType), [scriptType]);
    return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices() {
    if (!ServicesContext) throw new Error("useServices must be used within a ServicesProvider"); 

    return React.useContext(ServicesContext);
}
    