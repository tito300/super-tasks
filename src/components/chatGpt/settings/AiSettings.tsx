import { InfoOutlined } from "@mui/icons-material";
import { styled, Typography } from "@mui/material";
import {
  Stack,
  FormControlLabel,
  Switch,
  FormGroup,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import { useChatGptSettings } from "@src/components/Providers/ChatGptSettingsProvider";
import { useUserSettings } from "@src/components/Providers/UserSettingsProvider";
import { FormGroupStyled } from "@src/components/shared/Settings/ExtensionSettings";

export function AiSettings() {
  const {
    chatGptSettings: { disableTextSelectionTooltip },
    updateChatGptSettings,
  } = useChatGptSettings();
  return (
    <Stack px={2}>
      {/* <SettingsGroup> */}
      <FormGroupStyled>
        <FormControlLabel
          control={
            <Switch
              checked={disableTextSelectionTooltip}
              onChange={(e) =>
                updateChatGptSettings({
                  disableTextSelectionTooltip: e.target.checked,
                })
              }
            />
          }
          label="Disable Text Selection Tooltip"
        />
        <Tooltip
          title={
            <>
              If enabled, the AI tooltip that shows up when you select text will
              not be shown.
            </>
          }
        >
          <InfoOutlined fontSize="small" />
        </Tooltip>
      </FormGroupStyled>
      {/* </SettingsGroup> */}
    </Stack>
  );
}
