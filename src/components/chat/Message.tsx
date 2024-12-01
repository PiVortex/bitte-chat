import React, { FC, memo } from "react";

import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MarkdownTable } from "./MarkdownTable";
import { isMarkdownTableString } from "../../types/ai/utils/regex";

const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);

const LinkRenderer = ({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      href={href as string}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-300"
      {...props}
    >
      {children}
    </a>
  );
};

export const SAMessage = memo(({ content }: { content: string }) => {
  return isMarkdownTableString(content) ? (
    <MarkdownTable content={content} />
  ) : (
    <MemoizedReactMarkdown
      className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        a: LinkRenderer,
      }}
    >
      {content}
    </MemoizedReactMarkdown>
  );
});

SAMessage.displayName = "SAMessage";
