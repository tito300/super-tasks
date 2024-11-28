import {
  NotificationsOff,
  NotificationAdd,
  Notifications,
} from "@mui/icons-material";
import { IconButtonProps, IconButton, Menu, MenuItem } from "@mui/material";
import { useUpdateTask } from "@src/api/task.api";
import { useServicesContext } from "@src/components/Providers/ServicesProvider";
import { useTasksState } from "@src/components/Providers/TasksStateProvider";
import React from "react";
import { SavedTask } from "../Task";

export function TaskReminder({
  task,
  visible,
  ...props
}: {
  task: SavedTask;
  visible?: boolean;
} & IconButtonProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(
    null
  );
  const open = Boolean(anchorEl);
  const {
    data: { selectedTaskListId },
  } = useTasksState();
  const mutateTask = useUpdateTask(selectedTaskListId!);
  const { task: taskService } = useServicesContext();

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
      taskService.setReminder(task.id, selectedTaskListId!, timeInMinutes);
    } else if (timeInMinutes === 0) {
      mutateTask.mutate({
        ...task,
        alertOn: false,
        alert: 0,
        alertSeen: false,
      });
      taskService.removeReminder(task.id, selectedTaskListId!);
    }

    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          maxLines: 0.5,
          padding: 0.5,
          visibility: visible ? "visible" : "hidden",
        }}
        onFocus={(e) => e.stopPropagation()}
        {...props}
      >
        {task.alertOn ? (
          <NotificationsOff sx={{ fontSize: 20 }} color="warning" />
        ) : task.alert ? (
          <Notifications color="primary" sx={{ fontSize: 20 }} />
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
        onFocus={(e) => e.stopPropagation()}
      >
        {!!task.alert && (
          <MenuItem selected={false} onClick={() => handleClose(0)}>
            Clear
          </MenuItem>
        )}
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
      </Menu>
    </>
  );
}
