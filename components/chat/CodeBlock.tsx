"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden bg-code-bg border border-code-border text-lg">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-code-header-bg text-content-secondary">
        <span className="text-xs font-medium uppercase tracking-wider text-accent">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-white hover:text-content-primary hover:bg-surface px-2 py-1 rounded-lg transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-success"/>
              <span className="text-success text-xs">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5"/>
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighted Body */}
      <div className="p-1 overflow-x-auto leading-relaxed">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            background: "transparent",
          }}
          wrapLongLines={false}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
