import { getNote } from "@/lib/github";
import NotePageWrapper from "./NotePageWrapper";

export default async function Page(props: {
  params: { slug: string[] | string };
}) {
  const params = await getParams(props);

  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const filename = decodeURIComponent(slug.join("/"));
  const { content } = await getNote(filename);

  return <NotePageWrapper filename={filename} initialContent={content} />;
}

// workaround to avoid warning in streaming contexts
async function getParams(props: { params: { slug: string[] | string } }) {
  return props.params;
}
