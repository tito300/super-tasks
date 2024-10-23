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

const isDraggingContext = React.createContext<boolean>(null!);

export const useIsDraggingContext = () => {
  const context = React.useContext(isDraggingContext);

  if (context === null) {
    throw new Error(
      "useIsDraggingContext must be used within a Draggable component"
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
      userState.position?.distanceFromRight != null &&
      userState.position?.distanceFromTop != null
    ) {
      // assuming distanceFromRight and distanceFromTop are percentage values
      const x =
        (window.innerWidth * userState.position.distanceFromRight) / 100;
      const y = (window.innerHeight * userState.position.distanceFromTop) / 100;

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
          userState.position.distanceFromRight ?? 95,
          userState.position.distanceFromTop ?? 95
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
    userState.position.distanceFromRight,
    userState.position.distanceFromTop,
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
          const distanceFromRight = (x * 100) / window.innerWidth;
          const distanceFromTop = (y * 100) / window.innerHeight;

          updateData({ position: { distanceFromRight, distanceFromTop } });
        }
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [userState.buttonExpanded]
  );

  const sx: SxProps = {
    left: offsets.x ?? 0,
    top: offsets.y ?? 0,
    ...inSx,
  };

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
      <isDraggingContext.Provider value={isDragging}>
        {typeof children === "function" ? children() : children}
      </isDraggingContext.Provider>
    </Container>
  );
});
