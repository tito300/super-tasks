import { Alert, Collapse, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Task, createEmptyTask } from "../Task/Task";
import { useMoveTask, useTasks } from "../../api/task.api";
import {
  Active,
  DndContext,
  DragEndEvent,
  Over,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AddTask } from "../AddTask/AddTask";
import { TaskSkeleton } from "../Task/Task.skeleton";
import { ArrowDropDown, ArrowRight } from "@mui/icons-material";
import { useUIControls } from "../Providers/UIControlsProvider";

export function TaskManager({ listId }: { listId: string }) {
  const [tempTaskPending, setTempTaskPending] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const { data, isFetching, isError } = useTasks({ listId });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const { isNewTab } = useUIControls();

  const moveMutation = useMoveTask(listId);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!data?.length) return;
    if (!over) return;

    if (active.id !== over?.id) {
      moveMutation.mutate({
        taskId: active.id as string,
        previousTaskId: getPreviousId(data, over!, active),
      });
    }
  }

  const completedTasks = data.filter((task) => task.status === "completed");

  return (
    <Stack sx={{ width: 350 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {!!listId && !tempTaskPending && (
          <AddTask
            sx={{ mt: 1 }}
            autoFocus={!isNewTab}
            onClick={() => setTempTaskPending(true)}
          />
        )}
        {tempTaskPending && (
          <Task
            temporary
            listId={listId}
            onSaved={() => setTempTaskPending(false)}
            data={createEmptyTask({ id: "3dfs" })}
          ></Task>
        )}
        <SortableContext items={data!} strategy={verticalListSortingStrategy}>
          {isFetching && !data.length && (
            <>
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
            </>
          )}

          {data
            ?.filter((task) => task.status !== "completed" && !!task.title)
            .map((task) => (
              <Task key={task.id} listId={listId} data={task} />
            ))}
        </SortableContext>

        {isError && <Alert severity="error">Error Fetching Tasks</Alert>}
        {!!completedTasks.length && (
          <Stack>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ cursor: "pointer", px: 1, mt: 2 }}
              onClick={() => setCompletedOpen(!completedOpen)}
            >
              {!completedOpen && <ArrowRight fontSize="small" />}
              {completedOpen && <ArrowDropDown fontSize="small" />}
              <Typography sx={{ ml: 1 }}>Completed</Typography>
            </Stack>
            <Collapse in={completedOpen} sx={{ opacity: 0.75 }}>
              {completedTasks.map((task) => (
                <Task listId={listId} key={task.id + "completed"} data={task} />
              ))}
            </Collapse>
          </Stack>
        )}
      </DndContext>
    </Stack>
  );
}

function getPreviousId(tasks: Task[], over: Over, active: Active) {
  const activeIndex = tasks.findIndex((task) => task.id === active.id);
  const overIndex = tasks.findIndex((task) => task.id === over.id);

  if (!overIndex) return null;

  if (activeIndex > overIndex) {
    return tasks[overIndex - 1].id;
  } else {
    return tasks[overIndex].id;
  }
}
