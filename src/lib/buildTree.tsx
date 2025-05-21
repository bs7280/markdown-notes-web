type TreeNode = {
  name: string;
  path: string;
  children: TreeNode[];
  isFile: boolean;
  _childrenMap?: Map<string, TreeNode>;
};
export function buildNoteTree(paths: string[]): TreeNode[] {
  const rootMap = new Map<string, TreeNode>();

  for (const fullPath of paths) {
    const parts = fullPath.split("/");
    let currentMap = rootMap;
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isFile = i === parts.length - 1;

      if (!currentMap.has(part)) {
        currentMap.set(part, {
          name: part,
          path: currentPath,
          isFile,
          children: [],
          _childrenMap: isFile ? undefined : new Map<string, TreeNode>(),
        });
      }

      const node = currentMap.get(part)!;

      if (!isFile) {
        currentMap = node._childrenMap!;
      }
    }
  }

  function finalize(map: Map<string, TreeNode>): TreeNode[] {
    return Array.from(map.values()).map((node) => {
      if (node._childrenMap) {
        node.children = finalize(node._childrenMap);
        delete node._childrenMap;
      } else {
        node.children = [];
      }
      return node;
    });
  }

  return finalize(rootMap);
}
