import { UserSettings, userSettingsDefaults } from "@src/config/userSettingsDefaults";

export type UserServiceMethodName = keyof typeof userService;
export const userService = {
    async getUserSettings(): Promise<UserSettings | undefined> {
        // for now, just store settings in local storage until we have user endpoints
        const settings = await chrome.storage.local.get('userSettings');
        if (!settings.userSettings) userService.updateUserSettings(userSettingsDefaults);
        return { ...userSettingsDefaults, ...settings.userSettings };
    },
    async updateUserSettings(settings: UserSettings) {
        // for now, just store settings in local storage until we have user endpoints
        return chrome.storage.local.set({ userSettings: {...userSettingsDefaults, ...settings} });
    }
}

function safeParse(json?: string | null, defaultValue?: any) {
    if (!json) {
        return defaultValue;
    }

    try {
        return JSON.parse(json);
    } catch (e) {
        return defaultValue;
    }
}