import { ChatGptMessage, ChatMessage } from "@src/chatGpt.types";
import {
  LlmModel,
  useChatGptState,
} from "@src/components/Providers/ChatGptStateProvider";
import { useServicesContext } from "@src/components/Providers/ServicesProvider";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const useChatResponse = (initialMessage: string) => {
  const { chatGpt: chatGptService } = useServicesContext();
  const {
    data: {
      messages: _messages,
      pending: _pending,
      model,
      aiOptions: _aiOptions,
    },
    updateData: _updateData,
  } = useChatGptState();
  const [localMessages, setLocalMessages] = useState<ChatGptMessage[]>([
    generateInitialMessage(initialMessage, { fullPage }),
  ]);
  const [localPending, setLocalPending] = useState(_pending);
  const [localAiOptions, setLocalAiOptions] = useState({
    ..._aiOptions,
  });

  const disableStoreSync = !!initialMessage;

  useEffect(() => {
    if (!disableStoreSync) return;

    if (messages.length <= 1) {
      setLocalMessages([generateInitialMessage(initialMessage, { fullPage })]);
    } else if (messages.length >= 2) {
      setLocalMessages((messages) => {
        return [
          ...messages,
          generateInitialMessage(initialMessage, {
            fullPage,
            isAdditionalText: true,
          }),
        ];
      });
      scrollToBottom();
    }
  }, [initialMessage]);

  const updateData = (
    data: Partial<ReturnType<typeof useChatGptState>["data"]>
  ) => {
    if (!disableStoreSync) {
      _updateData(data);
    } else {
      if (data.messages != null) {
        setLocalMessages(data.messages);
      }
      if (data.pending != null) {
        setLocalPending(data.pending);
      }
      if (data.aiOptions != null) {
        setLocalAiOptions(data.aiOptions);
      }
    }
  };

  const mutation = useMutation({
    mutationKey: ["chat"],
    mutationFn: async (body: {
      messages: ChatMessage[];
      model: LlmModel;
      aiOptions: {
        keepShort?: boolean;
      };
    }) => {
      const response = await chatGptService.getChatGptResponse(
        body.messages,
        body.model,
        body.aiOptions
      );

      return response;
    },
    onMutate: (body) => {},
  });

  const messages = disableStoreSync ? localMessages : _messages;
  const pending = disableStoreSync ? localPending : _pending;
  const aiOptions = disableStoreSync ? localAiOptions : _aiOptions;
};
