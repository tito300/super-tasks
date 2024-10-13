import { requiredScopes } from "@src/config/googleScopes";
import {
  TasksSettings,
  UserSettings,
  tasksSettingsDefaults,
  userSettingsDefaults,
} from "@src/config/settingsDefaults";
import { storageService } from "@src/storage/storage.service";
import { setupToken } from "../fetcher";

export type UserServiceMethodName = keyof typeof userService;
export const userService = {
  async getUserSettings(): Promise<UserSettings> {
    // for now, just store settings in local storage until we have user endpoints
    const settings = await storageService.get("userSettings");
    if (!settings) userService.updateUserSettings(userSettingsDefaults);
    return { ...userSettingsDefaults, ...settings };
  },
  async updateUserSettings(settings: UserSettings) {
    // for now, just store settings in local storage until we have user endpoints
    return storageService.set({
      userSettings: { ...userSettingsDefaults, ...settings },
    });
  },

  setGoogleTokenHeader(token?: string) {
    setupToken(token);
  },

  async getGoogleAuthToken(options?: {
    interactive?: boolean;
    scopes?: string[];
  }) {
    try {
      const tokenRes = await chrome.identity.getAuthToken({
        interactive: !!options?.interactive,
        scopes: options?.scopes || [],
        // scopes: ["https://www.googleapis.com/auth/tasks"],
      });
      const requiredScopesGranted = tokenRes?.token
        ? requiredScopes.every((scope) =>
            tokenRes?.grantedScopes?.includes?.(scope)
          )
        : false;

      userService.setGoogleTokenHeader(tokenRes.token);
      return {
        token: tokenRes.token,
        requiredScopesGranted,
        grantedScopes: tokenRes.grantedScopes,
      };
    } catch (err: any) {
      console.error(err);
      return { token: null, requiredScopesGranted: false };
    }
  },
};
