"use client";

import Link from "next/link";
import { FileNode } from "@/lib/fileTree";

export function TreeView({ nodes }: { nodes: FileNode[] }) {
  return (
    <ul className="pl-4">
      {nodes.map((node) => {
        const isFolder = Array.isArray(node.children);
        return (
          <li key={node.path} className="mb-1">
            {isFolder ? (
              <div className="font-semibold">{node.name}/</div>
            ) : (
              <Link
                href={`/notes/${encodeURIComponent(node.path)}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {node.name}
              </Link>
            )}
            {isFolder && node.children && <TreeView nodes={node.children} />}
          </li>
        );
      })}
    </ul>
  );
}
