// src/app/notes/[...slug]/ToggleMarkdown.tsx
"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Explicit modes
const MODES = ["rendered", "raw", "edit"] as const;
type Mode = (typeof MODES)[number];

type Props = { filename: string; content: string };

// Markdown component overrides
const markdownComponents: Components = {
  p: ({ children, ...props }) => {
    const items = React.Children.toArray(children);
    if (
      items.length === 1 &&
      React.isValidElement(items[0]) &&
      items[0].type === "pre"
    ) {
      return <>{items}</>;
    }
    return (
      <p
        className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200"
        {...props}
      >
        {children}
      </p>
    );
  },
  h1: ({ children, ...props }) => (
    <h1
      className="text-4xl font-extrabold mt-8 mb-4 text-gray-900 dark:text-gray-100"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="text-3xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100"
      {...props}
    >
      {children}
    </h2>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:border-gray-700 dark:text-gray-400 mb-4"
      {...props}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside mb-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside mb-4 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="text-blue-600 hover:underline dark:text-blue-400"
      {...props}
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isBlock =
      typeof className === "string" && className.startsWith("language-");
    if (!isBlock) {
      return (
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono text-sm">
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto font-mono text-sm mb-4">
        <code className={className}>{children}</code>
      </pre>
    );
  },
  table: ({ children, ...props }) => (
    <table
      className="table-auto border-collapse border border-gray-300 dark:border-gray-700 mb-4"
      {...props}
    >
      {children}
    </table>
  ),
  th: ({ children, ...props }) => (
    <th className="border px-2 py-1 bg-gray-100 dark:bg-gray-800" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border px-2 py-1" {...props}>
      {children}
    </td>
  ),
};

export default function ToggleMarkdown({ filename, content }: Props) {
  const [mode, setMode] = useState<Mode>("rendered");
  const [editedContent, setEditedContent] = useState(content);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const saveNote = async () => {
    setStatus("saving");
    setErrorMsg("");
    const res = await fetch("/api/edit-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, content: editedContent }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error || "Unknown error");
    } else {
      setStatus("saved");
    }
  };

  return (
    <div>
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold">{filename}</h1>
        <div className="space-x-2">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1 border rounded ${
                mode === m
                  ? "bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
                  : "bg-transparent text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {mode === "rendered" && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      )}

      {mode === "raw" && (
        <pre
          className="
            whitespace-pre-wrap font-mono
            bg-gray-50 text-gray-900 border border-gray-300
            dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700
            p-4 rounded-md overflow-x-auto max-w-full text-sm"
        >
          {content}
        </pre>
      )}

      {mode === "edit" && (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full
              h-[80vh]            /* 80% of viewport height */
              p-4
              font-mono
              text-sm
              border rounded-md
              resize-none         /* prevent manual resize if you like */ "
          />
          <div className="mt-4">
            <button
              onClick={saveNote}
              disabled={status === "saving"}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {status === "saving" ? "Saving..." : "Save"}
            </button>
            {status === "saved" && (
              <span className="ml-4 text-green-600">Saved!</span>
            )}
            {status === "error" && (
              <span className="ml-4 text-red-600">{errorMsg}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
