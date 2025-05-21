export type TreeNode = {
  name: string;
  fullPath: string;
  hasNote: boolean;
  children: TreeNode[];
  // internal only
  _childrenMap?: Map<string, TreeNode>;
};

export function buildDotPathTree(files: string[]): TreeNode[] {
  const rootMap = new Map<string, TreeNode>();

  for (const file of files) {
    const parts = file.replace(/\.md$/, "").split(".");
    let currentMap = rootMap;
    let fullPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      fullPath = fullPath ? `${fullPath}.${part}` : part;

      if (!currentMap.has(part)) {
        currentMap.set(part, {
          name: part,
          fullPath: fullPath + ".md",
          hasNote: false,
          children: [],
          _childrenMap: new Map<string, TreeNode>(),
        });
      }

      const node = currentMap.get(part)!;

      // If this is the full file, mark it as a note
      if (i === parts.length - 1) {
        node.hasNote = true;
      }

      // Move deeper for next part
      currentMap = node._childrenMap!;
    }
  }

  // Recursive conversion from Map to children[]
  function finalize(map: Map<string, TreeNode>): TreeNode[] {
    return Array.from(map.values()).map((node) => {
      node.children = finalize(node._childrenMap!);
      delete node._childrenMap;
      return node;
    });
  }

  return finalize(rootMap);
}
