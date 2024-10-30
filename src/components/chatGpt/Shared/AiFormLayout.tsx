import { Divider, IconButton, PaperProps, Typography } from "@mui/material";
import { StyledPopover } from "../../shared/StyledPopover";
import { Stack } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material";
import { Paper } from "@mui/material";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import React from "react";

type falsyValue = false | null | undefined;
export const AiFormLayout = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    onClose: () => void;
    skeletonHeight?: number;
    errorMessage?: string | null;
    loading?: boolean;
    onBackClick?: (() => void) | falsyValue; // allows for booleanCondition && function syntax
    onRetryClick?: (() => void) | falsyValue;
    buttons?: React.ReactNode;
  } & PaperProps
>(function _AiFormLayout(
  {
    title,
    skeletonHeight,
    errorMessage,
    loading,
    children,
    buttons,
    onBackClick,
    onRetryClick,
    onClose,
    ...rest
  },
  ref
) {
  const hasButtons = onBackClick || buttons || onRetryClick;
  return (
    <AiModalContainer ref={ref} elevation={4} {...rest}>
      <Stack height="100%">
        <Stack height="100%">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ backgroundColor: "#ecececb0" }}
          >
            <Typography
              variant="h6"
              sx={{
                textTransform: "none",
                px: (theme) => theme.spacing(2.5),
                py: (theme) => theme.spacing(1),
              }}
            >
              {title}
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Stack>
          <Divider />
          <AiModalContentContainer
            sx={{ minHeight: skeletonHeight ?? 0, height: "100%" }}
          >
            {errorMessage && (
              <Typography px={AiFormLayoutPaddings.pxValue} color="error">
                {errorMessage}
              </Typography>
            )}
            {loading ? (
              <Box
                px={AiFormLayoutPaddings.pxValue}
                py={AiFormLayoutPaddings.pyValue}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={skeletonHeight}
                />
              </Box>
            ) : (
              // prettier-ignore
              children
            )}
          </AiModalContentContainer>
        </Stack>
        {hasButtons && (
          <AiModalFooterContainer
            direction="row"
            justifyContent="flex-end"
            gap={0.5}
          >
            {onBackClick && (
              <Button
                disabled={loading}
                variant="text"
                color="primary"
                size="small"
                onClick={onBackClick}
              >
                Back
              </Button>
            )}
            {buttons}
            {onRetryClick && (
              <Button
                disabled={loading}
                variant="contained"
                size="small"
                color="info"
                onClick={onRetryClick}
              >
                Retry
              </Button>
            )}

            {/* <Button variant="outlined" size="small" onClick={onClose}>
            Close
          </Button> */}
          </AiModalFooterContainer>
        )}
      </Stack>
    </AiModalContainer>
  );
});

export const AiFormLayoutPaddings = {
  pxValue: 2,
  pyValue: 2,
};

const AiModalContentContainer = styled("div")(({ theme }) => ({}));

const AiModalFooterContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  position: "sticky",
  bottom: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const AiModalContainer = styled(Paper)(
  ({ theme }) =>
    ({
      width: "400px",
      maxHeight: "450px",
      overflowY: "auto",
      overflowX: "clip",
    } as const)
);
