import { SxProps, styled } from "@mui/material";
import React, {
  PropsWithChildren,
  useState,
  useCallback,
  forwardRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { useUserState } from "./Providers/UserStateProvider";

const Container = styled("div")(() => ({
  position: "fixed",
  transform: "translate(-100%, -100%)",
}));

export const Draggable = forwardRef<
  HTMLDivElement,
  {
    sx?: SxProps;
    id?: string;
    defaultPosition?: { x: number | null; y: number | null };
    className?: string;
    children: React.ReactNode | (() => React.ReactNode);
  }
>(function Draggable(
  { children, sx: inSx, id, defaultPosition, ...props },
  ref
) {
  const [offsets, setOffsets] = useState<{
    x?: number | null;
    y?: number | null;
    width?: number;
    height?: number;
  }>(() => ({
    ...defaultPosition,
    width: window.innerWidth,
    height: window.innerHeight,
  }));
  const { data: userState, updateData, dataSyncing } = useUserState();

  useLayoutEffect(() => {
    if (
      !dataSyncing &&
      userState.position?.x != null &&
      userState.position?.y != null
    ) {
      setOffsets({
        x: userState.position.x,
        y: userState.position.y,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, [dataSyncing]);

  useLayoutEffect(() => {
    // observe window resizing and update the position
    const onResize = () => {
      setOffsets((prev) => {
        const xDiff = prev.width! - prev.x!;
        const yDiff = prev.height! - prev.y!;
        return {
          x: window.innerWidth - xDiff,
          y: window.innerHeight - yDiff,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.onresize = null;
    };
  }, []);

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

        x = e.clientX;
        y = e.clientY;

        setOffsets({ x, y });
      };

      const onMouseUp = (e: MouseEvent) => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);

        if (x && y) updateData({ position: { x, y } });
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
      {typeof children === "function" ? children() : children}
    </Container>
  );
});
