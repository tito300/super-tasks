import { ChipProps, Chip, Stack, IconButton, TextField } from "@mui/material";
import { FilterList, Search, Sort } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useTasksState } from "../../Providers/TasksStateProvider";

export function TasksFilters() {
  const [searchOn, setSearchOn] = useState(false);
  const { data: tasksSettings, updateData: updateTasksSettings } =
    useTasksState();
  const searchRef = useRef<HTMLInputElement>(null);
  const { filters } = tasksSettings;

  useEffect(() => {
    if (!searchOn && filters.search) {
      setSearchOn(true);
      searchRef.current?.focus();
    }
  }, [filters.search]);

  function handleFilterClick(filter: keyof typeof filters) {
    updateTasksSettings({
      filters: {
        ...filters,
        [filter]: !filters[filter],
      },
    });
  }

  function handleSearchClick() {
    setSearchOn(true);
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateTasksSettings({
      filters: {
        ...filters,
        search: event.target.value,
      },
    });
  }

  function handleSearchBlur(event: React.FocusEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setSearchOn(false);
    }
  }

  function handleSortClick() {
    updateTasksSettings({
      filters: {
        ...filters,
        sort:
          filters.sort === "" ? "desc" : filters.sort === "desc" ? "asc" : "",
      },
    });
  }

  return (
    <Stack width="100%" direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
      <Stack direction="row" alignItems="center" mb={0.5} px={0.5} gap={0.5}>
        {!searchOn && (
          <IconButton size="small" onClick={handleSearchClick}>
            <Search fontSize="small" />
          </IconButton>
        )}
        {searchOn && (
          <TextField
            autoFocus
            ref={searchRef}
            variant="standard"
            value={filters.search}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
            size="small"
          />
        )}
        <TaskFilterChip
          onClick={() => handleFilterClick("today")}
          selected={filters.today}
          label="Today"
        />
        <TaskFilterChip
          onClick={() => handleFilterClick("pastDue")}
          selected={filters.pastDue}
          label="Past Due"
        />
        <TaskFilterChip
          onClick={() => handleFilterClick("upcoming")}
          selected={filters.upcoming}
          label="Upcoming"
        />
      </Stack>
      <IconButton sx={{ mt: -0.5 }} color={filters.sort ? "primary" : undefined} size="small" onClick={handleSortClick}>
        {!filters.sort ? (
          <FilterList fontSize="small" />
        ) : (
          <Sort
            fontSize="small"
            sx={{
              transform: filters.sort === "asc" ? "rotate(-180deg)" : "initial",
            }}
          />
        )}
      </IconButton>
    </Stack>
  );
}

function TaskFilterChip({
  selected,
  ...rest
}: { selected: boolean } & ChipProps) {
  return (
    <Chip
      size="small"
      sx={{
        cursor: "pointer",
        fontSize: 12,
        textTransform: "uppercase",
        boxShadow: selected ? 1 : 0,
      }}
      label="Today"
      color={selected ? "primary" : "default"}
      {...rest}
    />
  );
}
