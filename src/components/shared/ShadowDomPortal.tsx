import React, { PropsWithChildren, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { StyledPortal } from "./StyledProtal";

export function ShadowDomPortal({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const shadowRootRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    const container = document.createElement("div");
    container.id = "axess-shadow-container";
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.zIndex = Number.MAX_SAFE_INTEGER.toString();

    shadowRootRef.current = container.attachShadow({
      mode: "open",
    });

    document.body.appendChild(container);
  }, []);

  const childrenClone = React.cloneElement(children as React.ReactElement, {});

  return (
    shadowRootRef.current && (
      <StyledPortal container={shadowRootRef.current} {...props}>
        {children}
      </StyledPortal>
    )
  );
}
