import { Skeleton, SkeletonProps } from "@mui/material";
import { MeetingStyled } from "./Meeting";

export function MeetingSkeleton({
  top,
  height,
}: {
  top: number;
  height: number;
}) {
  return (
    <MeetingStyled
      sx={{ position: "absolute", top, height, backgroundColor: "grey.400" }}
      totalStackedEvents={1}
      reservedCount={1}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        color=""
        height={height}
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "grey.300",
        }}
      />
    </MeetingStyled>
  );
}
