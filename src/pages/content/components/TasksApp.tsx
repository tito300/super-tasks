import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import { DockStationAccordion } from "./DockStationAccordion";
import { DockStationAccordionDetails } from "./DockStationAccordionDetails";
import { DockStationAccordionSummary } from "./DockStationAccordionSummary";
import { useEnhancedTasks } from "@src/hooks/useEnhancedTasks";
import { useEffect } from "react";

export function TasksApp() {
  useEnhancedTasks()

  return <TaskListManager />;
}
