import { SavedTask, TaskType } from "@src/components/Task/Task";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { TaskReminderMessage } from "@src/messageEngine/types/taskMessages";
import { useEffect, useState } from "react";
import { useTasks } from "./api/useTasks";
import { useQueryClient } from "@tanstack/react-query";
import { useServicesContext } from "@src/components/Providers/ServicesProvider";

let listening = false;

// todo: remove file
/**
 * If taskId is passed this hook only trigger callback when the task is due
 * If no taskId is passed this hook will trigger callback on any task
 */
export function useTaskReminders() {
  const messageEngine = getMessageEngine("Content");
  const queryClient = useQueryClient();
  const services = useServicesContext();

  useEffect(() => {
    if (listening) return;

    const listener = async (message: TaskReminderMessage) => {
      const taskListId = message.payload.taskListId;
      listening = true;
      const tasks = queryClient.getQueryData<TaskType[]>(["tasks", taskListId]);
      if (!tasks) return; // todo: make robust

      queryClient.setQueryData<SavedTask[]>(["tasks", taskListId], (tasks) =>
        tasks?.map((task: SavedTask) => {
          if (task.id === message.payload.taskId) {
            services.task
              .updateLocalTaskState({
                ...task,
                alert: message.payload.alert,
                alertOn: true,
              })
              .then(() => {
                queryClient.invalidateQueries({
                  queryKey: ["tasks", taskListId],
                });
              });

            return {
              ...task,
              alert: 0,
              alertOn: true,
            };
          }

          return task;
        })
      );
    };

    const cleanup = messageEngine.onMessage("TaskReminder", listener);

    return () => {
      cleanup();
      listening = false;
    };
  }, []);
}
