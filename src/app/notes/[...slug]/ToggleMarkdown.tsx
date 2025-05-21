"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  filename: string;
  content: string;
  setContent: (val: string) => void;
};

export default function ToggleMarkdown({
  filename,
  content,
  setContent,
}: Props) {
  const [mode, setMode] = useState<"rendered" | "raw" | "edit">("rendered");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    async function convert() {
      const result = await remark().use(html).process(content);
      setHtmlContent(result.toString());
    }
    convert();
  }, [content]);

  async function saveNote() {
    setStatus("saving");
    setErrorMsg("");

    const res = await fetch("/api/edit-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, content }),
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
    <>
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-2">
        <span className="text-gray-400">
          <Link href="/" className="hover:underline text-blue-500">
            Notes
          </Link>
        </span>{" "}
        / <span className="font-semibold">{filename}</span>
      </nav>

      {/* Header with toggle buttons */}
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold">{filename}</h1>
        <div className="space-x-2">
          {["rendered", "raw", "edit"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className={`px-4 py-1 border rounded  ${
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

      {/* Content block */}
      {mode === "rendered" && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-4xl font-extrabold mt-8 mb-4 text-gray-900 dark:text-gray-100"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-3xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-2xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100"
                {...props}
              />
            ),
            p: ({ node, children, ...props }) => {
              // If the only child is a <pre> (code block), render children directly
              if (
                children.length === 1 &&
                typeof children[0] !== "string" &&
                (children[0] as ReactNode).props?.node?.tagName === "pre"
              ) {
                return <>{children}</>;
              }
              // Otherwise render as normal <p>
              return (
                <p
                  className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200"
                  {...props}
                >
                  {children}
                </p>
              );
            },
            a: ({ node, href, ...props }) => (
              <a
                href={href}
                className="text-blue-600 hover:underline dark:text-blue-400"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal list-inside mb-4 space-y-1"
                {...props}
              />
            ),
            li: ({ node, ...props }) => <li className="ml-4" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:border-gray-700 dark:text-gray-400 mb-4"
                {...props}
              />
            ),
            code({ inline, className, children, ...props }) {
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
            table: ({ node, ...props }) => (
              <table
                className="table-auto border-collapse border border-gray-300 dark:border-gray-700 mb-4"
                {...props}
              />
            ),
            th: ({ node, ...props }) => (
              <th
                className="border px-2 py-1 bg-gray-100 dark:bg-gray-800"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td className="border px-2 py-1" {...props} />
            ),
            img: ({ node, ...props }) => (
              <img className="my-4 rounded-md" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      )}

      {mode === "raw" && (
        <pre className="whitespace-pre-wrap font-mono bg-gray-100 text-gray-800 p-4 rounded-md border overflow-x-auto max-w-full text-sm">
          {content}
        </pre>
      )}

      {mode === "edit" && (
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: "100%",
              height: "400px",
              fontFamily: "monospace",
              fontSize: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginTop: "0.5rem",
            }}
          />
          <div style={{ marginTop: "1rem" }}>
            <button onClick={saveNote} disabled={status === "saving"}>
              {status === "saving" ? "Saving..." : "Save"}
            </button>
            {status === "saved" && (
              <span style={{ marginLeft: "1rem", color: "green" }}>Saved!</span>
            )}
            {status === "error" && (
              <span style={{ marginLeft: "1rem", color: "red" }}>
                {errorMsg}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
