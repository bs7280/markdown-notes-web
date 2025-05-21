import { listMarkdownFiles } from "@/lib/github";
import HomePage from "./HomePage";

export default async function Page() {
  const files = await listMarkdownFiles();
  return <HomePage files={files} />;
}
