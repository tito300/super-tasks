import {
  Button,
  Chip,
  ClickAwayListener,
  Collapse,
  IconButton,
  IconButtonProps,
  Stack,
} from "@mui/material";
import { StyledTask } from "./Task.styles";
import { TaskOptionsMenu } from "./components/TaskOptionsMenu";
import { useRef, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { TaskTitleField } from "./components/TaskTitleField";
import { CompletedCheckbox } from "./components/CompletedCheckbox";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import {
  useAddTask,
  useEnhancedTasks,
  useTasks,
  useUpdateTask,
} from "../../api/task.api";
import { TaskSkeleton } from "./Task.skeleton";

import dayjs from "dayjs";
import { TaskDate } from "./components/TaskDate";
import { DescriptionTextField } from "./components/DescriptionTextField";
import { TaskReminder } from "./components/TaskReminder";
import { Pin, PushPin } from "@mui/icons-material";
import { useTasksState } from "../Providers/TasksStateProvider";

export type TaskType = SavedTask | NewTask;

export type TaskEnhanced = {
  id: string;
  alertOn?: boolean | null;
  alert?: number | null; // in minutes
  alertSeen?: boolean | null;
  listId: string;
  pinned?: boolean;
  // add updated date
};

export type SavedTask = TaskEnhanced & {
  id: string;
  title?: string;
  notes?: string;
  completed?: string;
  position: string;
  due?: string;
  status: "needsAction" | "completed";
};

export type NewTask = TaskEnhanced & {
  id?: string;
  title: string;
  notes?: string;
  completed?: string;
  position: string;
  due?: string;
  status: "needsAction" | "completed";
};

export interface TaskForm extends SavedTask {}

export function Task({
  data,
  temporary,
  listId,
  loading,
  autoFocus,
  onSaved,
}: {
  data: SavedTask;
  listId: string;
  temporary?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  onSaved?: () => void;
}) {
  const [focused, setFocused] = useState(autoFocus);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: data.id || data.title || data.notes || "temp" });
  const { data: tasks } = useTasks({ enabled: false, listId });
  const [_, updateEnhancedTasks] = useEnhancedTasks();

  const addMutation = useAddTask(listId);
  const updateMutation = useUpdateTask(listId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formFields = useForm<TaskForm>({
    defaultValues: data,
  });
  // const formState = useFormState({ control: formFields.control });

  const onSubmit = (form: TaskForm) => {
    if (temporary) {
      if (!shouldSaveTempTask(form)) return onSaved?.();
      addMutation
        .mutateAsync({
          task: form,
          previousTaskId: tasks?.length
            ? tasks[tasks?.length - 1].id
            : undefined,
        })
        .then(() => onSaved?.());
    } else {
      // todo: figure out why formState.isDirty is not working
      if (!form.title) return;

      if (
        !formFields.getFieldState("title").isDirty &&
        !formFields.getFieldState("due").isDirty &&
        !formFields.getFieldState("notes").isDirty
      )
        return;

      updateMutation.mutate(form);
    }

    setFocused(false);
  };

  const handleClickAway = () => {
    if (focused) {
      setFocused(false);

      if (formFields.formState.isDirty || temporary) {
        onSubmit(formFields.getValues());
      }
    }
  };

  const handleFocus = () => {
    setFocused(true);
    if (data.alertOn && !data.alertSeen) {
      updateEnhancedTasks([
        {
          id: data.id,
          alertSeen: true,
          listId: data.listId,
        },
      ]);
    }
  };

  const expanded = focused;
  if (loading) return <TaskSkeleton />;

  return (
    <FormProvider {...formFields}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <StyledTask
          ref={setNodeRef}
          style={style}
          id="supertasks-task"
          {...listeners}
          {...attributes}
          onKeyUp={(e) => {
            if (e.key === "Escape") {
              formFields.reset();
              setFocused(false);
              (e.target as HTMLDivElement)?.blur?.();
            }
          }}
          sx={{
            backgroundColor: data.alertOn ? "rgb(255, 234, 194)" : undefined,
            ":hover": {
              backgroundColor: data.alertOn ? "rgb(255, 227, 175)" : undefined,
            },
          }}
        >
          <Stack direction="row" alignItems="start" width="100%">
            {
              <CompletedCheckbox
                sx={{ opacity: temporary ? "0" : "1" }}
                listId={listId}
              />
            }
            <Stack flexGrow={1} pt={temporary ? 0.5 : 0}>
              <TaskTitleField
                strikeThrough={data.status === "completed" && !temporary}
                focused={focused}
                taskDue={data.due}
                taskId={data.id}
                onblur={() => formFields.handleSubmit(onSubmit)()}
                onFocus={handleFocus}
              />
              {!expanded && data.due && (
                <Stack direction="row" alignItems="center" gap={0.5} mb={0.25}>
                  <TaskDate
                    onSubmit={() =>
                      setTimeout(() => formFields.handleSubmit(onSubmit)(), 30)
                    }
                  />
                </Stack>
              )}
              <Collapse in={expanded}>
                <Stack alignItems="normal">
                  <DescriptionTextField
                    onblur={() =>
                      formFields.formState.isDirty &&
                      formFields.handleSubmit(onSubmit)
                    }
                  />
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <TaskDate
                      onSubmit={() =>
                        setTimeout(
                          () => formFields.handleSubmit(onSubmit)(),
                          30
                        )
                      }
                    />
                    <SaveButton
                      pendingSave={
                        updateMutation.isPending || addMutation.isPending
                      }
                      onSubmit={onSubmit}
                    />
                  </Stack>
                </Stack>
              </Collapse>
            </Stack>
          </Stack>
          {!temporary && (
            <>
              <TaskReminder
                id="axess-add-reminder-button"
                visible={!!(data?.alertOn || data?.alert)}
                task={data!}
              />
              <TaskPin id="axess-pin-task-button" task={data!} />
              <TaskOptionsMenu listId={listId} />
            </>
          )}
        </StyledTask>
      </ClickAwayListener>
    </FormProvider>
  );
}

export const createEmptyTask = (task?: Partial<SavedTask>): SavedTask => {
  return {
    id: "",
    completed: "",
    title: "",
    notes: "",
    position: "",
    status: "needsAction",
    listId: "",
    ...task,
  };
};
export const shouldSaveTempTask = (task?: Partial<SavedTask>) => {
  if (task?.title) return true;
  if (task?.notes) return true;

  return false;
};

export function TaskPin({
  task,
  ...rest
}: { task: SavedTask } & IconButtonProps) {
  const {
    data: { selectedTaskListId },
  } = useTasksState();
  const mutateTask = useUpdateTask(selectedTaskListId!);

  const pinned = task.pinned;

  return (
    <IconButton
      size="small"
      color={pinned ? "primary" : "default"}
      onClick={(event) => {
        event.stopPropagation();

        mutateTask.mutate({
          ...task,
          pinned: !pinned,
        });
      }}
      {...rest}
      sx={{ visibility: pinned ? "visible" : "hidden", ...rest.sx }}
    >
      <PushPin sx={{ fontSize: 20 }} />
    </IconButton>
  );
}

function SaveButton({
  pendingSave,
  onSubmit,
}: {
  pendingSave: boolean;
  onSubmit: (form: TaskForm) => void;
}) {
  const formFields = useFormContext<TaskForm>();
  const formState = useFormState({ control: formFields.control });

  return (
    <Button
      size="small"
      disabled={pendingSave || !formState.isDirty}
      onClick={() => onSubmit(formFields.getValues())}
    >
      Save
    </Button>
  );
}
