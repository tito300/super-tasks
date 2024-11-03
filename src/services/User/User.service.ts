import {
  TasksSettings,
  UserSettings,
  tasksSettingsDefaults,
  userSettingsDefaults,
} from "@src/config/settingsDefaults";
import { storageService } from "@src/storage/storage.service";
import { fetcher, setupGoogleToken, setupJwtToken } from "../fetcher";
import { ServiceObject } from "..";
import { urls } from "@src/config/urls";

export type UserServiceMethodName = keyof typeof userService;
export const userService: ServiceObject = {
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

  async setGoogleTokenHeader(token?: string) {
    setupGoogleToken(token);
  },
  async setJwtTokenHeader(token?: string) {
    setupJwtToken(token);
  },

  async getGoogleAuthToken(options?: {
    interactive?: boolean;
    scopes?: string[];
  }) {
    try {
      const scopes = options?.scopes || [];

      const tokenRes = await chrome.identity.getAuthToken({
        interactive: !!options?.interactive,
        scopes: scopes,
        // scopes: ["https://www.googleapis.com/auth/tasks"],
      });
      const requiredScopesGranted = tokenRes?.token
        ? scopes.every((scope) => tokenRes?.grantedScopes?.includes?.(scope))
        : false;

      userService.setGoogleTokenHeader(tokenRes.token);

      const userInfo = await userService.getUserInfo();

      return {
        token: tokenRes.token,
        email: userInfo.email,
        chromeId: userInfo.id,
        requiredScopesGranted,
        grantedScopes: tokenRes.grantedScopes,
      };
    } catch (err: any) {
      console.error(err);
      return { token: null, requiredScopesGranted: false };
    }
  },
  async getUserInfo() {
    return chrome.identity.getProfileUserInfo({
      accountStatus: "ANY",
    } as chrome.identity.ProfileDetails);
  },
  async openPopup() {
    chrome.windows.create({
      url: chrome.runtime.getURL("src/pages/popup/index.html"),
      type: "popup",
      width: 520,
      height: 300,
    });
  },
  async createUser(user: {
    email: string;
    accountId: string;
    subscriptionType: string;
  }) {
    let jwtToken = "";
    const createdUser = await fetcher
      .post(`${urls.BASE_URL}/users`, user)
      .then((res) => {
        console.log({ res });
        jwtToken = res.headers.get("Jwt-Token") || "";
        return res.json();
      })
      .then((data) => {
        console.log({ data });
        return data;
      });
    return { jwtToken, user: createdUser };
  },
  async generateJwtToken(body: { accountId: string; googleToken: string }) {
    return fetcher
      .post(`${urls.BASE_URL}/auth/login`, body)
      .then((res) => res.json())
      .then((data) => data?.jwt_token as { jwt_token: string });
  },
};
