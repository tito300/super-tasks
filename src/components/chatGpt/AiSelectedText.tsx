import {
  AutoFixHigh,
  Cancel,
  Chat,
  CheckBox,
  CheckBoxOutlineBlank,
  DriveFileRenameOutline,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  ChipProps,
  Divider,
  IconButton,
  StackProps,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  forwardRef,
  startTransition,
  useEffect,
  useRef,
  useState,
} from "react";
import { styled } from "@mui/material";
import { constants } from "@src/config/constants";
import { Stack } from "@mui/material";
import { useServicesContext } from "../Providers/ServicesProvider";
import { FormControlLabel } from "@mui/material";
import { useSelectedText } from "@src/hooks/useSelectedText";
import { AiFormLayout, AiFormLayoutPaddings } from "./Shared/AiFormLayout";
import { CodeMarkdown } from "../shared/CodeMarkdown";
import { StyledPopover } from "../shared/StyledPopover";
import { AiConversation, ChatActionChip, ConversationActions } from "./ChatGpt";
import { useLogRender } from "@src/hooks/useLogRender";
import { LlmModel } from "../Providers/ChatGptStateProvider";
import { ShadowDomPortal } from "../shared/ShadowDomPortal";
import { retryAsync } from "@src/utils/retryAsync";
import { AiReWriteForm } from "./AiRewriteText";
import { useMessageEngine } from "../Providers/MessageEngineProvider";

// prevents prism from automatically highlighting code blocks on page
// @ts-expect-error
window.Prism = window.Prism || {};
// @ts-expect-error
window.Prism.manual = true;

const AiMessageTypography = styled(Typography)({
  whiteSpace: "pre-line",
});

export const AiTooltipButtons = forwardRef<
  HTMLDivElement,
  {
    expandDirection: "left" | "right";
    onOpen: () => void;
    handleRemoveIcon: () => void;
  } & StackProps
>(function _AiTooltipButtons(
  { expandDirection, onOpen, handleRemoveIcon, ...rest },
  ref
) {
  return (
    <IconsTooltipContainer ref={ref} {...rest}>
      <IconsTooltipWrapper
        id={`${constants.EXTENSION_NAME}-ai-tooltip-buttons`}
        direction={expandDirection === "right" ? "row-reverse" : "row"}
        alignItems="center"
      >
        <IconButton
          id={`${constants.EXTENSION_NAME}-remove-suggestion-icon`}
          sx={{
            display: "none",
            translate:
              expandDirection === "right"
                ? "transformX(-100%)"
                : "transformX(100%)",
          }}
          size="small"
          color="primary"
          onClick={handleRemoveIcon}
        >
          <Cancel />
        </IconButton>
        <IconButton size="small" color="primary" onClick={onOpen}>
          <AutoFixHigh />
        </IconButton>
      </IconsTooltipWrapper>
    </IconsTooltipContainer>
  );
});

export const IconsTooltipContainer = styled(Stack)({
  [`&:hover #${constants.EXTENSION_NAME}-ai-tooltip-buttons`]: {
    transform: "scale(1)",
    transition: "transform 0.2s",
  },
});
export const IconsTooltipWrapper = styled(Stack)({
  backgroundColor: "#ffdd00",
  borderRadius: "10px",
  border: "1px solid #66625a38",
  transform: "scale(0.4)",
  [`&:hover`]: {
    borderRadius: "10px",
    backgroundColor: "#ffe694",
    BorderColor: "#66625a38",
    [` #${constants.EXTENSION_NAME}-remove-suggestion-icon`]: {
      display: "flex",
      translate: "transformX(0)",
      transition: "translate 0.2s",
    },
  },
});

const AiOptionButton = styled(Button)({
  textTransform: "none",
  width: "100%",
  borderRadius: 0,
  borderBottomWidth: 0,
  "&:last-child": {
    borderBottomWidth: 1,
  },
});

export type AiAction =
  | "Explain"
  | "Rewrite"
  | "Summarize"
  | "Simplify"
  | "Answer"
  | "PeerReview"
  | "Chat"
  | "factCheck"
  | "Fix";

export const AiActionMap = {
  Explain: "Explain",
  Rewrite: "Rewrite",
  Summarize: "Summarize",
  Simplify: "Simplify",
  PeerReview: "Peer Review",
  Answer: "Answer",
  Chat: "Chat",
  factCheck: "Fact Check",
  Fix: "Fix",
};

export function AiSelectedText() {
  useLogRender("AiSelectedText");
  const [open, setOpen] = useState(false);
  const messageEngine = useMessageEngine();
  const {
    selectedText: inSelectedText,
    selectedTextPositions,
    textType,
    getSelectedText,
  } = useSelectedText();
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [hideAll, setHideAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedActionsHistory, setSelectedActionsHistory] = useState<
    AiAction[]
  >([]);
  const { chatGpt } = useServicesContext();
  const [aiOptions, setAiOptions] = useState<{
    factCheck: boolean;
    keepShort: boolean;
    fullPage: boolean;
    model: LlmModel["value"];
  }>({
    factCheck: false,
    keepShort: false,
    fullPage: false,
    model: "gpt-4o",
  });
  const [factCheckMessage, setFactCheckMessage] = useState<string | null>(null);
  const [hasInaccuracies, setHasInaccuracies] = useState(false);
  const [currentSelectedText, setCurrentSelectedText] = useState<string | null>(
    null
  );
  const [conversationKey, setConversationKey] = useState(0);
  const [tokenLimitReached, setTokenLimitReached] = useState(false);
  const conversationActions = useRef<ConversationActions>(null);

  const selectedAction = selectedActionsHistory.length
    ? selectedActionsHistory[selectedActionsHistory.length - 1]
    : null;

  useEffect(() => {
    messageEngine.onMessage("OpenWithAxessAI", async () => {
      handleOpen(getSelectedText());
    });
  }, []);

  const resetResults = ({
    keepSelectedAction,
  }: {
    keepSelectedAction?: boolean;
  } = {}) => {
    if (!keepSelectedAction) setSelectedActionsHistory([]);
    setErrorMessage("");
    setAiMessage(null);
    setFactCheckMessage(null);
    setHasInaccuracies(false);
  };

  const handleSubmit = (
    todo: AiAction,
    _aiOptions?: Partial<typeof aiOptions>
  ) => {
    const mergedAiOptions = { ...aiOptions, ..._aiOptions };
    let text = mergedAiOptions.fullPage
      ? getFullPageText()
      : currentSelectedText?.trim() || null;

    if (!text) {
      if (import.meta.env.DEV) {
        alert("No text to process");
      }
      setErrorMessage("Sorry, no input was detected.");
      return;
    }

    resetResults({ keepSelectedAction: true });
    setLoading(true);

    const service =
      todo === "Explain"
        ? chatGpt.explain
        : todo === "Simplify"
        ? chatGpt.simplify
        : todo === "PeerReview"
        ? chatGpt.peerReview
        : todo === "Answer"
        ? chatGpt.answer
        : todo === "Summarize"
        ? chatGpt.summarize
        : todo === "factCheck"
        ? chatGpt.factCheck
        : null;

    if (!service) return;

    retryAsync(
      () =>
        service({
          text,
          aiOptions: mergedAiOptions,
        }),
      3
    )
      .then((res) => {
        setAiMessage(res.message);
        if (mergedAiOptions.factCheck) {
          setHasInaccuracies(res.hasInaccuracies);
          setFactCheckMessage(res.inaccuracyMessage);
        }
        if (res.limitReached) {
          setTokenLimitReached(true);
        }
      })
      .catch((error) => {
        setErrorMessage("Sorry, something went wrong.");
      })
      .finally(() => setLoading(false));
  };

  const handleTodoClick = (todo: AiAction) => {
    if (selectedAction === todo) {
      setSelectedActionsHistory((history) => history.slice(0, -1));
    } else {
      setSelectedActionsHistory((history) => [...history, todo]);

      if (todo === "Rewrite") return;
      if (todo === "Chat") return;

      handleSubmit(todo);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleResultChatClick = () => {
    conversationActions.current?.clearConversation();
    setSelectedActionsHistory((history) => [...history, "Chat"]);
    setCurrentSelectedText(aiMessage);
  };

  const handleGoBack = () => {
    setSelectedActionsHistory((history) => history.slice(0, -1));
  };

  const handleOpen = (_selection?: string) => {
    setOpen(true);
    const selection = _selection ?? inSelectedText;
    if (currentSelectedText !== selection) {
      resetResults();
      if (textType === "input") {
        setSelectedActionsHistory((history) => [...history, "Rewrite"]);
      }
    }
    setCurrentSelectedText(selection);
  };

  if (hideAll) return null;

  const showResults = selectedAction || loading;
  const showComponent = inSelectedText || open;

  const handleOptionClick = (option: keyof typeof aiOptions) => {
    setAiOptions((options) => ({ ...options, [option]: !options[option] }));
    if (showResults) {
      startTransition(() => {
        handleSubmit(selectedAction!, { [option]: !aiOptions[option] });
      });
    }
  };

  const noTextSelected = !currentSelectedText?.trim?.();

  return (
    <ShadowDomPortal
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: Number.MAX_SAFE_INTEGER - 10,
        display: showComponent ? "block" : "none",
      }}
    >
      <AiTooltipButtons
        ref={containerRef}
        sx={{ ...selectedTextPositions }}
        expandDirection="right"
        onOpen={() => handleOpen()}
        handleRemoveIcon={() => setHideAll(true)}
      />
      <StyledPopover
        open={open}
        anchorEl={containerRef.current}
        keepMounted
        disableScrollLock
        disablePortal
        onClose={handleClose}
        sx={{ zIndex: Number.MAX_SAFE_INTEGER - 9 }}
        slotProps={{
          paper: {
            sx: {
              overflowY: "unset",
              overflowX: "unset",
            },
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <AiFormLayout
          onClose={handleClose}
          title="Ai Chat"
          hidden={selectedAction !== "Chat"}
          onBackClick={handleGoBack}
          disableFooterBackButton
          sx={{
            height: "60vh",
            maxHeight: "unset",
          }}
        >
          <AiConversation
            key={conversationKey}
            sx={{ height: "100%" }}
            fullPage={aiOptions.fullPage}
            hidden={selectedAction !== "Chat"}
            initialMessage={currentSelectedText?.trim()}
            actions={conversationActions}
            disableStoreSync
          />
        </AiFormLayout>

        <AiReWriteForm
          input={currentSelectedText}
          keepShort={aiOptions.keepShort}
          factCheck={aiOptions.factCheck}
          onClose={handleClose}
          onBackClick={handleGoBack}
          updateInput={() => {}}
          hidden={selectedAction !== "Rewrite"}
        />
        <AiFormLayout
          hidden={selectedAction === "Chat" || selectedAction === "Rewrite"}
          title={
            loading
              ? "Working on it.."
              : selectedAction && aiMessage
              ? `${AiActionMap[selectedAction]} Result`
              : "What do you want to do?"
          }
          skeletonHeight={100}
          errorMessage={errorMessage}
          limitReached={tokenLimitReached}
          loading={loading}
          onClose={handleClose}
          onRetryClick={showResults && (() => handleSubmit(selectedAction!))}
          onBackClick={selectedAction && handleGoBack}
          buttons={
            selectedAction && (
              <Button
                variant="contained"
                size="small"
                color="primary"
                disabled={loading}
                onClick={handleResultChatClick}
              >
                chat
              </Button>
            )
          }
        >
          {!selectedAction ? (
            <>
              <Box px={AiFormLayoutPaddings.pxValue} pt={1}>
                <Typography
                  variant="body2"
                  color="GrayText"
                  textOverflow={"ellipsis"}
                  overflow={"hidden"}
                  whiteSpace={"nowrap"}
                  borderLeft={"4px solid #0000001f"}
                  sx={{ backgroundColor: "#f3f3f3" }}
                  py={0.5}
                  pl={1}
                  borderRadius={0.5}
                >
                  {noTextSelected ? "No text selected" : currentSelectedText}
                </Typography>
              </Box>
              <Stack
                px={AiFormLayoutPaddings.pxValue}
                pt={1.5}
                pb={2}
                direction="row"
                flexWrap="wrap"
                gap={0.5}
              >
                <ToneChip
                  label={AiActionMap.Explain}
                  onClick={() => handleTodoClick("Explain")}
                  selected={selectedAction === "Explain"}
                  variant="outlined"
                  disabled={noTextSelected}
                />
                <ToneChip
                  label={AiActionMap.Summarize}
                  onClick={() => handleTodoClick("Summarize")}
                  selected={selectedAction === "Summarize"}
                  variant="outlined"
                  disabled={noTextSelected}
                />
                <ToneChip
                  label={AiActionMap.Simplify}
                  onClick={() => handleTodoClick("Simplify")}
                  selected={selectedAction === "Simplify"}
                  variant="outlined"
                  disabled={noTextSelected}
                />
                <ToneChip
                  label={AiActionMap.Answer}
                  disabled={aiOptions.fullPage || noTextSelected}
                  onClick={() => handleTodoClick("Answer")}
                  selected={selectedAction === "Answer"}
                  variant={"outlined"}
                />
                <ToneChip
                  label={AiActionMap.factCheck}
                  onClick={() => handleTodoClick("factCheck")}
                  variant={"outlined"}
                  disabled={noTextSelected}
                />
                <ToneChip
                  label={AiActionMap.PeerReview}
                  onClick={() => handleTodoClick("PeerReview")}
                  selected={selectedAction === "PeerReview"}
                  variant="outlined"
                  disabled={noTextSelected}
                />
              </Stack>
              <Divider />
              <Stack
                px={AiFormLayoutPaddings.pxValue}
                pt={2}
                pb={2}
                direction="row"
                flexWrap="wrap"
                gap={0.5}
              >
                <ToneChip
                  icon={<DriveFileRenameOutline fontSize="small" />}
                  label={AiActionMap.Rewrite}
                  disabled={aiOptions.fullPage || noTextSelected}
                  onClick={() => handleTodoClick("Rewrite")}
                  variant={"outlined"}
                  type="multistep"
                />
                <ToneChip
                  icon={<Chat fontSize="small" />}
                  label={AiActionMap.Chat}
                  onClick={() => handleTodoClick("Chat")}
                  variant={"outlined"}
                  type="multistep"
                />
              </Stack>
            </>
          ) : (
            <Stack
              px={AiFormLayoutPaddings.pxValue}
              py={AiFormLayoutPaddings.pyValue}
              gap={1}
            >
              {aiOptions.factCheck && factCheckMessage && (
                <Alert
                  severity={hasInaccuracies ? "warning" : "info"}
                  sx={{ whiteSpace: "pre-line" }}
                >
                  <AlertTitle>Fact Check Result</AlertTitle>
                  {factCheckMessage}
                </Alert>
              )}
              <CodeMarkdown>{aiMessage!}</CodeMarkdown>
            </Stack>
          )}
          {selectedAction && !errorMessage && (
            <Stack
              px={AiFormLayoutPaddings.pxValue}
              py={1}
              direction="row"
              gap={0.5}
            >
              <ChatActionChip
                label="Concise"
                variant="outlined"
                selected={aiOptions.keepShort}
                onClick={() => handleOptionClick("keepShort")}
              />
              <ChatActionChip
                label="Full Page"
                variant="outlined"
                selected={aiOptions.fullPage}
                onClick={() => handleOptionClick("fullPage")}
              />

              <ChatActionChip
                label="Fact Check"
                variant="outlined"
                disabled={selectedAction === "factCheck"}
                selected={aiOptions.factCheck}
                onClick={() => handleOptionClick("factCheck")}
              />
            </Stack>
          )}
        </AiFormLayout>
        <Divider />
      </StyledPopover>
    </ShadowDomPortal>
  );
}

export function AiOption({
  selected,
  ...rest
}: { selected: boolean } & ChipProps) {
  return (
    <AiOptionStyled
      selected={selected}
      size="small"
      icon={
        selected ? (
          <CheckBox fontSize="small" />
        ) : (
          <CheckBoxOutlineBlank fontSize="small" />
        )
      }
      variant="outlined"
      {...rest}
    ></AiOptionStyled>
  );
}
export const AiOptionStyled = styled(Chip)<{
  selected: boolean;
}>(({ selected, theme }) => ({
  cursor: "pointer",
  fontWeight: 500,
  borderRadius: 6,
  borderColor: theme.palette.divider,
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  ...(selected && {
    backgroundColor: "#ac90b44a",
    borderColor: "#ac90b44a",
  }),
}));

export function getFullPageText() {
  return document.body.innerText;
}

export const improvements = [
  "Improve",
  "Professional",
  "Friendly",
  "concise",
  "Clear",
  "Casual",
  "Positive",
  "Neutral",
  "Hyped",
] as const;

export type Tone = (typeof improvements)[number];

export const containsHtml = (input: string) => {
  return /<[^>]*>/.test(input);
};

const AiLabel = styled(FormControlLabel)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    borderRadius: 4,
    // border: `1px solid ${theme.palette.divider}`,
    padding: "0px 8px 0px 0px",
    margin: 0,
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.1)",
    },
    ...(selected && {
      backgroundColor: "rgba(0,0,0,0.1)",
    }),
  })
);

export const ToneChip = styled(Chip)<{
  selected?: boolean;
  type?: "multistep";
}>(({ selected, type }) => ({
  cursor: "pointer",
  fontWeight: 500,
  ...(selected && {
    backgroundColor: "#ac90b44a",
    borderColor: "#ac90b44a",
  }),
  "&:hover": {
    backgroundColor: "#ac90b44a !important",
  },
  ...(type === "multistep" && {
    borderRadius: 3,
  }),
}));
