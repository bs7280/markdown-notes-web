// Public node type returned by the tree builder
export type FileNode = {
  /** The display name (last segment) */
  name: string;
  /** Full path for linking, e.g. "tmp/foo/bar.md" */
  path: string;
  /** Optional array of child nodes (folders or files) */
  children?: FileNode[];
};

// Internal node type used during tree construction
interface InternalNode {
  name: string;
  path: string;
  childrenMap: Map<string, InternalNode>;
}

/**
 * Builds a nested file tree from a flat list of file paths.
 * Folders are represented implicitly by their path segments.
 */
export function buildFileTree(paths: string[]): FileNode[] {
  const rootMap = new Map<string, InternalNode>();

  // Step 1: Populate the map hierarchy
  for (const fullPath of paths) {
    const parts = fullPath.split("/");
    let currentMap = rootMap;
    let accumulatedPath = "";

    for (let i = 0; i < parts.length; i++) {
      const segment = parts[i];
      accumulatedPath = accumulatedPath
        ? `${accumulatedPath}/${segment}`
        : segment;

      if (!currentMap.has(segment)) {
        const node: InternalNode = {
          name: segment,
          path: accumulatedPath,
          childrenMap: new Map<string, InternalNode>(),
        };
        currentMap.set(segment, node);
      }

      const node = currentMap.get(segment)!;
      // Dive into children map for next segment
      currentMap = node.childrenMap;
    }
  }

  // Step 2: Convert the map hierarchy to FileNode[] recursively
  function mapToTree(map: Map<string, InternalNode>): FileNode[] {
    return Array.from(map.values()).map((internal) => {
      const childNodes = mapToTree(internal.childrenMap);
      const fileNode: FileNode = {
        name: internal.name,
        path: internal.path,
      };
      if (childNodes.length > 0) {
        fileNode.children = childNodes;
      }
      return fileNode;
    });
  }

  return mapToTree(rootMap);
}
