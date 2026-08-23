import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownMessageProps {
  content: string;
  className?: string;
  isUser?: boolean;
}

/**
 * Pre-processes and renders Markdown with full styling, list spacing, bolding, and links.
 * Automatically separates inline numbered/bulleted lists into clean new lines.
 */
export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  content,
  className = "",
  isUser = false,
}) => {
  if (!content) return null;

  // Pre-normalize content:
  // If the model clumped items like "include: 1. **Title**: ... 2. **Title**:" onto one line,
  // insert newlines before numbered items " 1. ", " 2. ", " • ", etc.
  const normalized = content
    .replace(/([^\n])\s+(\d+\.\s+\*\*)/g, "$1\n\n$2")
    .replace(/([^\n])\s+(\d+\.\s+[A-Z])/g, "$1\n\n$2")
    .replace(/([^\n])\s+([•\-*]\s+\*\*)/g, "$1\n\n$2")
    .replace(/([^\n])\s+([•\-*]\s+[A-Z])/g, "$1\n\n$2");

  if (isUser) {
    return <p className={`whitespace-pre-line leading-relaxed ${className}`}>{content}</p>;
  }

  return (
    <div className={`markdown-content text-slate-800 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-2.5 last:mb-0 leading-relaxed text-xs sm:text-[13px] text-slate-700">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-[#0f2820] font-sans">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-700">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2.5 pl-1 list-none">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2.5 pl-1 list-decimal list-inside text-xs sm:text-[13px] text-slate-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-snug text-xs sm:text-[13px] text-slate-700 flex items-start gap-2">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#156e52] mt-1.5" />
              <div className="flex-1">{children}</div>
            </li>
          ),
          h1: ({ children }) => (
            <h3 className="font-bold text-sm sm:text-base text-[#0f2820] mt-3 mb-1.5 font-serif">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h3 className="font-bold text-sm sm:text-base text-[#0f2820] mt-3 mb-1.5 font-serif">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="font-bold text-xs sm:text-sm text-[#0f2820] mt-2.5 mb-1 font-serif">
              {children}
            </h4>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#156e52] underline underline-offset-2 font-bold hover:text-[#0f5940] transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
