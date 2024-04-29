import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDeleteTask } from "../../../api/task.api";
import { useFormContext } from "react-hook-form";
import { TaskForm } from "../Task";
import { ListItemIcon, ListItemText } from "@mui/material";
import { ContentCut, Delete } from "@mui/icons-material";
import { TaskOptionsContainer } from "../Task.styles";

export function TaskOptionsMenu({ listId }: { listId: string }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const deleteMutation = useDeleteTask(listId);
  const { getValues } = useFormContext<TaskForm>();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = () => {
    deleteMutation.mutate(getValues("id"));
  };

  return (
    <TaskOptionsContainer id="supertasks-options">
      <IconButton
        aria-label="more"
        id="long-button"
        size="small"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        onFocus={e => e.stopPropagation()}
        sx={{ p: 0.5 }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
          sx: { width: 150 },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDelete} dense>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </TaskOptionsContainer>
  );
}
