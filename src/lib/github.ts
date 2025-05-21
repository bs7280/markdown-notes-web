import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const mainBranch = process.env.GITHUB_BRANCH!;

export async function listMarkdownFiles(): Promise<string[]> {
  // Step 1: get the SHA of the latest commit on the main branch
  const {
    data: { commit },
  } = await octokit.repos.getBranch({
    owner,
    repo,
    branch: mainBranch,
  });

  const treeSha = commit.commit.tree.sha;

  // Step 2: get the full recursive tree
  const { data: treeData } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: treeSha,
    recursive: true,
  });

  // Step 3: filter for .md files only
  const mdFiles = treeData.tree
    .filter((item) => item.type === "blob" && item.path?.endsWith(".md"))
    .map((item) => item.path!); // full relative paths like "project/foo.md"
  return mdFiles;
}

export async function getNote(filename: string) {
  const res = await octokit.repos.getContent({
    owner,
    repo,
    path: filename, // e.g., "movies.md"
    ref: mainBranch,
  });

  const content = Buffer.from((res.data as any).content, "base64").toString(
    "utf8"
  );
  return { content };
}

export async function editNote(filename: string, newContent: string) {
  // Step 1: Get latest commit SHA of main branch
  const {
    data: { commit },
  } = await octokit.repos.getBranch({ owner, repo, branch: mainBranch });
  const baseSha = commit.sha;
  const treeSha = commit.commit.tree.sha;

  // Step 2: Create blob with new content
  const { data: blob } = await octokit.git.createBlob({
    owner,
    repo,
    content: newContent,
    encoding: "utf-8",
  });

  // Step 3: Create new tree
  const { data: newTree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: treeSha,
    tree: [
      {
        path: filename,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      },
    ],
  });

  // Step 4: Create commit on temp branch
  const branchName = `edit-${Date.now()}`;
  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });

  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo,
    message: `Edit note: ${filename}`,
    tree: newTree.sha,
    parents: [baseSha],
  });

  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branchName}`,
    sha: newCommit.sha,
    force: true,
  });

  // Step 5: Optionally merge into main (currently commented out)
  await octokit.repos.merge({
    owner,
    repo,
    base: mainBranch,
    head: branchName,
    commit_message: `Merge edited note: ${filename}`,
  });

  // Step 6: Delete temp branch
  await octokit.git.deleteRef({
    owner,
    repo,
    ref: `heads/${branchName}`,
  });

  return { branch: branchName, commit: newCommit.sha };
}
