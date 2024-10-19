import { urls } from "@src/config/urls";
import { fetcher } from "../fetcher";
import { ChatMessage } from "@src/chatGpt.types";
import { wait } from "@src/utils/wait";
import { storageService } from "@src/storage/storage.service";
import { ChatGptSettings } from "@src/components/Providers/ChatGptSettingsProvider";
import { chatGptSettingsDefaults } from "@src/config/settingsDefaults";

export const chatGptService = {
  getChatGptResponse: async (messages: ChatMessage[]) => {
    //   await wait(2000);
    //   return {
    //     id: 1,
    //     direction: "inbound",
    //     createdAt: Date.now(),
    //     message: `
    //       this is an api response message
    //   `,
    //   } as ChatMessage;
    return fetcher
      .post(`${urls.BASE_URL}/ai/chat`, {
        messages,
        model: "gpt",
      })
      .then((res) => res.json())
      .then((res) => {
        console.log("gpt response : ", res);
        return res as ChatMessage;
      });
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
