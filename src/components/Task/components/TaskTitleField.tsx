import { IconButton, Menu, MenuItem, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { SavedTask, TaskForm, TaskType } from "../Task";
import { ElementRef, KeyboardEvent, forwardRef, useRef } from "react";
import { constants } from "@src/config/constants";
import { isTaskPastDue } from "@src/utils/isTaskPastDue";
import {
  NotificationAdd,
  Notifications,
  NotificationsOff,
  Warning,
} from "@mui/icons-material";
import React from "react";
import { useServices } from "@src/components/Providers/ServicesProvider";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useTasks, useUpdateTask } from "@src/api/task.api";
import { useTasksSettings } from "@src/api/task.api";

export const TaskTitleField = forwardRef<
  HTMLDivElement,
  {
    onFocus: () => void;
    focused?: boolean;
    onblur: () => void;
    strikeThrough: boolean;
    taskDue?: string;
    taskId?: string;
  }
>(({ onFocus, focused, onblur, strikeThrough, taskDue, taskId }) => {
  const { control } = useFormContext<TaskForm>();
  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const { tasksSettings } = useTasksSettings();
  const [hovered, setHovered] = React.useState(false);
  const { selectedTaskListId } = useTasksGlobalState();
  const { data: tasks } = useTasks({ listId: selectedTaskListId });

  const task = tasks?.find((task) => task.id === taskId);

  function handleKeyDown(e: KeyboardEvent) {
    // some websites take focus away on certain
    e.stopPropagation();
    if (e.key === "Enter") {
      onblur();
      textFieldRef.current?.blur();
    }
  }

  return (
    <Controller
      control={control}
      name="title"
      render={({ field }) => {
        return (
          <TextField
            inputRef={textFieldRef}
            {...field}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            draggable={focused ? false : true}
            onDragStart={(e) => (focused ? e.preventDefault() : undefined)}
            id={`${constants.EXTENSION_NAME}-task-title-field`}
            autoFocus={focused}
            multiline
            onKeyDown={handleKeyDown}
            placeholder="Title..."
            variant="standard"
            size="small"
            sx={{
              pt: 0.25,
              ml: 1,

              filter: tasksSettings.blurText && !focused ? "blur(7px)" : "none",
              textDecoration: strikeThrough ? "line-through" : "auto",
            }}
            inputProps={{
              style: {
                paddingBottom: 0,
                cursor: focused ? "text" : "pointer",
              },
            }}
            onFocus={onFocus}
            InputProps={{
              disableUnderline: true,
              // startAdornment:
              //   isTaskPastDue(taskDue) && !strikeThrough ? (
              //     <Warning color="warning" fontSize="small" sx={{ mr: 0.5 }} />
              //   ) : undefined,
              endAdornment: taskId && (
                <AddReminder
                  visible={!!(hovered || task?.alertOn || task?.alert)}
                  task={task!}
                />
              ),
              sx: { paddingBottom: 0, alignItems: "flex-start" },
            }}
          />
        );
      }}
    ></Controller>
  );
});

function AddReminder({
  task,
  visible,
}: {
  task: SavedTask;
  visible?: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(
    null
  );
  const open = Boolean(anchorEl);
  const { selectedTaskListId } = useTasksGlobalState();
  const mutateTask = useUpdateTask(selectedTaskListId!);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (task.alertOn) {
      mutateTask.mutate({
        ...task,
        alertOn: false,
        alert: 0,
        alertSeen: false,
      });
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = (timeInMinutes?: number) => {
    if (timeInMinutes) {
      mutateTask.mutate({
        ...task,
        alertOn: false,
        alert: timeInMinutes,
      });
    }
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          maxLines: 0.5,
          padding: 0.5,
          visibility: visible ? "visible" : "hidden",
        }}
      >
        {task.alertOn ? (
          <NotificationsOff sx={{ fontSize: 20 }} color="warning" />
        ) : task.alert ? (
          <Notifications color="success" sx={{ fontSize: 20 }} />
        ) : (
          <NotificationAdd sx={{ fontSize: 20 }} />
        )}
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: { maxHeight: "150px", overflow: "auto" },
        }}
      >
        <MenuItem
          selected={task.alert === 0.5}
          onClick={() => handleClose(0.5)}
        >
          30 seconds
        </MenuItem>
        <MenuItem selected={task.alert === 5} onClick={() => handleClose(5)}>
          5 minutes
        </MenuItem>
        <MenuItem selected={task.alert === 15} onClick={() => handleClose(15)}>
          15 minutes
        </MenuItem>
        <MenuItem selected={task.alert === 30} onClick={() => handleClose(30)}>
          30 minutes
        </MenuItem>
        <MenuItem selected={task.alert === 60} onClick={() => handleClose(60)}>
          1 hour
        </MenuItem>
        <MenuItem
          selected={task.alert === 60 * 2}
          onClick={() => handleClose(60 * 2)}
        >
          2 hours
        </MenuItem>
        <MenuItem
          selected={task.alert === 60 * 4}
          onClick={() => handleClose(60 * 4)}
        >
          4 hours
        </MenuItem>
        <MenuItem
          selected={task.alert === 60 * 8}
          onClick={() => handleClose(60 * 8)}
        >
          8 hours
        </MenuItem>
        <MenuItem
          selected={task.alert === 60 * 24}
          onClick={() => handleClose(60 * 24)}
        >
          1 day
        </MenuItem>
      </Menu>
    </>
  );
}
