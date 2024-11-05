import {
  AutoFixHigh,
  BorderColor,
  Cancel,
  CheckBox,
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
  DeleteForever,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  ChipProps,
  Divider,
  IconButton,
  StackProps,
  Typography,
} from "@mui/material";
import { useUserTypingInput } from "@src/hooks/useUserTypingInput";
import {
  ComponentProps,
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
import { Checkbox } from "@mui/material";
import { useSelectedText } from "@src/hooks/useSelectedText";
import { StyledPortal } from "../shared/StyledProtal";
import { AiFormLayout, AiFormLayoutPaddings } from "./Shared/AiFormLayout";
import { CodeMarkdown } from "../shared/CodeMarkdown";
import { StyledPopper } from "../shared/StyledPopper";
import { StyledPopover } from "../shared/StyledPopover";
import { AiConversation, ConversationActions } from "./ChatGpt";
import { useLogRender } from "@src/hooks/useLogRender";

// prevents prism from automatically highlighting code blocks on page
// @ts-expect-error
window.Prism = window.Prism || {};
// @ts-expect-error
window.Prism.manual = true;

const AiMessageTypography = styled(Typography)({
  whiteSpace: "pre-line",
});

function validRewriteInput(input: string) {
  // at least 3 words
  if (!input.length) return false;

  return true;
}

export function AiRewriteActions() {
  const [hideIcon, setHideIcon] = useState(false);
  const [openRewriteModal, setOpenRewriteModal] = useState(false);
  const { typingInput, updateInput, container } = useUserTypingInput();
  const { selectedText } = useSelectedText();
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = () => {
    setOpenRewriteModal(!openRewriteModal);
    setOpenRewriteModal(true);
  };

  const handleClose = () => {
    setOpenRewriteModal(false);
  };

  const handleRemoveIcon = () => {
    setHideIcon(true);
  };

  if (selectedText) return null;
  if (hideIcon) return null;
  if (!container) return null;
  if (!validRewriteInput(typingInput)) return null;

  const containerStyles = window.getComputedStyle(container);
  const topOffset = -32 - (parseInt(containerStyles.paddingTop) || 0);
  const rightOffset = -(parseInt(containerStyles.paddingRight) || 0);

  return (
    <>
      <StyledPopper
        open
        anchorEl={document.body}
        placement="top-end"
        modifiers={[
          {
            name: "offset",
            enabled: true,
            options: {
              offset: [rightOffset, topOffset],
            },
          },
        ]}
      >
        <AiTooltipButtons
          ref={tooltipRef}
          expandDirection="left"
          onOpen={handleOpenModal}
          handleRemoveIcon={handleRemoveIcon}
        />
      </StyledPopper>
      <StyledPopover
        open={openRewriteModal}
        anchorEl={container}
        disableScrollLock
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <AiReWriteForm
          input={typingInput}
          updateInput={updateInput}
          onClose={handleClose}
        />
      </StyledPopover>
    </>
  );
}

const AiTooltipButtons = forwardRef<
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
  | "factCheck";

export const AiActionMap = {
  Explain: "Explain",
  Rewrite: "Rewrite",
  Summarize: "Summarize",
  Simplify: "Simplify",
  PeerReview: "Peer Review",
  Answer: "Answer",
  Chat: "Chat",
  factCheck: "Fact Check",
};

export function AiSelectedText() {
  useLogRender("AiSelectedText");
  const { selectedText: inSelectedText, selectedTextPositions } =
    useSelectedText();
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hideAll, setHideAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AiAction | null>(null);
  const { chatGpt } = useServicesContext();
  const [_selectedText, setSelectedText] = useState<string | null>(
    inSelectedText
  );
  const [aiOptions, setAiOptions] = useState<{
    factCheck: boolean;
    keepShort: boolean;
    fullPage: boolean;
  }>({ factCheck: false, keepShort: false, fullPage: false });
  const [factCheckMessage, setFactCheckMessage] = useState<string | null>(null);
  const [hasInaccuracies, setHasInaccuracies] = useState(false);
  const [currentSelectedText, setCurrentSelectedText] = useState<string | null>(
    null
  );
  const [conversationKey, setConversationKey] = useState(0);
  const conversationActions = useRef<ConversationActions>(null);

  const selectedText = aiOptions.fullPage
    ? getFullPageText()
    : _selectedText?.trim() || null;

  useEffect(() => {
    if (!open) setSelectedText(inSelectedText);
  }, [inSelectedText, open]);

  const resetResults = ({
    keepSelectedAction,
  }: {
    keepSelectedAction?: boolean;
  } = {}) => {
    if (!keepSelectedAction) setSelectedAction(null);
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
    const text = mergedAiOptions.fullPage
      ? getFullPageText()
      : selectedText?.trim() || null;

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

    service({
      text,
      aiOptions: mergedAiOptions,
    })
      .then((res) => {
        setAiMessage(res.message);
        if (mergedAiOptions.factCheck) {
          setHasInaccuracies(res.hasInaccuracies);
          setFactCheckMessage(res.inaccuracyMessage);
        }
      })
      .catch((error) => {
        setErrorMessage("Sorry, something went wrong.");
      })
      .finally(() => setLoading(false));
  };

  const handleTodoClick = (todo: AiAction) => {
    if (selectedAction === todo) {
      setSelectedAction(null);
    } else {
      setSelectedAction(todo);

      if (todo === "Chat" || todo === "Rewrite") return;
      handleSubmit(todo);
    }
  };

  const handleClose = () => {
    resetResults();
    setOpen(false);
  };

  const handleResultChatClick = () => {
    conversationActions.current?.clearConversation();
    setSelectedAction("Chat");
    setSelectedText(aiMessage);
  };

  if (hideAll) return null;

  const showResults = selectedAction || loading;

  const handleOptionClick = (option: keyof typeof aiOptions) => {
    setAiOptions((options) => ({ ...options, [option]: !options[option] }));
    if (showResults) {
      startTransition(() => {
        handleSubmit(selectedAction!, { [option]: !aiOptions[option] });
      });
    }
  };

  return (
    <StyledPortal
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: Number.MAX_SAFE_INTEGER - 10,
        display: selectedText ? "block" : "none",
      }}
      container={document.body}
    >
      <AiTooltipButtons
        ref={containerRef}
        sx={{ ...selectedTextPositions }}
        expandDirection="right"
        onOpen={() => {
          setOpen(true);
          setCurrentSelectedText(selectedText);
        }}
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
            initialMessage={_selectedText?.trim()}
            actions={conversationActions}
            disableStoreSync
          />
        </AiFormLayout>

        <AiReWriteForm
          input={selectedText}
          keepShort={aiOptions.keepShort}
          factCheck={aiOptions.factCheck}
          onClose={handleClose}
          onBackClick={selectedAction && resetResults}
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
          loading={loading}
          onClose={handleClose}
          onRetryClick={showResults && (() => handleSubmit(selectedAction!))}
          onBackClick={showResults && resetResults}
          buttons={
            showResults && (
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
          <Stack
            px={AiFormLayoutPaddings.pxValue}
            py={1}
            direction="row"
            gap={0.5}
            borderBottom={1}
            borderColor={"divider"}
          >
            <AiOption
              label="Concise"
              variant="outlined"
              selected={aiOptions.keepShort}
              onClick={() => handleOptionClick("keepShort")}
            />
            <AiOption
              label="Full Page"
              variant="outlined"
              selected={aiOptions.fullPage}
              onClick={() => handleOptionClick("fullPage")}
            />
            <AiOption
              label="Fact Check"
              variant="outlined"
              disabled={selectedAction === "factCheck"}
              selected={aiOptions.factCheck}
              onClick={() => handleOptionClick("factCheck")}
            />
          </Stack>
          <Divider />
          {!aiMessage ? (
            <>
              <Stack
                px={AiFormLayoutPaddings.pxValue}
                pt={1}
                pb={2}
                direction="row"
                flexWrap="wrap"
                gap={0.5}
              >
                <ToneChip
                  label={AiActionMap.Rewrite}
                  disabled={aiOptions.fullPage}
                  onClick={() => handleTodoClick("Rewrite")}
                  variant={"outlined"}
                />
                <ToneChip
                  label={AiActionMap.Explain}
                  onClick={() => handleTodoClick("Explain")}
                  selected={selectedAction === "Explain"}
                  variant="outlined"
                />
                <ToneChip
                  label={AiActionMap.Summarize}
                  onClick={() => handleTodoClick("Summarize")}
                  selected={selectedAction === "Summarize"}
                  variant="outlined"
                />
                <ToneChip
                  label={AiActionMap.PeerReview}
                  onClick={() => handleTodoClick("PeerReview")}
                  selected={selectedAction === "PeerReview"}
                  variant="outlined"
                />
                <ToneChip
                  label={AiActionMap.Simplify}
                  onClick={() => handleTodoClick("Simplify")}
                  selected={selectedAction === "Simplify"}
                  variant="outlined"
                />
                <ToneChip
                  label={AiActionMap.Answer}
                  disabled={aiOptions.fullPage}
                  onClick={() => handleTodoClick("Answer")}
                  selected={selectedAction === "Answer"}
                  variant={"outlined"}
                />
                <ToneChip
                  label={AiActionMap.factCheck}
                  disabled={aiOptions.factCheck}
                  onClick={() => handleTodoClick("factCheck")}
                  variant={"outlined"}
                />
                <ToneChip
                  label={AiActionMap.Chat}
                  onClick={() => handleTodoClick("Chat")}
                  variant={"outlined"}
                />
              </Stack>
            </>
          ) : (
            <Stack
              px={AiFormLayoutPaddings.pxValue}
              py={AiFormLayoutPaddings.pyValue}
              gap={1}
            >
              <CodeMarkdown>{aiMessage!}</CodeMarkdown>
              {aiOptions.factCheck && factCheckMessage && (
                <Alert
                  severity={hasInaccuracies ? "warning" : "info"}
                  sx={{ whiteSpace: "pre-line" }}
                >
                  <AlertTitle>Fact Check Result</AlertTitle>
                  {factCheckMessage}
                </Alert>
              )}
            </Stack>
          )}
        </AiFormLayout>
        <Divider />
      </StyledPopover>
    </StyledPortal>
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
  "Improve Flow",
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

function AiReWriteForm(
  props: {
    input: string | null;
    updateInput: (input: string) => void;
    keepShort?: boolean;
    factCheck?: boolean;
  } & Omit<ComponentProps<typeof AiFormLayout>, "title">
) {
  const [selectedImprovements, setSelectedImprovements] = useState<Array<Tone>>(
    []
  );
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [inaccuracy, seInaccuracy] = useState<string | null>(null);
  const [hasInaccuracies, setHasInaccuracies] = useState(false);
  const { chatGpt } = useServicesContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiOptions, setAiOptions] = useState<{
    factCheck: boolean;
    keepShort: boolean;
  }>({
    factCheck: props.keepShort || false,
    keepShort: props.factCheck || false,
  });
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [skeletonHeight, setSkeletonHeight] = useState(150);

  const { input, updateInput, onClose, onBackClick, ...rest } = props;

  useEffect(() => {
    if (
      contentContainerRef.current &&
      contentContainerRef.current.clientHeight
    ) {
      setSkeletonHeight(contentContainerRef.current.clientHeight);
    }
  }, [props.hidden]);

  useEffect(() => {
    setAiOptions((aiOptions) => ({
      ...aiOptions,
      ...(props.keepShort !== undefined && { keepShort: props.keepShort }),
      ...(props.factCheck !== undefined && { factCheck: props.factCheck }),
    }));
  }, [props.keepShort, props.factCheck]);

  const handleSubmit = () => {
    resetResults();
    setLoading(true);
    chatGpt
      .suggestRewrite({
        improvements: selectedImprovements,
        input,
        checkInaccuracies: aiOptions.factCheck,
        keepShort: aiOptions.keepShort,
      })
      .then((res) => {
        setSuggestion(res.message);
        seInaccuracy(res.inaccuracyMessage);
        setHasInaccuracies(res.hasInaccuracies);
      })
      .catch((error) => {
        setError("Sorry, something went wrong.");
      })
      .finally(() => setLoading(false));
  };

  const handleToneClick = (tone: Tone) => {
    if (selectedImprovements.includes(tone)) {
      setSelectedImprovements((improvements) =>
        improvements.filter((t) => t !== tone)
      );
    } else {
      setSelectedImprovements((improvements) => [...improvements, tone]);
    }
  };

  function resetResults() {
    setSuggestion(null);
    seInaccuracy(null);
    setHasInaccuracies(false);
    setError(null);
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(suggestion!);
    setSuggestion(null);
    onClose();
  };

  // const html = containsHtml(input);
  const showResults = !!suggestion || loading || hasInaccuracies;
  const showBackButton = showResults || onBackClick;

  const handleBackClick = () => {
    resetResults();
    if (!showResults && onBackClick) {
      onBackClick();
    }
  };

  const handleAiOptionClick = (option: keyof typeof aiOptions) => {
    setAiOptions((options) => ({ ...options, [option]: !options[option] }));
  };

  return (
    <AiFormLayout
      title={
        showResults
          ? "Rewrite Suggestion"
          : `${constants.EXTENSION_NAME_CAPITALIZED} Rewrite`
      }
      skeletonHeight={skeletonHeight}
      errorMessage={showResults ? error : ""}
      loading={loading}
      onClose={onClose}
      onBackClick={showBackButton && handleBackClick}
      onRetryClick={showResults && handleSubmit}
      buttons={
        <>
          {showResults && suggestion && (
            <Button
              variant="contained"
              size="small"
              disabled={loading}
              onClick={handleCopyClick}
            >
              Copy Text
            </Button>
          )}
          {!showResults && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSubmit}
            >
              Run
            </Button>
          )}
        </>
      }
      {...rest}
    >
      <Stack px={AiFormLayoutPaddings.pxValue} py={1} direction="row" gap={0.5}>
        <AiOption
          label="Fact Check"
          variant="outlined"
          selected={aiOptions.factCheck}
          onClick={() => handleAiOptionClick("factCheck")}
        />
        <AiOption
          label="Short Response"
          variant="outlined"
          selected={aiOptions.keepShort}
          onClick={() => handleAiOptionClick("keepShort")}
        />
      </Stack>
      <Divider />
      {showResults ? (
        <Stack
          px={AiFormLayoutPaddings.pxValue}
          py={AiFormLayoutPaddings.pyValue}
          ref={contentContainerRef}
          gap={1}
        >
          <>
            <CodeMarkdown>{suggestion}</CodeMarkdown>
            {aiOptions.factCheck && inaccuracy && (
              <Alert
                severity={hasInaccuracies ? "warning" : "info"}
                sx={{ whiteSpace: "pre-line" }}
              >
                <AlertTitle>Fact Check Result</AlertTitle>
                {inaccuracy}
              </Alert>
            )}
          </>
        </Stack>
      ) : (
        <>
          <Stack
            px={AiFormLayoutPaddings.pxValue}
            py={AiFormLayoutPaddings.pyValue}
            ref={contentContainerRef}
            gap={1}
          >
            {/* <Typography lineHeight={1} variant="subtitle1">
          Select Improvements
        </Typography> */}
            <Stack gap={0.5} direction="row" flexWrap="wrap">
              {improvements.map((tone) => (
                <ToneChip
                  key={tone}
                  onClick={() => handleToneClick(tone)}
                  selected={selectedImprovements.includes(tone)}
                  variant={"outlined"}
                  label={tone}
                />
              ))}
            </Stack>
          </Stack>
        </>
      )}
    </AiFormLayout>
  );
}

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

const ToneChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  cursor: "pointer",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  ...(selected && {
    backgroundColor: "#ac90b44a",
    borderColor: "#ac90b44a",
  }),
}));
