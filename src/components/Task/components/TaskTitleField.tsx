import { IconButton, Menu, MenuItem, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { TaskForm } from "../Task";
import { ElementRef, KeyboardEvent, forwardRef, useRef } from "react";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { constants } from "@src/config/constants";
import { isTaskPastDue } from "@src/utils/isTaskPastDue";
import { NotificationAdd, Warning } from "@mui/icons-material";
import React from "react";
import { useServices } from "@src/components/Providers/ServicesProvider";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";

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
  const { userSettings } = useUserSettingsContext();

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
            id={`${constants.EXTENSION_NAME}-task-title-field`}
            autoFocus={focused}
            multiline
            onKeyDown={handleKeyDown}
            placeholder="Title..."
            variant="standard"
            size="small"
            sx={{
              pt: 0.7,
              ml: 1,
              filter: userSettings.blurText && !focused ? "blur(7px)" : "none",
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
              startAdornment:
                isTaskPastDue(taskDue) && !strikeThrough ? (
                  <Warning color="warning" fontSize="small" sx={{ mr: 0.5 }} />
                ) : undefined,
              endAdornment: taskId && <AddReminder taskId={taskId} />,
            }}
          />
        );
      }}
    ></Controller>
  );
});

function AddReminder({ taskId }: { taskId: string }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(
    null
  );
  const open = Boolean(anchorEl);
  const { task } = useServices();
  const { selectedTaskListId } = useTasksGlobalState();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (timeInMinutes: number) => {
    task.setReminder(taskId, selectedTaskListId!, timeInMinutes);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          maxLines: 0.5,
        }}
      >
        <NotificationAdd fontSize="small" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: { maxHeight: "200px", overflow: "auto" },
        }}
      >
        <MenuItem onClick={() => handleClose(0.5)}>30 seconds</MenuItem>
        <MenuItem onClick={() => handleClose(5)}>5 minutes</MenuItem>
        <MenuItem onClick={() => handleClose(15)}>15 minutes</MenuItem>
        <MenuItem onClick={() => handleClose(30)}>30 minutes</MenuItem>
        <MenuItem onClick={() => handleClose(60)}>1 hour</MenuItem>
        <MenuItem onClick={() => handleClose(60 * 2)}>2 hours</MenuItem>
        <MenuItem onClick={() => handleClose(60 * 4)}>4 hours</MenuItem>
        <MenuItem onClick={() => handleClose(60 * 8)}>8 hours</MenuItem>
        <MenuItem onClick={() => handleClose(60 * 24)}>1 day</MenuItem>
      </Menu>
    </>
  );
}
