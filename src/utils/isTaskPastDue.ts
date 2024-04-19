import { SavedTask } from "@src/components/Task/Task";

export function isTaskPastDue(due?: string) {
  if (!due) return false;

  const dueDate = new Date(due);
  const today = new Date();

  return (
    dueDate.getUTCDate() < today.getDate() &&
    dueDate.getUTCMonth() <= today.getMonth() &&
    dueDate.getUTCFullYear() <= today.getFullYear()
  );
}
