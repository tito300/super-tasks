import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";
import { useEffect } from "react"
import { createPortal } from "react-dom";
import { DockStation } from "./components/DockStation";
import { Main } from "@src/components/Main";

export function Content() {
    const messageEngine = useMessageEngine();
    useEffect(() => {
        messageEngine.onMessage("DockTask", async (message) => {
            alert("DockTask")
            console.log(message)
        })
    }, [])


    return <DockStation />
}