import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  IconButton,
  MenuList,
  Paper,
  Stack,
  StackProps,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { constants } from "@src/config/constants";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  LlmModel,
  llmModels,
  useChatGptState,
} from "../Providers/ChatGptStateProvider";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useServicesContext } from "../Providers/ServicesProvider";
import { Chip } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Menu } from "@mui/material";
import { MenuItem } from "@mui/material";
import Markdown from "react-markdown";
import { AppControls } from "../shared/AppControls";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useUserState } from "../Providers/UserStateProvider";
import { useLogRender } from "@src/hooks/useLogRender";
import { useScrollableEl } from "@src/hooks/useScrollableEl";
import { useDebouncedValue } from "@src/hooks/useDebouncedValue";
import { AiSelectedText } from "./AiRewriteActions";
import { CodeMarkdown } from "../shared/CodeMarkdown";
import { ChatGptMessage } from "@src/chatGpt.types";
import { useScriptType } from "../Providers/ScriptTypeProvider";

// prevents prism from automatically highlighting code blocks on page
// @ts-expect-error
window.Prism = window.Prism || {};
// @ts-expect-error
window.Prism.manual = true;

export const ChatGpt = () => {
  return (
    <Container>
      <ChatGptControls />
      <ConversationsList />
      <AiConversation />
      {/* <AiRewriteActions /> */}
      <AiSelectedText />
    </Container>
  );
};

export const ChatGptControls = (props: {}) => {
  const { data: chatGptState, updateData } = useChatGptState();
  const handleResetClick = () => {
    updateData({ messages: [], composerDraft: "", pending: false });
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleChangeModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleModelClick = (model: LlmModel) => {
    updateData({ model });
    handleClose();
  };

  return (
    <AppControls
      settingsOpen={false}
      onSettingsClick={() => {}}
      reloading={false}
    >
      <Chip
        variant="outlined"
        size={"small"}
        sx={{ textTransform: "uppercase" }}
        label={chatGptState.model}
        onClick={handleChangeModalClick}
        onDelete={handleChangeModalClick}
        deleteIcon={<KeyboardArrowDownIcon />}
      />
      <Menu
        id="model-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuList dense>
          {llmModels.map((model) => (
            <MenuItem
              sx={{ textTransform: "uppercase" }}
              onClick={() => handleModelClick(model)}
            >
              {model}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </AppControls>
  );
};

const Container = styled(Stack)({
  position: "relative",
  createdAt: Date.now(),
  width: "100%",
  height: "100%",
});

export const ConversationsList = () => {
  // todo
  return null;
};

export const MessagesContainer = styled(Stack)<{ empty: boolean }>(
  ({ theme, empty }) => ({
    flex: 1,
    padding: theme.spacing(1, 1),
    height: "100%",
    justifyContent: empty ? "flex-end" : "initial",
    overflow: "hidden",
  })
);

export const MessageComposer = ({
  onSubmit,
  disableStoreSync,
  ...rest
}: Omit<StackProps, "onSubmit"> & {
  onSubmit: (message: string) => void;
  disableStoreSync?: boolean;
}) => {
  const {
    data: { composerDraft },
    updateData,
  } = useChatGptState();
  const [value, setValue] = useState(composerDraft?.trim() || "");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    setValue(composerDraft);
  }, [composerDraft]);

  const debouncedValue = useDebouncedValue(
    value,
    1000 // high number because if there are many tabs open this could be a performance issue
  );

  useEffect(() => {
    if (disableStoreSync) return;
    if (debouncedValue === composerDraft) return;

    updateData({ composerDraft: debouncedValue });
  }, [debouncedValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // enter pressed without shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.stopPropagation();
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setValue("");
    onSubmit(value);
  };

  return (
    <Stack
      {...rest}
      sx={{ backgroundColor: "white", ...rest.sx }}
      direction="row"
      gap={1.5}
      pb={1}
      alignItems="center"
    >
      <TextField
        value={value}
        variant="filled"
        multiline
        placeholder="Type a message"
        fullWidth
        size="small"
        hiddenLabel
        focused
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <IconButton color="primary" onClick={handleSubmit}>
        <SendIcon />
      </IconButton>
    </Stack>
  );
};

const ConversationFooter = styled(Stack)(({ theme }) => ({
  position: "sticky",
  bottom: 0,
  justifyContent: "flex-end",
  padding: theme.spacing(0.75, 0, 0),
}));

const MessagesWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  flex: 1,
  overflowY: "auto",
  overflowX: "clip",
  paddingBottom: theme.spacing(3.5),
}));

const generateInitialMessage = (
  initialMessage: string | null | undefined,
  options: { fullPage?: boolean; isAdditionalText?: boolean } = {}
): ChatGptMessage => {
  return {
    id: 0,
    message: `${
      options.fullPage
        ? "Full html page innerText"
        : `${
            options.isAdditionalText
              ? "Additional Selected Text "
              : "Selected Text"
          }`
    }: \n
> ${initialMessage?.split("\n").join("\n> ")}\n\n
**What would you like me to do with the selected text?**`,
    direction: "inbound",
    fullPage: options.fullPage,
    fullPageUrl: location.href,
    fullPageDomain: location.hostname,
    fullPageTitle: document.title,
    createdAt: Date.now(),
  } as const;
};

export const AiConversation = ({
  initialMessage,
  scrollableContainer,
  fullPage,
  hidden,
  ...rest
}: {
  initialMessage?: string | null;
  scrollableContainer?: HTMLElement | null;
  fullPage?: boolean;
  hidden?: boolean;
} & StackProps) => {
  const [mounted, setMounted] = useState(false);
  const messagesWrapperRef = useRef<HTMLDivElement | null>(null);
  const {
    data: {
      messages: _messages,
      pending: _pending,
      model,
      aiOptions: _aiOptions,
    },
    updateData: _updateData,
  } = useChatGptState();
  const {
    data: { currentTab, buttonExpanded },
  } = useUserState();
  const { chatGpt } = useServicesContext();
  const [localMessages, setLocalMessages] = useState<ChatGptMessage[]>([
    generateInitialMessage(initialMessage, { fullPage }),
  ]);
  const scriptType = useScriptType();
  const [localPending, setLocalPending] = useState(_pending);
  const [localAiOptions, setLocalAiOptions] = useState({
    ..._aiOptions,
  });

  const scrollableEl = scrollableContainer || messagesWrapperRef.current;

  const disableStoreSync = !!initialMessage;
  const messages = disableStoreSync ? localMessages : _messages;
  const pending = disableStoreSync ? localPending : _pending;
  const aiOptions = disableStoreSync ? localAiOptions : _aiOptions;

  const fullPageSelected = useMemo(
    () => !!messages.find((m) => m.fullPage && m.fullPageUrl === location.href),
    [messages]
  );

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

  useEffect(() => {
    if (!hidden && messages.length > 1) {
      scrollToBottom();
    }
  }, [hidden]);

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

  const scrollToBottom = () => {
    if (scrollableEl) {
      scrollableEl.scrollTop = scrollableEl.scrollHeight;
    }
  };

  const scrollToMsgTop = (id: number) => {
    if (!scrollableEl) return;

    const el = scrollableEl.querySelector(
      `#${constants.EXTENSION_NAME}-message-${id}`
    ) as HTMLDivElement | null;

    if (el) {
      scrollableEl.scrollTo({ behavior: "smooth", top: el.offsetTop - 150 });
    }
  };

  useLayoutEffect(() => {
    if (currentTab !== "chatGpt" || !buttonExpanded) return;
    scrollToBottom();
  }, [scrollableEl, currentTab, buttonExpanded]);

  const handleSubmit = (message: string) => {
    let messagesClone = [
      ...messages,
      {
        message,
        direction: "outbound",
        createdAt: Date.now(),
        id: Date.now(),
      } as const,
    ];
    updateData({
      messages: messagesClone,
      composerDraft: "",
      pending: true,
    });

    chatGpt
      .getChatGptResponse(messagesClone, model, aiOptions)
      .then((response) => {
        messagesClone = [...messagesClone, response];
        updateData({ messages: messagesClone, pending: false });
        setTimeout(() => {
          scrollToMsgTop(response.id);
        }, 100);
      })
      .catch((error) => {
        console.error(error);
        updateData({
          messages: [
            ...messagesClone,
            {
              message: "Something went wrong. Please try again.",
              direction: "inbound",
              createdAt: Date.now(),
              error: true,
              id: Date.now(),
            },
          ],
          composerDraft: message,
          pending: false,
        });
      });
  };

  const handleActionClick = (action: "clear" | "fullPage" | "shortAnswers") => {
    if (action === "clear") {
      updateData({
        messages: [],
        composerDraft: "",
        pending: false,
      });
    } else if (action === "fullPage") {
      if (fullPageSelected) {
        updateData({
          messages: messages.slice(0, -1),
          composerDraft: "",
          pending: false,
        });
      } else {
        updateData({
          messages: [
            ...messages,
            generateInitialMessage(document.body.innerText, { fullPage: true }),
          ],
          composerDraft: "",
          pending: false,
        });
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    } else if (action === "shortAnswers") {
      updateData({
        aiOptions: {
          ...aiOptions,
          keepShort: !aiOptions.keepShort,
        },
      });
    }
  };

  if (hidden) return null;

  return (
    <MessagesContainer
      ref={(el) => {
        if (el) {
          setMounted(true);
        } else {
          setMounted(false);
        }
      }}
      flex={1}
      empty={!messages?.length}
      {...rest}
    >
      <MessagesWrapper ref={messagesWrapperRef}>
        {messages?.length ? (
          messages.map((message, i) => {
            return (
              <Message
                id={`${constants.EXTENSION_NAME}-message-${message.id}`}
                key={message.id}
                message={message}
              />
            );
          })
        ) : (
          <Typography
            alignSelf={"center"}
            textAlign={"center"}
            variant="h5"
            color={"GrayText"}
            sx={{ flex: 1, paddingTop: "140px", opacity: 0.7 }}
          >
            How can I help you today?
          </Typography>
        )}
      </MessagesWrapper>
      <ConversationFooter gap={pending ? 2 : 1}>
        {pending ? (
          <TypingIndicator />
        ) : (
          <Stack
            sx={{
              position: "absolute",
              bottom: "100%",
            }}
            direction="row"
            gap={0.5}
          >
            <ChatActionChip
              onClick={() => handleActionClick("shortAnswers")}
              label="Short Answers"
              selected={aiOptions.keepShort}
              size="small"
            />
            {!fullPageSelected && scriptType !== "Popup" && (
              <ChatActionChip
                onClick={() => handleActionClick("fullPage")}
                label="Read Page"
                selected={fullPageSelected}
                size="small"
              />
            )}
            <ChatActionChip
              onClick={() => handleActionClick("clear")}
              label="Clear"
              size="small"
            />
          </Stack>
        )}
        <MessageComposer
          disableStoreSync={disableStoreSync}
          onSubmit={handleSubmit}
        />
      </ConversationFooter>
    </MessagesContainer>
  );
};

const ChatActionChip = styled(Chip)<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    cursor: "pointer",
    color: theme.palette.text.secondary,
    backgroundColor: "white",
    border: `1px solid ${theme.palette.grey[300]}`,
    boxShadow: "0px 1px 4px #00000025",
    ...(selected && {
      backgroundColor: theme.palette.grey[500],
      boxShadow: "none",
      border: "none",
      color: "white",
    }),
    ["&:hover"]: {
      backgroundColor: theme.palette.grey[200],
      boxShadow: "0px 1px 4px #00000035",
      ...(selected && {
        backgroundColor: theme.palette.grey[500],
        boxShadow: "none",
      }),
    },
  })
);

// three dots jumping animation
export const TypingIndicator = () => {
  return (
    <Stack
      direction="row"
      justifyContent="start"
      gap={0.5}
      paddingLeft={2}
      alignItems="center"
      sx={{
        position: "absolute",
        bottom: "100%",
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          backgroundColor: "GrayText",
          borderRadius: "50%",
          animation: "jump 1s infinite",
          "@keyframes jump": {
            "0%, 50%, 100%": {
              transform: "translateY(0)",
            },
            "25%": {
              transform: "translateY(-4px)",
            },
            "75%": {
              transform: "translateY(4px)",
            },
          },
        }}
      />
      <Box
        sx={{
          width: 8,
          height: 8,
          backgroundColor: "GrayText",
          borderRadius: "50%",
          animation: "jump 1s infinite",
          animationDelay: "0.1s",
        }}
      ></Box>
      <Box
        sx={{
          width: 8,
          height: 8,
          backgroundColor: "GrayText",
          borderRadius: "50%",
          animation: "jump 1s infinite",
          animationDelay: "0.2s",
        }}
      ></Box>
    </Stack>
  );
};

export type Message = {
  id: number;
  message: string;
  direction: "inbound" | "outbound";
  createdAt: number;
  fullPage?: boolean;
};

export const MessageContainer = styled(Stack)<{
  messageDirection: "inbound" | "outbound";
}>(({ theme, messageDirection }) => ({
  maxWidth: 360,
  alignSelf: messageDirection === "outbound" ? "flex-end" : "flex-start",
  wordBreak: "break-word",
  padding: theme.spacing(1, 2),
  "& p": {
    margin: 0,
  },
}));

export const Message = ({
  message,
  ...rest
}: { message: ChatGptMessage } & StackProps) => {
  const {
    data: { blurText },
  } = useUserState();
  const inbound = message.direction === "inbound";

  useLogRender("Message");

  return (
    <MessageContainer
      direction={inbound ? "row" : "row-reverse"}
      messageDirection={message.direction}
      spacing={1}
      {...rest}
    >
      <Avatar
        sx={{ width: 24, height: 24 }}
        src={inbound ? chrome.runtime.getURL("chatgpt-icon.png") : undefined}
      >
        {message.direction[0].toUpperCase()}
      </Avatar>
      <Paper
        elevation={inbound ? 0 : 2}
        sx={{
          paddingY: inbound ? 0 : 1,
          paddingX: 1,
          borderRadius: 3,
          filter: blurText ? "blur(7px)" : "none",
          backgroundColor: message.error ? "#ffb4b4" : "white",
        }}
      >
        {" "}
        {inbound ? (
          message.fullPage ? (
            <>
              <Chip
                label={
                  message.fullPageUrl === location.href
                    ? `Current Page is Read`
                    : `Page "${truncateText(
                        message.fullPageTitle!,
                        15
                      )}" was Read`
                }
                sx={{
                  mb: 1,
                  backgroundColor: "#4662a5",
                  color: "white",
                  boxShadow: "0 2px 4px #00000036",
                }}
              />
              <Typography
                fontWeight={500}
              >{`What would you like me to do with it?`}</Typography>
            </>
          ) : (
            <CodeMarkdown>{message.message}</CodeMarkdown>
          )
        ) : (
          <Typography>{message.message}</Typography>
        )}
      </Paper>
    </MessageContainer>
  );
};

function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
