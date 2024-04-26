import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider,
  Stack,
  IconButton,
  Typography,
  LinearProgress,
  Button,
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useTaskLists } from "../../api/task.api";
import { TaskManager } from "../TasksManager/TaskManager";
import { useTasksGlobalState } from "../Providers/TasksGlobalStateProvider";
import {
  Edit,
  KeyboardArrowDown,
  List,
  Refresh,
  Settings,
} from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { TasksSettings } from "../TasksSettings/TasksSettings";
import { useUserSettings } from "@src/api/user.api";
import { useRootElement } from "@src/hooks/useRootElement";

export function TaskListManager() {
  const [active, setActive] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const { data } = useTaskLists();
  const queryClient = useQueryClient();
  const { selectedTaskListId, updateSelectedTaskListId } =
    useTasksGlobalState();

  useEffect(() => {
    if (!selectedTaskListId && data?.length) {
      updateSelectedTaskListId(data[0].id);
    }
  }, [data]);

  const selectedList = useMemo(
    () => data?.find((list) => list.id === selectedTaskListId),
    [data, selectedTaskListId]
  );

  const selectedListTitle = selectedList?.title ?? "Tasks";

  const handleChange = (event: SelectChangeEvent) => {
    updateSelectedTaskListId(event.target.value);
    setActive(false);
  };
  return (
    <>
      <Stack
        id="task-list-manager"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pl={1}
      >
        {!active && (
          <Button
            size="small"
            startIcon={<List fontSize="medium" />}
            onClick={() => setActive(true)}
            endIcon={<KeyboardArrowDown fontSize="small" />}
          >
            {selectedListTitle}
          </Button>
        )}
        {active && (
          <FormControl variant="standard" sx={{ m: 1, pl: 1, minWidth: 120 }}>
            <Select
              id="demo-simple-select-standard"
              disableUnderline
              defaultOpen={true}
              value={selectedTaskListId ?? ""}
              onChange={handleChange}
              onBlur={() => setActive(false)}
            >
              {data?.map((list, i) => (
                <MenuItem selected={i === 0} key={list.id} value={list.id}>
                  {list.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Stack direction="row" alignItems={"center"}>
          <IconButton
            color={settingsOpen ? "primary" : "default"}
            onClick={() => {
              setSettingsOpen(!settingsOpen);
            }}
            size="small"
          >
            <Settings fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ["tasks", selectedTaskListId],
              });
              queryClient.invalidateQueries({ queryKey: ["tasks"] });
            }}
          >
            <Refresh fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
      {settingsOpen ? (
        <TasksSettings />
      ) : (
        <TaskManager listId={selectedTaskListId ?? ""} />
      )}
    </>
  );
}
