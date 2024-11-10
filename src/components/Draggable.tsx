import { SxProps, styled } from "@mui/material";
import React, {
  PropsWithChildren,
  useState,
  useCallback,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  startTransition,
  useRef,
} from "react";
import { useUserState } from "./Providers/UserStateProvider";

const Container = styled("div")(() => ({
  position: "fixed",
  transform: "translate(-100%, -100%)",
}));

export const convertRelativeToAbsolutePosition = (
  relativeFromRight: number,
  relativeFromTop: number
) => {
  return {
    x: (window.innerWidth * relativeFromRight) / 100,
    y: (window.innerHeight * relativeFromTop) / 100,
  };
};

const draggableContext = React.createContext<{
  isDragging: boolean;
  snapped: boolean;
  snapDirection: "left" | "right" | null;
}>(null!);

export const useDraggableContext = () => {
  const context = React.useContext(draggableContext);

  if (context === null) {
    throw new Error(
      "useDraggableContext must be used within a Draggable component"
    );
  }

  return context;
};

export const Draggable = forwardRef<
  HTMLDivElement,
  {
    sx?: SxProps;
    id?: string;
    defaultPosition?: { x: number | null; y: number | null };
    className?: string;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    children: React.ReactNode | (() => React.ReactNode);
  }
>(function Draggable(
  { children, sx: inSx, id, defaultPosition, onDragEnd, onDragStart, ...props },
  ref
) {
  const { data: userState, updateData, dataSyncing } = useUserState();
  const [isDragging, setIsDragging] = useState(false);
  const [offsets, setOffsets] = useState<{
    x?: number | null;
    y?: number | null;
  }>(() => {
    return {
      ...defaultPosition,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useLayoutEffect(() => {
    if (
      !dataSyncing &&
      userState.position?.percentageFromLeft != null &&
      userState.position?.percentageFromTop != null
    ) {
      // assuming percentageFromLeft and percentageFromTop are percentage values
      const x =
        (window.innerWidth * userState.position.percentageFromLeft) / 100;
      const y =
        (window.innerHeight * userState.position.percentageFromTop) / 100;

      setOffsets({
        x: x,
        y: y,
      });
    }
  }, [dataSyncing]);

  useLayoutEffect(() => {
    // observe window resizing and update the position
    const onResize = () => {
      setOffsets((prev) => {
        const positions = convertRelativeToAbsolutePosition(
          userState.position.percentageFromLeft ?? 95,
          userState.position.percentageFromTop ?? 95
        );
        return {
          ...positions,
        };
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [
    userState.position.percentageFromLeft,
    userState.position.percentageFromTop,
  ]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!userState.buttonExpanded) {
        e.stopPropagation();
        e.preventDefault();
      }

      const startTime = Date.now();
      let x: number, y: number;
      const onMouseMove = (e: MouseEvent) => {
        if (Date.now() - startTime < 200) return;
        onDragStart?.();

        x = e.clientX;
        y = e.clientY;

        setOffsets({ x, y });
      };

      const onMouseUp = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setTimeout(() => {
          onDragEnd?.();
        }, 500);

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);

        if (x && y) {
          const { percentageFromLeft, percentageFromTop } =
            getDistancesFromRightAndTop(x, y);

          updateData({ position: { percentageFromLeft, percentageFromTop } });
        }
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [userState.buttonExpanded]
  );

  const { percentageFromLeft, percentageFromTop } = getDistancesFromRightAndTop(
    offsets.x ?? 0,
    offsets.y ?? 0
  );
  const snap = useMemo(
    () => shouldSnap(percentageFromLeft, percentageFromTop),
    [percentageFromLeft, percentageFromTop]
  );
  const snapDirection = snap ? getSnapDirection(percentageFromLeft) : null;

  const topLeftPositions = useMemo(
    () =>
      getTopLeftPosition({
        x: offsets.x,
        y: offsets.y,
        snap,
        snapDirection,
      }),
    [offsets.x, offsets.y, snap, snapDirection]
  );

  const sx: SxProps = {
    ...topLeftPositions,
    ...inSx,
  };

  const draggableContextValues = useMemo(() => {
    return {
      isDragging,
      snapped: snap,
      snapDirection,
    };
  }, [isDragging, snap, snapDirection]);

  if (dataSyncing) return null;

  return (
    <Container
      id={id}
      data-component="Draggable-Container"
      ref={ref}
      onMouseDown={onMouseDown}
      sx={sx}
      {...props}
    >
      <draggableContext.Provider value={draggableContextValues}>
        {typeof children === "function" ? children() : children}
      </draggableContext.Provider>
    </Container>
  );
});

function getDistancesFromRightAndTop(x: number, y: number) {
  return {
    percentageFromLeft: (x * 100) / window.innerWidth,
    percentageFromTop: (y * 100) / window.innerHeight,
  };
}

function getSnapDirection(percentageFromLeft: number): "left" | "right" {
  if (percentageFromLeft < 50) {
    return "left";
  } else {
    return "right";
  }
}

function getTopLeftPosition({
  x,
  y,
  snap,
  snapDirection,
}: {
  x: number | null | undefined;
  y: number | null | undefined;
  snap: boolean;
  snapDirection: "left" | "right" | null;
}) {
  if (snap) {
    return snapDirection === "left"
      ? { left: 0, top: y, transform: "none" }
      : { right: 0, top: y, transform: "none" };
  } else {
    return { left: x, top: y };
  }
}

// if the percentage number is less that 5 percent, then it should snap
export function shouldSnap(
  percentageFromLeft: number | undefined | null,
  percentageFromTop: number | undefined | null
) {
  if (percentageFromLeft == null || percentageFromTop == null) return false;

  return percentageFromLeft < 2 || percentageFromLeft > 98;
}
