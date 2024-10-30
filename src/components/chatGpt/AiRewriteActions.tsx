import {
  AutoFixHigh,
  Cancel,
  CheckBox,
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
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
import { ComponentProps, forwardRef, useEffect, useRef, useState } from "react";
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
import { AiConversation } from "./ChatGpt";

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
  { expandDirection, onOpen, handleRemoveIcon, sx, ...rest },
  ref
) {
  return (
    <Stack
      ref={ref}
      id={`${constants.EXTENSION_NAME}-ai-tooltip-buttons`}
      direction={expandDirection === "right" ? "row-reverse" : "row"}
      alignItems="center"
      sx={{
        backgroundColor: "#fff6bf",
        borderRadius: "10px",
        border: "1px solid #66625a38",
        [`&:hover`]: {
          borderRadius: "10px",
          backgroundColor: "#ffedd7",
          [` #${constants.EXTENSION_NAME}-remove-suggestion-icon`]: {
            display: "flex",
            translate: "transformX(0)",
            transition: "translate 0.2s",
          },
        },
        ...sx,
      }}
      {...rest}
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
    </Stack>
  );
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
  | "Chat";

export const AiActionMap = {
  Explain: "Explain",
  Rewrite: "Rewrite",
  Summarize: "Summarize",
  Simplify: "Simplify",
  PeerReview: "Peer Review",
  Answer: "Answer",
  Chat: "Chat",
};

export function AiSelectedText() {
  const {
    selectedText: inSelectedText,
    selectedTextPositions,
    textType,
  } = useSelectedText();
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
  const formLayoutRef = useRef<HTMLDivElement>(null);

  const selectedText = aiOptions.fullPage ? getFullPageText() : _selectedText;

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

  const handleSubmit = (todo: AiAction) => {
    resetResults({ keepSelectedAction: true });
    setLoading(true);

    const { fullPage, ...restAiOptions } = aiOptions;

    const service =
      todo === "Explain"
        ? chatGpt.explain
        : todo === "Simplify"
        ? chatGpt.simplify
        : todo === "PeerReview"
        ? chatGpt.peerReview
        : todo === "Answer"
        ? chatGpt.answer
        : chatGpt.summarize;

    let text = selectedText!;

    service({
      text,
      aiOptions,
    })
      .then((res) => {
        setAiMessage(res.message);
        if (aiOptions.factCheck) {
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
      handleSubmit(todo);
    }
  };

  const handleOptionClick = (option: keyof typeof aiOptions) => {
    setAiOptions((options) => ({ ...options, [option]: !options[option] }));
  };

  const handleClose = () => {
    resetResults();
    setOpen(false);
  };

  if (!selectedText) return null;
  if (hideAll) return null;

  const showResults = selectedAction || loading;

  return (
    <StyledPortal
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
      container={document.body}
    >
      <AiTooltipButtons
        ref={containerRef}
        sx={selectedTextPositions}
        expandDirection="right"
        onOpen={() => setOpen(true)}
        handleRemoveIcon={() => setHideAll(true)}
      />
      <StyledPopover
        open={open}
        anchorEl={containerRef.current}
        disableScrollLock
        onClose={handleClose}
        sx={{ zIndex: 1001 }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {selectedAction === "Chat" ? (
          <AiFormLayout
            ref={formLayoutRef}
            onClose={handleClose}
            title="Ai Chat"
            sx={{ height: "60vh", maxHeight: "unset" }}
          >
            <AiConversation
              sx={{ height: "100%" }}
              fullPage={aiOptions.fullPage}
              initialMessage={selectedText}
              scrollableContainer={formLayoutRef.current}
            />
          </AiFormLayout>
        ) : selectedAction === "Rewrite" ? (
          <AiReWriteForm
            input={selectedText}
            onClose={handleClose}
            onBackClick={selectedAction && resetResults}
            updateInput={() => {}}
          />
        ) : (
          <AiFormLayout
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
          >
            {!aiMessage ? (
              <>
                <Stack
                  px={AiFormLayoutPaddings.pxValue}
                  py={AiFormLayoutPaddings.pyValue}
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
                    onClick={() => handleTodoClick("Answer")}
                    selected={selectedAction === "Answer"}
                    variant={"outlined"}
                  />
                  <ToneChip
                    label={AiActionMap.Chat}
                    onClick={() => handleTodoClick("Chat")}
                    variant={"outlined"}
                  />
                </Stack>

                <Divider />
                <Stack
                  px={AiFormLayoutPaddings.pxValue}
                  py={AiFormLayoutPaddings.pyValue}
                  direction="row"
                  gap={0.5}
                >
                  <AiOption
                    label="Fact Check"
                    variant="outlined"
                    selected={aiOptions.factCheck}
                    onClick={() => handleOptionClick("factCheck")}
                  />
                  <AiOption
                    label="Full Page"
                    variant="outlined"
                    selected={aiOptions.fullPage}
                    onClick={() => handleOptionClick("fullPage")}
                  />
                  <AiOption
                    label="Keep Short"
                    variant="outlined"
                    selected={aiOptions.keepShort}
                    onClick={() => handleOptionClick("keepShort")}
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
        )}
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
}>(({ selected }) => ({
  cursor: "pointer",
  fontWeight: 500,
  borderRadius: 6,
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
    input: string;
    updateInput: (input: string) => void;
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
  }>({ factCheck: false, keepShort: false });
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [skeletonHeight, setSkeletonHeight] = useState(150);

  const { input, updateInput, onClose, onBackClick, ...rest } = props;

  useEffect(() => {
    if (contentContainerRef.current) {
      setSkeletonHeight(contentContainerRef.current.clientHeight);
    }
  }, []);

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
    // updateInput(suggestion!);
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
                  onClick={() => handleToneClick(tone)}
                  selected={selectedImprovements.includes(tone)}
                  variant={"outlined"}
                  label={tone}
                />
              ))}
            </Stack>
          </Stack>
          <Divider />
          <Stack
            px={AiFormLayoutPaddings.pxValue}
            py={AiFormLayoutPaddings.pyValue}
            direction="row"
            gap={0.5}
          >
            <AiOption
              label="Fact Check"
              variant="outlined"
              selected={aiOptions.factCheck}
              onClick={() => handleAiOptionClick("factCheck")}
            />
            <AiOption
              label="Keep Short"
              variant="outlined"
              selected={aiOptions.keepShort}
              onClick={() => handleAiOptionClick("keepShort")}
            />
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
