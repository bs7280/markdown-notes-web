"use client";

import { useState } from "react";

type Props = {
  filename: string;
  initialContent: string;
};

export default function EditNote({ filename, initialContent }: Props) {
  const [content, setContent] = useState(initialContent);
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
      body: JSON.stringify({ filename, content }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error || "Unknown error");
    } else {
      setStatus("saved");
      setContent(content); // Update content to the latest saved version
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Edit: {filename}</h2>
      <textarea
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
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div style={{ marginTop: "1rem" }}>
        <button onClick={saveNote} disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Save"}
        </button>
        {status === "saved" && (
          <span style={{ marginLeft: "1rem", color: "green" }}>Saved!</span>
        )}
        {status === "error" && (
          <span style={{ marginLeft: "1rem", color: "red" }}>{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
