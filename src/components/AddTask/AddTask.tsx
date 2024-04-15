import { AddTaskOutlined } from "@mui/icons-material";
import { Button, SxProps } from "@mui/material";
import React from "react";
import { AddTaskButton, ButtonContent } from "./AddTask.style";

export function AddTask({ onClick, sx, autoFocus }: { onClick: () => void; sx: SxProps, autoFocus?: boolean }) {
  return (
    <AddTaskButton autoFocus={autoFocus} sx={sx} onClick={onClick} startIcon={<AddTaskOutlined />}>
      <ButtonContent>Add a Task</ButtonContent>
    </AddTaskButton>
  );
}
