import { AutoFixHigh, Cancel } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
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
import { AiFormLayout } from "./Shared/AiFormLayout";
import { CodeMarkdown } from "../shared/CodeMarkdown";
import { StyledPopper } from "../shared/StyledPopper";
import { StyledPopover } from "../shared/StyledPopover";

// prevents prism from automatically highlighting code blocks on page
// @ts-expect-error
window.Prism = window.Prism || {};
// @ts-expect-error
window.Prism.manual = true;

const AiMessageTypography = styled(Typography)({
  whiteSpace: "pre-line",
});

function validRewriteInput(input: string) {
  if (!input) return false;

  // at least 3 words
  if (input.split(" ").length < 3) return false;

  return true;
}

export function AiRewriteActions() {
  const [hideIcon, setHideIcon] = useState(false);
  const [openRewriteModal, setOpenRewriteModal] = useState(false);
  const { typingInput, updateInput, container } = useUserTypingInput();
  const { selectedText } = useSelectedText();

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
  const topOffset = -27 - (parseInt(containerStyles.paddingTop) || 0);
  const rightOffset = -(parseInt(containerStyles.paddingRight) || 0);

  return (
    <>
      <StyledPopper
        open
        anchorEl={container}
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
      direction={expandDirection === "right" ? "row-reverse" : "row"}
      alignItems="center"
      sx={{
        backgroundColor: (theme) => "#fffadb",
        borderRadius: "10px",
        border: "1px solid #80808038",
        [`&:hover`]: {
          borderRadius: "10px",
          backgroundColor: (theme) => "#f1eccc",
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
  | "Ask"
  | "PeerReview";

export const AiActionMap = {
  Explain: "Explain",
  Rewrite: "Rewrite",
  Summarize: "Summarize",
  Simplify: "Simplify",
  PeerReview: "Peer Review",
  Ask: "Ask Question",
};

export function AiSelectedText() {
  const { selectedText: _selectedText, selectedTextPositions } =
    useSelectedText();
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hideAll, setHideAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AiAction | null>(null);
  const { chatGpt } = useServicesContext();
  const [selectedText, setSelectedText] = useState<string | null>(
    _selectedText
  );
  const [aiOptions, setAiOptions] = useState<{
    factCheck: boolean;
    keepShort: boolean;
  }>({ factCheck: false, keepShort: false });
  const [factCheckMessage, setFactCheckMessage] = useState<string | null>(null);
  const [hasInaccuracies, setHasInaccuracies] = useState(false);

  useEffect(() => {
    if (!open) setSelectedText(_selectedText);
  }, [_selectedText, open]);

  const resetResults = () => {
    setErrorMessage("");
    setAiMessage(null);
  };

  const handleSubmit = (todo: AiAction) => {
    resetResults();
    setLoading(true);

    const service =
      todo === "Explain"
        ? chatGpt.explain
        : todo === "Simplify"
        ? chatGpt.simplify
        : todo === "PeerReview"
        ? chatGpt.peerReview
        : chatGpt.summarize;

    service({
      text: selectedText!,
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
    if (todo === selectedAction) {
      setSelectedAction(null);
    } else {
      setSelectedAction(todo);
    }
  };

  const handleOptionClick = (option: "factCheck" | "keepShort") => {
    setAiOptions((options) => ({ ...options, [option]: !options[option] }));
  };

  const handleClose = () => {
    resetResults();
    setOpen(false);
  };

  if (!selectedText) return null;
  if (hideAll) return null;

  const showResults = !!aiMessage && selectedAction;

  return (
    <StyledPortal
      style={{ position: "absolute", top: 0, left: 0 }}
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
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {selectedAction === "Rewrite" ? (
          <AiReWriteForm
            input={selectedText}
            onClose={handleClose}
            onBackClick={selectedAction && (() => setSelectedAction(null))}
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
            buttons={
              !showResults && (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  disabled={!selectedAction}
                  onClick={() => handleSubmit(selectedAction!)}
                >
                  Run
                </Button>
              )
            }
          >
            {!aiMessage ? (
              <>
                <Stack
                  px={AiFormLayout.pxValue}
                  py={AiFormLayout.pyValue}
                  direction="row"
                  flexWrap="wrap"
                  gap={0.5}
                >
                  <ToneChip
                    label="Explain"
                    onClick={() => handleTodoClick("Explain")}
                    selected={selectedAction === "Explain"}
                    variant="outlined"
                  />
                  <ToneChip
                    label="Summarize"
                    onClick={() => handleTodoClick("Summarize")}
                    selected={selectedAction === "Summarize"}
                    variant="outlined"
                  />
                  <ToneChip
                    label="Peer Review"
                    onClick={() => handleTodoClick("PeerReview")}
                    selected={selectedAction === "PeerReview"}
                    variant="outlined"
                  />
                  <ToneChip
                    label="Simplify"
                    onClick={() => handleTodoClick("Simplify")}
                    selected={selectedAction === "Simplify"}
                    variant="outlined"
                  />
                  <ToneChip
                    label="Rewrite"
                    onClick={() => handleTodoClick("Rewrite")}
                    variant={"outlined"}
                  />
                  <ToneChip
                    label="Ask Question"
                    onClick={() => handleTodoClick("Ask")}
                    selected={selectedAction === "Ask"}
                    variant={"outlined"}
                  />
                </Stack>

                <Divider />
                <Stack
                  px={AiFormLayout.pxValue}
                  py={AiFormLayout.pyValue}
                  direction="row"
                  gap={0.5}
                >
                  <AiLabel
                    label="Fact Check"
                    selected={aiOptions.factCheck}
                    componentsProps={{
                      typography: { variant: "body2" },
                    }}
                    control={
                      <Checkbox
                        sx={{ p: 0.5, pl: 1 }}
                        size="small"
                        checked={aiOptions.factCheck}
                        onChange={() => handleOptionClick("factCheck")}
                      />
                    }
                  />
                  <AiLabel
                    label="Keep Short"
                    selected={aiOptions.keepShort}
                    componentsProps={{
                      typography: { variant: "body2" },
                    }}
                    control={
                      <Checkbox
                        sx={{ p: 0.5, pl: 1 }}
                        size="small"
                        checked={aiOptions.keepShort}
                        onChange={() => handleOptionClick("keepShort")}
                      />
                    }
                  />
                </Stack>
              </>
            ) : (
              <Stack
                px={AiFormLayout.pxValue}
                py={AiFormLayout.pyValue}
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
  const [factCheck, setFactCheck] = useState(false);
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
        checkInaccuracies: factCheck,
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
          px={AiFormLayout.pxValue}
          py={AiFormLayout.pyValue}
          ref={contentContainerRef}
          gap={1}
        >
          <>
            <CodeMarkdown>{suggestion}</CodeMarkdown>
            {factCheck && inaccuracy && (
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
            px={AiFormLayout.pxValue}
            py={AiFormLayout.pyValue}
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
            px={AiFormLayout.pxValue}
            py={AiFormLayout.pyValue}
            direction="row"
            gap={0.5}
          >
            <AiLabel
              label="Fact Check"
              selected={factCheck}
              componentsProps={{
                typography: { variant: "body2" },
              }}
              control={
                <Checkbox
                  sx={{ p: 0.5, pl: 1 }}
                  size="small"
                  checked={factCheck}
                  onChange={(_, checked) => setFactCheck(checked)}
                />
              }
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
    border: `1px solid ${theme.palette.divider}`,
    padding: "1px 8px 1px 0px",
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
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  ...(selected && {
    backgroundColor: "#ac90b44a",
    borderColor: "#ac90b44a",
  }),
}));
