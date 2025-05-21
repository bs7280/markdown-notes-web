"use client";

import ToggleMarkdown from "./ToggleMarkdown";

export default function NotePageWrapper({
  filename,
  initialContent,
}: {
  filename: string;
  initialContent: string;
}) {
  return <ToggleMarkdown filename={filename} content={initialContent} />;
}
