import { ClickAwayListener, Stack } from "@mui/material";
import { StyledTask } from "./Task.styles";
import { TaskOptionsMenu } from "./components/TaskOptionsMenu";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TaskTitleField } from "./components/TaskTitleField";
import { CompletedCheckbox } from "./components/CompletedCheckbox";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useAddTask, useTasks, useUpdateTask } from "../../api/task.api";
import { TaskSkeleton } from "./Task.skeleton";

export type TaskType = SavedTask | NewTask;

export type TaskEnhanced = {
  alertOn?: boolean | null;
  alert?: number | null; // in minutes
  listId?: string;
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
  const activeRef = useRef(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: data.id || data.title || data.notes || 'temp' });
  const { data: tasks } = useTasks({ enabled: false, listId });

  const addMutation = useAddTask(listId);
  const updateMutation = useUpdateTask(listId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formFields = useForm<TaskForm>({
    defaultValues: { ...data },
  });
  // const formState = useFormState({ control: formFields.control });

  const onSubmit = (form: TaskForm) => {
    if (temporary) {
      if (!shouldSaveTempTask(form)) return onSaved?.();
      addMutation
        .mutateAsync({
          task: form,
          previousTaskId: tasks.length ? tasks[tasks.length - 1].id : undefined,
        })
        .then(() => onSaved?.());
    } else {
      // todo: figure out why formState.isDirty is not working
      if (!formFields.getFieldState("title").isDirty) return;
      updateMutation.mutate(form);
    }
  };

  const handleClickAway = () => {
    if (activeRef.current) {
      setFocused(false);

      if (formFields.formState.isDirty || temporary) {
        onSubmit(formFields.getValues());
      }

      activeRef.current = false;
    }
  };

  const expanded = focused || !!formFields.getValues("notes");
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
          onFocus={() => (activeRef.current = true)}
        >
          <Stack direction="row" alignItems="start" width="100%">
            {/* <IconButton
              className="supertasks-drag-icon"
              sx={{
                paddingRight: 0,
                paddingTop: (theme) => theme.spacing(1),
                color: (theme) => theme.palette.action.disabled,
              }}
              size="small"
              disableFocusRipple
              disableRipple
            >
              <DragIndicator fontSize="small" />
            </IconButton> */}
            {
              <CompletedCheckbox
                sx={{ opacity: temporary ? "0" : "1" }}
                listId={listId}
              />
            }
            <Stack flexGrow={1}>
              <TaskTitleField
                strikeThrough={data.status === "completed" && !temporary}
                focused={focused}
                taskDue={data.due}
                taskId={data.id}
                onblur={() => formFields.handleSubmit(onSubmit)()}
                onFocus={() => setFocused(true)}
              />
              {/* <Collapse in={expanded}>
                <DescriptionTextField
                  onblur={() =>
                    formFields.formState.isDirty &&
                    formFields.handleSubmit(onSubmit)
                  }
                />
              </Collapse> */}
            </Stack>
          </Stack>
          {!temporary && <TaskOptionsMenu listId={listId} />}
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
    ...task,
  };
};
export const shouldSaveTempTask = (task?: Partial<SavedTask>) => {
  if (task?.title) return true;
  if (task?.notes) return true;

  return false;
};
