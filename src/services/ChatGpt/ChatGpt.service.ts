import { urls } from "@src/config/urls";
import { fetcher } from "../fetcher";
import { ChatMessage } from "@src/chatGpt.types";
import { wait } from "@src/utils/wait";
import { storageService } from "@src/storage/storage.service";
import { ChatGptSettings } from "@src/components/Providers/ChatGptSettingsProvider";
import { chatGptSettingsDefaults } from "@src/config/settingsDefaults";

export const chatGptService = {
  getChatGptResponse: async (message: string) => {
    await wait(2000);
    return {
      id: 1,
      direction: "inbound",
      createdAt: Date.now(),
      message: `
        this is an api response message
    `,
    } as ChatMessage;
    const response = await fetcher
      .post(`${urls.BASE_URL}/ai/chat`, {
        message,
      })
      .then((res) => res.json())
      .then((res) => {
        return (res?.data || []) as ChatMessage[];
      });
    console.log("getChatGptResponse response ", response);
  },
  getChatGptSettings: async () => {
    const settings = await storageService.get("chatGptSettings");
    if (!settings)
      chatGptService.updateChatGptSettings(chatGptSettingsDefaults);
    return { ...chatGptSettingsDefaults, ...settings };
  },
  updateChatGptSettings: async (settings: ChatGptSettings) => {
    return storageService.set({ chatGptSettings: settings });
  },
};
