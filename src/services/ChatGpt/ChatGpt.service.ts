import { urls } from "@src/config/urls";
import { fetcher } from "../fetcher";
import { ChatMessage } from "@src/chatGpt.types";
import { wait } from "@src/utils/wait";
import { storageService } from "@src/storage/storage.service";
import { ChatGptSettings } from "@src/components/Providers/ChatGptSettingsProvider";
import { chatGptSettingsDefaults } from "@src/config/settingsDefaults";
import { LlmModel } from "@src/components/Providers/ChatGptStateProvider";
import { Tone } from "@src/components/chatGpt/AiRewriteActions";

export const chatGptService = {
  getChatGptResponse: async (messages: ChatMessage[], model: LlmModel) => {
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
        model,
      })
      .then((res) => res.json())
      .then((res) => {
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
  suggestRewrite: async ({
    improvements: improvements,
    input,
    checkInaccuracies,
  }: {
    improvements: Tone[];
    input: string;
    checkInaccuracies?: boolean;
  }) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/rewrite`, {
        input,
        improvements,
        checkInaccuracies,
      })
      .then((res) => res.json())
      .then((res) => {
        return res as {
          message: string;
          inaccuracyMessage: string;
          hasInaccuracies: boolean;
        };
      });
  },
  explain: async ({ text }: { text: string }) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/explain`, {
        text,
      })
      .then((res) => res.json())
      .then((res) => {
        return res as {
          message: string;
        };
      });
  },
  simplify: async ({ text }: { text: string }) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/simplify`, {
        text,
      })
      .then((res) => res.json())
      .then((res) => {
        return res as {
          message: string;
        };
      });
  },
  summarize: async ({ text }: { text: string }) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/summarize`, {
        text,
      })
      .then((res) => res.json())
      .then((res) => {
        return res as {
          message: string;
        };
      });
  },
};
