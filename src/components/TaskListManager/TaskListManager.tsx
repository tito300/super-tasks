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
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useTaskLists } from "../../api/task.api";
import { TaskManager } from "../TasksManager/TaskManager";
import { useTasksGlobalState } from "../Providers/TasksGlobalStateProvider";
import { Edit, List, Refresh } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";

export function TaskListManager() {
  const [active, setActive] = React.useState(false);
  const { data } = useTaskLists();
  const queryClient = useQueryClient();
  const { selectedTaskListId: listId, updateSelectedTaskListId } =
    useTasksGlobalState();

  useEffect(() => {
    if (!listId && data?.length) {
      updateSelectedTaskListId(data[0].id);
    }
  }, [data]);

  const selectedList = useMemo(
    () => data.find((list) => list.id === listId),
    [data, listId]
  );
  const selectedListTitle = selectedList?.title ?? "Tasks";

  const handleChange = (event: SelectChangeEvent) => {
    updateSelectedTaskListId(event.target.value);
    setActive(false);
  };
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {!active && (
          <Typography
            pl={1}
            flexGrow={1}
            fontWeight={400}
            display="flex"
            alignItems="center"
            sx={{ cursor: "pointer" }}
            variant="h6"
            onClick={() => setActive(true)}
          >
            <List fontSize="medium" sx={{ mr: 1 }} />
            {selectedListTitle}{" "}
            <Edit sx={{ fontSize: 16, ml: 1 }} color="action" />
          </Typography>
        )}
        {active && (
          <FormControl variant="standard" sx={{ m: 1, pl: 1, minWidth: 120 }}>
            <InputLabel id="tasks-list-title">TASKS</InputLabel>
            <Select
              labelId="tasks-list-title"
              id="demo-simple-select-standard"
              disableUnderline
              defaultOpen={true}
              value={listId ?? ""}
              onChange={handleChange}
              onBlur={() => setActive(false)}
              label="TASKS"
            >
              {data.map((list, i) => (
                <MenuItem selected={i === 0} key={list.id} value={list.id}>
                  {list.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <IconButton
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
            queryClient.invalidateQueries({ queryKey: ["taskLists"] });
          }}
        >
          <Refresh />
        </IconButton>
      </Stack>
      <Divider sx={{ mb: 1 }} />
      <TaskManager listId={listId ?? ""} />
    </>
  );
}
