import { SxProps, styled } from "@mui/material";
import { PropsWithChildren, useState, useCallback } from "react";

const Container = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

export function Draggable({
  children,
  sx: inSx,
}: PropsWithChildren & { sx?: SxProps }) {
  const [offsets, setOffsets] = useState<{ x?: number; y?: number }>({});

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

  const sx: SxProps = offsets.x
    ? {
        left: offsets.x,
        top: offsets.y,
        bottom: "auto",
        right: "auto",
        ...inSx,
      }
    : { ...inSx };

  return (
    <Container onMouseDown={onMouseDown} sx={sx}>
      {children}
    </Container>
  );
}
