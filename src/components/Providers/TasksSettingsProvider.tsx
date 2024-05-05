import { TasksSettings, tasksSettingsDefaults } from "@src/config/settingsDefaults";
import { storageService } from "@src/storage/storage.service";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useServicesContext } from "./ServicesProvider";
import { deepmerge } from "@mui/utils";

type TasksSettingsContext = {
  tasksSettings: TasksSettings;
  updateTasksSettings: (newSettings: Partial<TasksSettings>) => void;
};

const TasksSettingsContext = createContext<TasksSettingsContext>(null!);

export function TasksSettingsProvider({ children }: PropsWithChildren) {
  const [tasksSettings, setTasksSettings] = useState<TasksSettings>(
    tasksSettingsDefaults
  );
  const { task: taskService } = useServicesContext();

  useEffect(() => {
    taskService.getTasksSettings().then(setTasksSettings);
    storageService.onChange("tasksSettings", (changes) => {
      setTasksSettings(
        changes?.tasksSettings?.newValue ?? {
          ...tasksSettingsDefaults,
        }
      );
    });
  }, []);

  const updateTasksSettings = useCallback(
    (newSettings: Partial<TasksSettings>) => {
      setTasksSettings((prevSettings) => {
        const settings = deepmerge(prevSettings, newSettings);
        taskService.updateTasksSettings(settings);
        return settings;
      });
    },
    [taskService]
  );

  const value = useMemo(() => ({
    tasksSettings,
    updateTasksSettings,
  }), [tasksSettings, updateTasksSettings]);

  return (
    <TasksSettingsContext.Provider value={value}>
      {children}
    </TasksSettingsContext.Provider>
  );
}

export const useTasksSettingsContext = () => {
  const context = useContext(TasksSettingsContext);
  if (!context) {
    throw new Error(
      "useTasksSettingsContext must be used within a TasksSettingsProvider"
    );
  }
  return context;
}