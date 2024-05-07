import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { TaskForm } from "../Task";
import { KeyboardEvent, forwardRef, useRef } from "react";
import { constants } from "@src/config/constants";
import React from "react";
import { useTasksGlobalState } from "@src/components/Providers/TasksStateProvider";
import { useTasks } from "@src/api/task.api";
import { useTasksSettingsContext } from "@src/components/Providers/TasksSettingsProvider";
import { useUserState } from "@src/components/Providers/UserStateProvider";

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
>(({ onFocus, focused, onblur, strikeThrough }) => {
  const { control } = useFormContext<TaskForm>();
  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const {
    data: { blurText },
  } = useUserState();
  const {
    data: { selectedTaskListId },
  } = useTasksGlobalState();

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
              filter: blurText && !focused ? "blur(7px)" : "none",
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
