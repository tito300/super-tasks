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
import { useUserSettings } from "@src/components/Providers/UserSettingsProvider";

export function ExtensionSettings() {
  const { userSettings, updateUserSettings } = useUserSettings();
  return (
    <Stack px={2}>
      <SettingsGroup>
        <Typography variant="h6">General</Typography>
        <FormGroupStyled>
          <FormControlLabel
            control={
              <Switch
                checked={!userSettings.popupOnly}
                onChange={(e) =>
                  updateUserSettings({ popupOnly: e.target.checked })
                }
              />
            }
            label="Show Extension on Pages"
          />
          <Tooltip
            title={
              <>
                If disabled, the extension will not show up on pages. To use the
                extension you will need to click on the extension icon in the
                browser toolbar.
              </>
            }
          >
            <InfoOutlined fontSize="small" />
          </Tooltip>
        </FormGroupStyled>
      </SettingsGroup>
      <SettingsGroup>
        <Typography variant="h6">Feature Sync Across Tabs</Typography>
        <FormGroupStyled>
          <FormControlLabel
            control={
              <Switch
                checked={userSettings.syncCurrentTab}
                onChange={(e) =>
                  updateUserSettings({ syncCurrentTab: e.target.checked })
                }
              />
            }
            label="Current Selected App"
          />
          <Tooltip
            title={
              <>
                If enabled, when you switch between apps all open tabs will be
                synced to the current app.
              </>
            }
          >
            <InfoOutlined fontSize="small" />
          </Tooltip>
        </FormGroupStyled>
        <FormGroupStyled>
          <FormControlLabel
            control={
              <Switch
                checked={userSettings.syncBlurText}
                onChange={(e) =>
                  updateUserSettings({ syncBlurText: e.target.checked })
                }
              />
            }
            label="Text Blur"
          />
          <Tooltip
            title={
              <>
                If enabled, when the blur text is enabled in one tab, it will be
                cause the extension to blue on all tabs.
              </>
            }
          >
            <InfoOutlined fontSize="small" />
          </Tooltip>
        </FormGroupStyled>
      </SettingsGroup>
    </Stack>
  );
}

export const FormGroupStyled = styled(FormGroup)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

export const SettingsGroup = styled(Stack)({
  marginBottom: 16,
});
