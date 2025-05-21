"use client";

import { useState, useMemo } from "react";
import { buildFileTree } from "@/lib/fileTree";
import { TreeView } from "@/components/TreeView";
import { SearchBar } from "@/components/SearchBar";

export default function HomePage({ files }: { files: string[] }) {
  const [query, setQuery] = useState("");

  // 1. Filter + sort (folders first)
  const filtered = useMemo(() => {
    const sorted = files
      .filter((f) =>
        query ? f.toLowerCase().includes(query.toLowerCase()) : true
      )
      .sort((a, b) => {
        const aFolder = a.includes("/");
        const bFolder = b.includes("/");
        if (aFolder !== bFolder) return aFolder ? -1 : 1;
        return a.localeCompare(b, undefined, { sensitivity: "base" });
      });
    return sorted;
  }, [files, query]);

  // 2. Build nested tree
  const tree = useMemo(() => buildFileTree(filtered), [filtered]);

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Obsidian Notes
      </h1>

      <SearchBar query={query} setQuery={setQuery} />

      <TreeView nodes={tree} />
    </div>
  );
}
