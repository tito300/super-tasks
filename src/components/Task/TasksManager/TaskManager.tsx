import {
  Alert,
  Box,
  Collapse,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { SavedTask, Task, createEmptyTask } from "../Task";
import { useMoveTask } from "../../../api/task.api";
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
import { AddTask as AddTaskButton } from "../AddTask/AddTask";
import { TaskSkeleton } from "../Task.skeleton";
import { ArrowDropDown, ArrowRight } from "@mui/icons-material";
import { constants } from "@src/config/constants";
import { useFilteredTasks } from "@src/hooks/useFilteredTasks";
import { TasksFilters } from "./TasksFilters";
import { grey } from "@mui/material/colors";
import { useTasksState } from "../../Providers/TasksStateProvider";

export function TaskManager({ listId }: { listId: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  );
  const {
    filteredTasks,
    completedTasks,
    pinnedTasks,
    isLoading,
    isError,
    tasks,
  } = useFilteredTasks();

  const moveMutation = useMoveTask(listId);

  useEffect(() => {
    let eventListener = (e: MouseEvent) => {
      e.stopPropagation();
    };
    if (rootRef.current) {
      rootRef.current.addEventListener("mousemove", eventListener);
    }

    return () => {
      if (rootRef.current) {
        rootRef.current.removeEventListener("mousemove", eventListener);
      }
    };
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!filteredTasks?.length) return;
    if (!over) return;

    if (active.id !== over?.id) {
      moveMutation.mutate({
        taskId: active.id as string,
        previousTaskId: getPreviousId(filteredTasks, over!, active),
      });
    }
  }

  return (
    <Stack flexGrow={1} sx={{ px: 1, pt: 0.5, mb: 1.5 }} ref={rootRef}>
      <TasksFilters />
      {!!tasks && tasks.length >= 100 ? (
        <Alert severity="warning">
          Maximum number of tasks (100) is reached. Delete old tasks to add
          more.
        </Alert>
      ) : (
        <AddTask />
      )}
      {isLoading && !filteredTasks.length && (
        <>
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </>
      )}

      <Stack flexGrow={1}>
        {pinnedTasks?.map((task) => (
          <Task key={task.id || task.title} listId={listId} data={task} />
        ))}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTasks!}
            strategy={verticalListSortingStrategy}
          >
            <Stack flexGrow={1}>
              {!!filteredTasks?.length &&
                filteredTasks.map((task) => (
                  <Task
                    key={task.id + task.title}
                    listId={listId}
                    data={task}
                  />
                ))}
            </Stack>
          </SortableContext>

          {isError && <Alert severity="error">Error Fetching Tasks</Alert>}
        </DndContext>
        {!!completedTasks.length && (
          <CompletedTasks tasks={completedTasks}></CompletedTasks>
        )}
      </Stack>
    </Stack>
  );
}

function AddTask() {
  const [tempTaskPending, setTempTaskPending] = useState(false);
  const {
    data: { selectedTaskListId },
  } = useTasksState();

  return (
    <>
      {!!selectedTaskListId && !tempTaskPending && (
        <AddTaskButton
          id={`${constants.EXTENSION_NAME}-add-task`}
          onClick={() => setTempTaskPending(true)}
        />
      )}
      {tempTaskPending && (
        <Task
          temporary
          autoFocus
          listId={selectedTaskListId!}
          onSaved={() => setTempTaskPending(false)}
          data={createEmptyTask()}
        ></Task>
      )}
    </>
  );
}

function CompletedTasks({ tasks }: { tasks: SavedTask[] }) {
  const [completedOpen, setCompletedOpen] = useState(false);
  const {
    data: { selectedTaskListId },
  } = useTasksState();

  return (
    <Stack>
      <Stack
        direction="row"
        alignItems="center"
        sx={{ cursor: "pointer", px: 1, mt: 2 }}
        onClick={() => setCompletedOpen(!completedOpen)}
      >
        {!completedOpen && <ArrowRight fontSize="small" />}
        {completedOpen && <ArrowDropDown fontSize="small" />}
        <Typography sx={{ ml: 1 }}>Completed ({tasks?.length || 0})</Typography>
      </Stack>
      <Collapse
        in={completedOpen}
        unmountOnExit
        mountOnEnter
        sx={{ opacity: 0.75 }}
      >
        {tasks.map((task) => (
          <Task
            listId={selectedTaskListId!}
            key={task.id + "completed"}
            data={task}
          />
        ))}
      </Collapse>
    </Stack>
  );
}

function getPreviousId(tasks: SavedTask[], over: Over, active: Active) {
  const activeIndex = tasks.findIndex((task) => task.id === active.id);
  const overIndex = tasks.findIndex((task) => task.id === over.id);

  if (!overIndex) return null;

  if (activeIndex > overIndex) {
    return tasks[overIndex - 1].id;
  } else {
    return tasks[overIndex].id;
  }
}
