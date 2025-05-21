export type FileNode = {
  name: string;
  path: string; // full path, e.g. "tmp/foo/foo.md"
  children?: FileNode[];
};

export function buildFileTree(paths: string[]): FileNode[] {
  // 1. Build a nested map structure
  const rootMap: Record<string, any> = {};

  for (const fullPath of paths) {
    const parts = fullPath.split("/");
    let current = rootMap;
    let acc = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      acc = acc ? `${acc}/${part}` : part;

      if (!current[part]) {
        current[part] = { name: part, path: acc, childrenMap: {} };
      }

      // dive into childrenMap unless this is the leaf
      if (i < parts.length - 1) {
        current = current[part].childrenMap;
      }
    }
  }

  // 2. Convert maps → arrays of FileNode
  function toTree(map: Record<string, any>): FileNode[] {
    return Object.values(map).map((node: any) => {
      const children = toTree(node.childrenMap);
      return {
        name: node.name,
        path: node.path,
        ...(children.length ? { children } : {}),
      };
    });
  }

  return toTree(rootMap);
}
