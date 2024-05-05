import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useTasksUpdateMessage() {
    const queryClient = useQueryClient();
    const messageEngine = useMessageEngine();
    const { selectedTaskListId } = useTasksGlobalState();
  
  
    /**
     * Invalidate tasks query when tasks are updated on background script
     * due to alarm trigger
     */
      useEffect(() => {
        const cleanup = messageEngine.onMessage("UpdateTasks", async () => {
          queryClient.invalidateQueries({
            queryKey: ["tasks", selectedTaskListId], // needs to update all tasks
          });
        });
        return () => {
          cleanup();
        };
      }, [selectedTaskListId, messageEngine, queryClient]);
  }