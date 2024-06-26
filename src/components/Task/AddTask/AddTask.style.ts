import { Button, styled } from "@mui/material";

export const AddTaskButton = styled(Button)(({ theme }) => {
  return {
    textTransform: "none",
    borderRadius: 10,
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  };
});

export const ButtonContent = styled("div")(({ theme }) => {
  return {
    width: "100%",
    textAlign: "start",
    paddingLeft: theme.spacing(1),
  };
});
