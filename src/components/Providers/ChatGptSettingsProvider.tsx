import { chatGptSettingsDefaults } from "@src/config/settingsDefaults";
import { storageService } from "@src/storage/storage.service";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useServicesContext } from "./ServicesProvider";
import { deepmerge } from "@mui/utils";
import { ChatMessage } from "@src/chatGpt.types";

export type ChatGptSettings = {
  syncMessages: boolean;
  syncComposerDraft: boolean;
  syncPending: boolean;
};

type ChatGptSettingsContext = {
  chatGptSettings: ChatGptSettings;
  updateChatGptSettings: (newSettings: Partial<ChatGptSettings>) => void;
};

const ChatGptSettingsContext = createContext<ChatGptSettingsContext>(null!);

export function ChatGptSettingsProvider({ children }: PropsWithChildren) {
  const [chatGptSettings, setChatGptSettings] = useState<ChatGptSettings>(
    chatGptSettingsDefaults
  );
  const { chatGpt: chatGptService } = useServicesContext();

  useEffect(() => {
    chatGptService.getChatGptSettings().then(setChatGptSettings);
    storageService.onChange("chatGptSettings", (changes) => {
      setChatGptSettings(
        changes?.chatGptSettings?.newValue ?? {
          ...chatGptSettingsDefaults,
        }
      );
    });
  }, []);

  const updateChatGptSettings = useCallback(
    (newSettings: Partial<ChatGptSettings>) => {
      setChatGptSettings((prevSettings) => {
        const settings = deepmerge(prevSettings, newSettings);
        chatGptService.updateChatGptSettings(settings);
        return settings;
      });
    },
    [chatGptService]
  );

  const value = useMemo(
    () => ({
      chatGptSettings,
      updateChatGptSettings,
    }),
    [chatGptSettings, updateChatGptSettings]
  );

  return (
    <ChatGptSettingsContext.Provider value={value}>
      {children}
    </ChatGptSettingsContext.Provider>
  );
}

export const useChatGptSettings = () => {
  const context = useContext(ChatGptSettingsContext);
  if (!context) {
    throw new Error(
      "useChatGptSettings must be used within a ChatGptSettingsProvider"
    );
  }
  return context;
};
