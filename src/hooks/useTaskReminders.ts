import { TaskType } from "@src/components/Task/Task";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { TaskReminderMessage } from "@src/messageEngine/types/taskMessages";
import { useEffect, useState } from "react";
import { useTasks } from "./api/useTasks";
import { useQueryClient } from "@tanstack/react-query";

/**
 * If taskId is passed this hook only trigger callback when the task is due
 * If no taskId is passed this hook will trigger callback on any task
 */
export function useTaskReminders() {
  const messageEngine = getMessageEngine("Content");
  const queryClient = useQueryClient();

  useEffect(() => {
    const listener = async (message: TaskReminderMessage) => {
      console.log("TaskReminderMessage: ", message.payload.taskId, message.payload.taskListId)
      const tasks = queryClient.getQueryData<TaskType[]>([
        "tasks",
        message.payload.taskListId,
      ]);
      if (!tasks) return; // todo: make robust

      queryClient.setQueryData<TaskType[]>(
        ["tasks", message.payload.taskListId],
        tasks.map((task: TaskType) => {
          if (task.id === message.payload.taskId) {
            return {
              ...task,
              alert: 0,
              alertOn: true
            };
          }

          return task;
        })
      );
    };

    return messageEngine.onMessage("TaskReminder", listener);
  }, []);
}
