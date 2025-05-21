// src/app/notes/[...slug]/ToggleMarkdown.tsx
"use client";

import React, { useState } from "react";
import ReactMarkdown, { Components, CodeProps } from "react-markdown";

import remarkGfm from "remark-gfm";
import Image from "next/image";

// Define modes as a literal tuple for proper typing
const MODES = ["rendered", "raw", "edit"] as const;
type Mode = (typeof MODES)[number];

type Props = {
  filename: string;
  content: string;
};

// Configure markdown rendering components
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
  h1: ({ ...props }) => (
    <h1
      className="text-4xl font-extrabold mt-8 mb-4 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  h2: ({ ...props }) => (
    <h2
      className="text-3xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  h3: ({ ...props }) => (
    <h3
      className="text-2xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  a: ({ href, ...props }) => (
    <a
      href={href}
      className="text-blue-600 hover:underline dark:text-blue-400"
      {...props}
    />
  ),
  ul: ({ ...props }) => (
    <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />
  ),
  li: ({ ...props }) => <li className="ml-4" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:border-gray-700 dark:text-gray-400 mb-4"
      {...props}
    />
  ),
  code: ({ inline, className, children, ...props }: CodeProps) => {
    if (inline) {
      return (
        <code
          className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <pre
        className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto font-mono text-sm mb-4"
        {...props}
      >
        <code className={className}>{children}</code>
      </pre>
    );
  },
  table: ({ ...props }) => (
    <table
      className="table-auto border-collapse border border-gray-300 dark:border-gray-700 mb-4"
      {...props}
    />
  ),
  th: ({ ...props }) => (
    <th className="border px-2 py-1 bg-gray-100 dark:bg-gray-800" {...props} />
  ),
  td: ({ ...props }) => <td className="border px-2 py-1" {...props} />,
  img: ({ src, alt, ...props }) => (
    <Image
      src={src!}
      alt={alt ?? ""}
      width={600}
      height={400}
      className="my-4 rounded-md"
      {...props}
    />
  ),
};

export default function ToggleMarkdown({ filename, content }: Props) {
  const [mode, setMode] = useState<Mode>("rendered");
  const [editedContent, setEditedContent] = useState(content);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function saveNote() {
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
  }

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
        <pre className="whitespace-pre-wrap font-mono bg-gray-100 dark:bg-gray-900 text-gray-800 p-4 rounded-md border overflow-x-auto max-w-full text-sm">
          {content}
        </pre>
      )}

      {mode === "edit" && (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-80 p-4 font-mono text-sm border rounded-md"
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
