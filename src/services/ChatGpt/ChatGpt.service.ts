import { urls } from "@src/config/urls";
import { fetcher } from "../fetcher";
import { ChatMessage } from "@src/chatGpt.types";
import { wait } from "@src/utils/wait";
import { storageService } from "@src/storage/storage.service";
import { ChatGptSettings } from "@src/components/Providers/ChatGptSettingsProvider";
import { chatGptSettingsDefaults } from "@src/config/settingsDefaults";
import { LlmModel } from "@src/components/Providers/ChatGptStateProvider";
import { Tone } from "@src/components/chatGpt/AiSelectedText";
import { ServiceObject } from "..";

export type AiQuickActionsBody = {
  text: string;
  model: LlmModel;
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

export const chatGptService: ServiceObject = {
  getChatGptResponse: async (
    messages: ChatMessage[],
    aiOptions: {
      keepShort?: boolean;
      model: LlmModel;
    }
  ) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/chat`, {
        messages,
        aiOptions,
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
    model,
  }: {
    improvements: Tone[];
    input: string;
    checkInaccuracies?: boolean;
    keepShort?: boolean;
    model: LlmModel;
  }) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/rewrite`, {
        input,
        improvements,
        aiOptions: { factCheck: checkInaccuracies, keepShort, model },
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
  factCheck: async (body: AiQuickActionsBody) => {
    return fetcher
      .post(`${urls.BASE_URL}/ai/quick-action`, {
        action: "FactCheck",
        ...body,
      })
      .then((res) => res.json())
      .then((res) => {
        return res as AiQuickActionsResponse;
      });
  },
};
