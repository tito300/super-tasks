import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider,
} from "@mui/material";
import React, { useEffect } from "react";
import { useTaskLists } from "../../api/task.api";
import { TaskManager } from "../TasksManager/TaskManager";

export function TaskListManager() {
  const [listId, setListId] = React.useState("");
  const { data } = useTaskLists();

  useEffect(() => {
    if (!listId && data?.length) {
      setListId(data[0].id);
    }
  }, [data]);

  const handleChange = (event: SelectChangeEvent) => {
    setListId(event.target.value);
  };
  return (
    <>
      <FormControl variant="standard" sx={{ m: 1, pl: 1, minWidth: 120 }}>
        <InputLabel id="tasks-list-title">TASKS</InputLabel>
        <Select
          labelId="tasks-list-title"
          id="demo-simple-select-standard"
          disableUnderline
          value={listId}
          onChange={handleChange}
          label="TASKS"
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          {data.map((list, i) => (
            <MenuItem selected={i === 0} key={list.id} value={list.id}>
              {list.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Divider sx={{ mb: 1 }} />
      <TaskManager listId={listId} />
    </>
  );
}
