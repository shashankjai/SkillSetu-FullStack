// client/src/components/common/MarkdownRenderer.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

/**
 * Custom CodeBlock component with language badge and Copy button.
 */
const CodeBlock = ({ language, codeString }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950 font-mono text-xs shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2 text-[11px] font-semibold text-slate-400">
        <span className="uppercase tracking-wider text-sky-400">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md bg-slate-800/80 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700 hover:text-white transition"
          title="Copy code snippet"
          type="button"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-slate-200 leading-relaxed font-mono">
        <code>{codeString}</code>
      </pre>
    </div>
  );
};

/**
 * Production-Grade Markdown Renderer for AI messages & documentation.
 */
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <div className="markdown-content text-sm leading-relaxed text-slate-200 space-y-2 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white mt-4 mb-2 tracking-tight border-b border-slate-800 pb-1">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-white mt-3 mb-2 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-slate-100 mt-2 mb-1">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold text-slate-200 mt-2 mb-1">
              {children}
            </h4>
          ),

          // Paragraphs & Text Formatting
          p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-slate-300">{children}</em>,

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-2 space-y-1 text-slate-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-200">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-normal">{children}</li>,

          // Code
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (!inline && (match || codeString.includes("\n"))) {
              return (
                <CodeBlock
                  language={match ? match[1] : ""}
                  codeString={codeString}
                />
              );
            }

            return (
              <code
                className="rounded bg-slate-800/90 border border-slate-700/60 px-1.5 py-0.5 font-mono text-xs font-semibold text-sky-300"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-4 border-blue-500 bg-slate-900/60 pl-4 py-1.5 italic text-slate-300 rounded-r-lg">
              {children}
            </blockquote>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 font-semibold hover:underline hover:text-blue-300 transition"
            >
              {children}
            </a>
          ),

          // Tables
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-800/60">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-900/40 transition">{children}</tr>
          ),
          th: ({ children }) => <th className="px-3 py-2 font-bold">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 text-slate-300">{children}</td>,

          // Horizontal Rule
          hr: () => <hr className="my-4 border-slate-800" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
