import { SavedTask, TaskEnhanced } from "@src/components/Task/Task";
import { storageService } from "@src/storage/storage.service";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * watches for local enhanced tasks changes and merges them with
 * the query tasks. We want to keep the query tasks as the source of truth
 * but we don't want to cause a refetch every time the enhanced tasks change
 */
export function useEnhancedTasks() {
    const queryClient = useQueryClient();

    useEffect(() => {
        storageService.onChange("tasksEnhanced", (storageData) => {
            if (!storageData) return;
            const tasksEnhanced = storageData.tasksEnhanced.newValue;

            if (!tasksEnhanced) return;

            const updatedTasks: { [listId: string]: TaskEnhanced[] } = {};

            
            Object.keys(tasksEnhanced).forEach((taskId) => {
                const task = tasksEnhanced[taskId];
                const listId = task.listId!;

                if (!updatedTasks[listId]) {
                    updatedTasks[listId] = [];
                }

                updatedTasks[listId].push({
                    ...task,
                    id: taskId,
                });
            });

            Object.entries(updatedTasks).forEach(([listId, updatedListTasks]) => {
                queryClient.setQueryData(["tasks", listId], (tasks: SavedTask[]) => {
                    if (!tasks) return [];
                    return tasks.map((task) => {
                        const updatedTask = updatedListTasks.find((t) => t.id === task.id);
                        return updatedTask ? { ...task, ...updatedTask } : task;
                    });
                });
            });
        });
    }, [queryClient])
}