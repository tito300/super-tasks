import { requiredScopes } from "@src/config/googleScopes";
import {
  TasksSettings,
  UserSettings,
  tasksSettingsDefaults,
  userSettingsDefaults,
} from "@src/config/userSettingsDefaults";
import { setupToken } from "@src/oauth/setupToken";

export type UserServiceMethodName = keyof typeof userService;
export const userService = {
  async getUserSettings(): Promise<UserSettings> {
    // for now, just store settings in local storage until we have user endpoints
    const settings = await chrome.storage.local.get("userSettings");
    if (!settings.userSettings)
      userService.updateUserSettings(userSettingsDefaults);
    return { ...userSettingsDefaults, ...settings.userSettings };
  },
  async updateUserSettings(settings: UserSettings) {
    // for now, just store settings in local storage until we have user endpoints
    return chrome.storage.local.set({
      userSettings: { ...userSettingsDefaults, ...settings },
    });
  },

  async getAuthToken(options?: { interactive?: boolean }) {
    try {
      const tokenRes = await chrome.identity.getAuthToken({
        interactive: !!options?.interactive,
      });
      const requiredScopesGranted = tokenRes?.token
        ? requiredScopes.every((scope) =>
            tokenRes?.grantedScopes?.includes?.(scope)
          )
        : false;

      setupToken(tokenRes.token);
      return {
        token: tokenRes.token,
        requiredScopesGranted,
      };
    } catch (err: any) {
      return { token: null, requiredScopesGranted: false };
    }
  },
};
