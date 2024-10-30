import { urls } from "@src/config/urls";
import { fetcher } from "../fetcher";
import { ChatMessage } from "@src/chatGpt.types";
import { wait } from "@src/utils/wait";
import { storageService } from "@src/storage/storage.service";
import { ChatGptSettings } from "@src/components/Providers/ChatGptSettingsProvider";
import { chatGptSettingsDefaults } from "@src/config/settingsDefaults";
import { LlmModel } from "@src/components/Providers/ChatGptStateProvider";
import { Tone } from "@src/components/chatGpt/AiRewriteActions";

export type AiQuickActionsBody = {
  text: string;
  aiOptions: {
    factCheck: boolean;
    keepShort: boolean;
  };
};

export type AiQuickActionsResponse = {
  message: string;
  hasInaccuracies: boolean;
  inaccuracyMessage: string;
};

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
    keepShort,
  }: {
    improvements: Tone[];
    input: string;
    checkInaccuracies?: boolean;
    keepShort?: boolean;
  }) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/rewrite`, {
        input,
        improvements,
        checkInaccuracies,
        keepShort,
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
  explain: async (body: AiQuickActionsBody) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/quick-action`, { action: "Explain", ...body })
      .then((res) => res.json())
      .then((res) => {
        return res as AiQuickActionsResponse;
      });
  },
  simplify: async (body: AiQuickActionsBody) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/quick-action`, { action: "Simplify", ...body })
      .then((res) => res.json())
      .then((res) => {
        return res as AiQuickActionsResponse;
      });
  },
  summarize: async (body: AiQuickActionsBody) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/quick-action`, {
        action: "Summarize",
        ...body,
      })
      .then((res) => res.json())
      .then((res) => {
        return res as AiQuickActionsResponse;
      });
  },
  peerReview: async (body: AiQuickActionsBody) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/quick-action`, {
        action: "PeerReview",
        ...body,
      })
      .then((res) => res.json())
      .then((res) => {
        return res as AiQuickActionsResponse;
      });
  },
  answer: async (body: AiQuickActionsBody) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/quick-action`, { action: "Answer", ...body })
      .then((res) => res.json())
      .then((res) => {
        return res as AiQuickActionsResponse;
      });
  },
};
