import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useCachedTaskLists, useTaskLists } from "../../../api/task.api";
import { TaskManager } from "../TasksManager/TaskManager";
import { useTasksState } from "../../Providers/TasksStateProvider";
import { KeyboardArrowDown, List } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { AppControls } from "@src/components/shared/AppControls";
import { Settings } from "@src/components/shared/Settings/Settings";

export function TaskListManager() {
  const [active, setActive] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [refetching, setRefetching] = React.useState(false);
  const [isTransitionPending, startTransition] = React.useTransition();
  const { data, isLoading } = useTaskLists();

  const queryClient = useQueryClient();
  const {
    data: { selectedTaskListId },
    updateData: updateTasksState,
  } = useTasksState();

  useEffect(() => {
    if (!selectedTaskListId && data?.length) {
      updateTasksState({
        selectedTaskListId: data[0].id,
        defaultTaskListId: data[0].id,
      });
    }
  }, [data, selectedTaskListId]);

  const selectedList = useMemo(
    () => data?.find((list) => list.id === selectedTaskListId),
    [data, selectedTaskListId]
  );

  const selectedListTitle = selectedList?.title ?? "Tasks";

  const handleChange = (event: SelectChangeEvent) => {
    updateTasksState({
      selectedTaskListId: event.target.value,
      defaultTaskListId: event.target.value,
    });
    setActive(false);
  };
  return (
    <>
      <AppControls
        reloading={isTransitionPending || refetching || isLoading}
        settingsOpen={settingsOpen}
        onSettingsClick={() => {
          setSettingsOpen(!settingsOpen);
        }}
        onReloadClick={() => {
          setRefetching(true);
          startTransition(() => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] }).then(() => {
              startTransition(() => {
                setRefetching(false);
              });
            });
          });
        }}
      >
        <>
          {!active && (
            <Button
              size="small"
              sx={{ color: (theme) => theme.palette.action.active }}
              startIcon={<List fontSize="medium" />}
              onClick={() => setActive(true)}
              endIcon={<KeyboardArrowDown fontSize="small" />}
            >
              {selectedListTitle}
            </Button>
          )}
          {active && (
            <FormControl variant="standard" sx={{ pl: 1, minWidth: 120 }}>
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
        </>
      </AppControls>

      {settingsOpen ? (
        <Settings />
      ) : (
        <TaskManager listId={selectedTaskListId ?? ""} />
      )}
    </>
  );
}
