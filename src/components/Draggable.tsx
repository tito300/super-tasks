import { SxProps, styled } from "@mui/material";
import React, { PropsWithChildren, useState, useCallback, forwardRef } from "react";

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
    children: React.ReactNode | (() => React.ReactNode);
  }
>(function Draggable({ children, sx: inSx, id, defaultPosition }, ref) {
  const [offsets, setOffsets] = useState<{ x?: number; y?: number }>(() => ({
    ...defaultPosition,
  }));

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const onMouseMove = (e: MouseEvent) => {
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
    <Container id={id} ref={ref} onMouseDown={onMouseDown} sx={sx}>
      {typeof children === 'function' ? children() : children}
    </Container>
  );
});
