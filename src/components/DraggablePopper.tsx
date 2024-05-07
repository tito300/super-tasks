import { Popper, PopperProps } from "@mui/material";
import { useRef, useState, useEffect, ComponentProps } from "react";
import { Draggable } from "./Draggable";

export function DraggablePopper({
  popperProps,
  popperChildren,
  children,
  ...props
}: {
  popperChildren: React.ReactNode;
  popperProps: PopperProps;
  children: React.ReactNode;
} & ComponentProps<typeof Draggable>) {
  const draggableRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    console.log("mounted DraggablePopper");
  }, []);

  useEffect(() => {
    if (draggableRef.current) {
      setAnchorEl(draggableRef.current);
    }
  }, []);

  return (
    <Draggable ref={draggableRef} {...props}>
      {() => (
        <>
          <Popper anchorEl={anchorEl} {...popperProps}>
            {popperChildren}
          </Popper>
          {children}
        </>
      )}
    </Draggable>
  );
}
