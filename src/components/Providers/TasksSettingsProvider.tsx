import { useTasksSettings } from "@src/api/task.api";
import { TasksSettings } from "@src/config/settingsDefaults";
import { PropsWithChildren, createContext } from "react";

const TasksSettingsContext = createContext<TasksSettings>(null!);

export function TasksSettingsProvider({ children }: PropsWithChildren) {
  const { tasksSettings, updateTasksSettings } = useTasksSettings();

  return (
    <TasksSettingsContext.Provider value={tasksSettings}>
      {children}
    </TasksSettingsContext.Provider>
  );
}
