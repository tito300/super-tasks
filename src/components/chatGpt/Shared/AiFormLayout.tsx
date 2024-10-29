import { Divider, IconButton, PaperProps, Typography } from "@mui/material";
import { StyledPopover } from "../../shared/StyledPopover";
import { Stack } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material";
import { Paper } from "@mui/material";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { Close } from "@mui/icons-material";

type falsyValue = false | null | undefined;
export function AiFormLayout({
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
}: {
  title: string;
  onClose: () => void;
  skeletonHeight?: number;
  errorMessage?: string | null;
  loading?: boolean;
  onBackClick?: (() => void) | falsyValue; // allows for booleanCondition && function syntax
  onRetryClick?: (() => void) | falsyValue;
  buttons?: React.ReactNode;
} & PaperProps) {
  return (
    <AiModalContainer elevation={4} {...rest}>
      <Stack>
        <Stack>
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
          <AiModalContentContainer sx={{ minHeight: skeletonHeight ?? 0 }}>
            {errorMessage && (
              <Typography px={AiFormLayout.pxValue} color="error">
                {errorMessage}
              </Typography>
            )}
            {loading ? (
              <Box px={AiFormLayout.pxValue} py={AiFormLayout.pyValue}>
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
      </Stack>
    </AiModalContainer>
  );
}

AiFormLayout.pxValue = 2;
AiFormLayout.pyValue = 2;

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
      width: "375px",
      maxHeight: "450px",
      overflowY: "auto",
    } as const)
);
