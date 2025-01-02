import React from "react";

interface CodeBlockProps {
  content: string;
}

export const CodeBlock = ({ content }: CodeBlockProps) => {
  return (
    <div className='w-full'>
      <pre className='disable-scrollbars w-full overflow-x-auto rounded-lg bg-secondary p-4 text-secondary-foreground'>
        <code
          className='block w-[400px] font-mono text-sm'
          aria-label='Code example'
        >
          {content}
        </code>
      </pre>
    </div>
  );
};
