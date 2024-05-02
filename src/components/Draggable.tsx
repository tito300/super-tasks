import { SxProps, styled } from "@mui/material";
import React, {
  PropsWithChildren,
  useState,
  useCallback,
  forwardRef,
  useEffect,
} from "react";

const Container = styled("div")(({ theme }) => ({
  position: "fixed",
  transform: "translate(-100%, -100%)",
}));

export const Draggable = forwardRef<
  HTMLDivElement,
  {
    sx?: SxProps;
    id?: string;
    defaultPosition?: { x: number; y: number };
    className?: string;
    children: React.ReactNode | (() => React.ReactNode);
  }
>(function Draggable({ children, sx: inSx, id, defaultPosition, ...props }, ref) {
  const [offsets, setOffsets] = useState<{
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }>(() => ({
    ...defaultPosition,
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  useEffect(() => {
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
    window.onresize = onResize;

    return () => {
      window.onresize = null;
    };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const startTime = Date.now();
    const onMouseMove = (e: MouseEvent) => {
      if (Date.now() - startTime < 200) return;

      const x = e.clientX;
      const y = e.clientY;

      setOffsets({ x, y });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, []);

  const sx: SxProps = {
    left: offsets.x || 0,
    top: offsets.y || 0,
    ...inSx,
  };

  return (
    <Container id={id} ref={ref} onMouseDown={onMouseDown} sx={sx} {...props}>
      {typeof children === "function" ? children() : children}
    </Container>
  );
});
