import { getNote } from "@/lib/github";
import NotePageWrapper from "./NotePageWrapper";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  // now params is a Promise, so we await it:
  const { slug } = await params;
  // normalize to an array of strings
  const slugArray = Array.isArray(slug) ? slug : [slug];
  const filename = decodeURIComponent(slugArray.join("/"));

  const { content } = await getNote(filename);
  return <NotePageWrapper filename={filename} initialContent={content} />;
}
