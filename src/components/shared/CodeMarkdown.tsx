import { backdropClasses, styled } from "@mui/material";
import { ComponentProps } from "react";
import _Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

// prevents prism from automatically highlighting code blocks on page
// @ts-expect-error
window.Prism = window.Prism || {};
// @ts-expect-error
window.Prism.manual = true;

export const documentFontSize = parseFloat(
  window.getComputedStyle(document.body).fontSize
);

const Markdown = styled(_Markdown)(({ theme }) => ({
  p: {
    margin: "8px 0",
    whiteSpace: "break-spaces",
    ...(documentFontSize < 16 && { fontSize: "14px" }),
  },
  "ol, ul": {
    paddingLeft: 14,
  },
  blockquote: {
    borderLeft: `4px solid ${theme.palette.divider}`,
    paddingLeft: "16px",
    paddingTop: "6px",
    paddingBottom: "6px",
    margin: "16px 0",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: "#f3f3f3",
  },
  "blockquote p": {
    color: theme.palette.text.disabled,
  },
}));

export function CodeMarkdown({
  children,
}: {
  children: ComponentProps<typeof Markdown>["children"];
}) {
  return (
    <Markdown
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              // @ts-expect-error
              style={{
                ...tomorrow,
                'pre[class*="language-"]': {
                  ...tomorrow['pre[class*="language-"]'],
                  width: 290,
                },
              }}
              language={match[1]}
              PreTag="div"
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
}
