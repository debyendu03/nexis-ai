'use client';

import ReactMarkdown from 'react-markdown';
import { memo } from 'react';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

function MarkdownRendererComponent({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Code blocks vs inline code
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const codeText = String(children).replace(/\n$/, '');

          if (!inline && match) {
            return <CodeBlock language={match[1]} value={codeText} />;
          }

          // Non-tagged block code fallback
          if (!inline && codeText.includes('\n')) {
            return <CodeBlock language="text" value={codeText} />;
          }

          // Inline <code>
          return (
            <code
              className="px-1.5 py-0.5 rounded-md bg-surface border border-border text-accent   text-[12px]"
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="my-3 last:mb-0 leading-relaxed">{children}</p>;
        },
        ul({ children }) {
          return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
        },
        li({ children }) {
          return <li className="text-content-primary">{children}</li>;
        },
        h1({ children }) {
          return (
            <h1 className="text-xl font-bold text-content-primary mt-4 mb-2">
              {children}
            </h1>
          );
        },
        h2({ children }) {
          return (
            <h2 className="text-lg font-semibold text-content-primary mt-3 mb-2">
              {children}
            </h2>
          );
        },
        h3({ children }) {
          return (
            <h3 className="text-base font-medium text-content-primary mt-2 mb-1">
              {children}
            </h3>
          );
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-2 border-accent pl-3 py-1 my-2 bg-surface/50 text-content-secondary italic rounded-r-lg">
              {children}
            </blockquote>
          );
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export const MarkdownRenderer = memo(MarkdownRendererComponent);