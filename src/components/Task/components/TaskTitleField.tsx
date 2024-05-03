import {
  Box,
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
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
import { useServicesContext } from "@src/components/Providers/ServicesProvider";
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
              pt: 0.3,
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
              // endAdornment: taskId && (
              //   // 2 boxes needed to prevent shifting in UI without having to change the icon size
              //   <Box sx={{ position: "relative", width: 30 }}>
              //     <Box sx={{ position: "absolute", top: 0, left: 0 }}>
              //       <AddReminder
              //         visible={!!(hovered || task?.alertOn || task?.alert)}
              //         task={task!}
              //       />
              //     </Box>
              //   </Box>
              // ),
              sx: { paddingBottom: 0, alignItems: "flex-start" },
            }}
          />
        );
      }}
    ></Controller>
  );
});
