"use client";

import { useState } from "react";
import ToggleMarkdown from "./ToggleMarkdown";

export default function NotePageWrapper({
  filename,
  initialContent,
}: {
  filename: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);

  return (
    <ToggleMarkdown
      filename={filename}
      content={content}
      setContent={setContent}
    />
  );
}
