import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";

export function TasksSettings() {
  return (
    <Stack>
      <Typography variant="h5">Tasks Settings</Typography>
      {/* a list of mui checkbox options for each of the use default settings */}
      <FormGroup>
        <Stack>
          <FormControlLabel control={<Checkbox size="small" />} label="Dark Mode" />
          <Typography pl={3} variant="body2">Enable dark mode for the tasks page</Typography>
        </Stack>
        <Stack>
          <FormControlLabel control={<Checkbox size="small" />} label="Persist Open/Close" />
          <Typography pl={3} variant="body2">This will </Typography>
        </Stack>
      </FormGroup>
    </Stack>
  );
}
