import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { initializeServices } from "@src/services";
import React, { PropsWithChildren, useMemo } from "react";

export const ServicesContext = React.createContext<ReturnType<typeof initializeServices>>(null as any);

export function ServicesProvider({ children, scriptType }: PropsWithChildren & { scriptType: ScriptType }) {
    const services = useMemo(() => initializeServices(scriptType), [scriptType]);
    return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServicesContext() {
    const services = React.useContext(ServicesContext);
    if (!services) throw new Error("useServices must be used within a ServicesProvider"); 

    return services;
}
    

/**
 * if dock is open + active tab 
 * if user opens dock 
 * on new tab
 */