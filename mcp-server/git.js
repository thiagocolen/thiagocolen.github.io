// Git plumbing for the publisher tool.
//
// Everything happens inside a dedicated worktree checked out to `new-articles`,
// never the repo's main working tree. That way the agent can commit and push
// while you're mid-edit on another branch, and it can never land a commit on
// whatever you happen to have checked out.
//
// execFile (not exec) throughout: arguments are passed as an array, so a slug
// or commit message can never reach a shell.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const require = createRequire(import.meta.url);

// Where assets live is posts.js's decision; importing it keeps this file from
// becoming a second place that has to be kept in sync.
const { ASSETS_SUBPATH } = require("../develop-tools/posts.js");

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(HERE, "..");
export const WORKTREE = path.join(REPO_ROOT, ".mcp-worktree");
export const POSTS_DIR = path.join(WORKTREE, "content", "posts");
export const ASSETS_DIR = path.join(WORKTREE, ASSETS_SUBPATH);

// Everything the agent is allowed to commit, as git pathspecs (POSIX
// separators — git does not accept backslashes here even on Windows).
// An explicit allowlist, not a convenience: it is what keeps an unrelated
// dirty file in the worktree out of the agent's commits.
const PATHS = ["content/posts", ASSETS_SUBPATH.split(path.sep).join("/")];

// Hardcoded on purpose — not a parameter. This is the safety boundary: no
// workflow builds this branch, so nothing the agent pushes can reach the
// public site without a human opening a PR.
export const BRANCH = "new-articles";

const git = async (args, cwd = REPO_ROOT) => {
  const { stdout } = await run("git", args, { cwd });
  return stdout.trim();
};

const branchExists = async (ref) => {
  try {
    await git(["rev-parse", "--verify", "--quiet", ref]);
    return true;
  } catch {
    return false;
  }
};

// Which branch `new-articles` is cut from, and what its pull request targets.
//
// NOT origin/master: as of this writing master predates the MDX content
// pipeline (it still carries the SQLite-era gatsby-node.js and no
// content/posts at all), so a branch based there would hold zero existing
// posts and its PR would read as a revert. Defaulting to whatever the main
// working tree has checked out guarantees the base has the same content
// pipeline you're editing against, and it self-corrects once a release lands
// on master. Override with MCP_BASE_BRANCH when that isn't what you want.
const resolveBase = async () => {
  if (process.env.MCP_BASE_BRANCH) return process.env.MCP_BASE_BRANCH;

  const current = await git(["branch", "--show-current"]);

  // Detached HEAD gives an empty string; the branch can't be its own base.
  if (!current || current === BRANCH) return "master";

  return current;
};

// Lazily prepares the worktree and returns the posts directory to operate on.
// Safe to call on every tool invocation: each step is a no-op once satisfied.
export const ensureWorktree = async () => {
  if (!fs.existsSync(WORKTREE)) {
    if (await branchExists(BRANCH)) {
      await git(["worktree", "add", WORKTREE, BRANCH]);
    } else {
      const base = await resolveBase();

      await git(["worktree", "add", "-b", BRANCH, WORKTREE, base]);
      // Remember the base so the PR link keeps pointing at it even after you
      // switch branches in the main tree.
      await git(["config", "mcp.baseBranch", base]);
    }
  }

  // Pull only if the branch is already on the remote and fast-forwards
  // cleanly. A diverged branch is a human's problem to resolve — never
  // rebase or merge on the agent's behalf.
  try {
    await git(["pull", "--ff-only", "origin", BRANCH], WORKTREE);
  } catch {
    // No upstream yet, or it diverged. Either way, keep going: the commit
    // succeeds locally and `push` below will surface a real conflict.
  }

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  return { postsDir: POSTS_DIR, assetsDir: ASSETS_DIR };
};

export const pendingChanges = async () => {
  const status = await git(
    ["status", "--porcelain", "--", ...PATHS],
    WORKTREE
  );

  return status ? status.split("\n").map((line) => line.trim()) : [];
};

// Commits and pushes only the PATHS allowlist. The pathspec means that even if
// something else in the worktree is dirty, it stays out of the commit.
export const commitAndPush = async (message) => {
  const changes = await pendingChanges();

  if (!changes.length) {
    return { pushed: false, reason: `No changes under ${PATHS.join(", ")} to commit.` };
  }

  await git(["add", "--", ...PATHS], WORKTREE);
  await git(["commit", "-m", message, "--", ...PATHS], WORKTREE);
  await git(["push", "--set-upstream", "origin", BRANCH], WORKTREE);

  const sha = await git(["rev-parse", "--short", "HEAD"], WORKTREE);
  const remote = await git(["remote", "get-url", "origin"]);
  const repo = remote
    .replace(/^git@github\.com:/, "")
    .replace(/^https:\/\/github\.com\//, "")
    .replace(/\.git$/, "");

  let base = "master";
  try {
    base = await git(["config", "--get", "mcp.baseBranch"]);
  } catch {
    // Worktree predates the config, or it was cleared. `master` is a safe
    // fallback for a link — the PR target is editable in GitHub's UI anyway.
  }

  return {
    pushed: true,
    sha,
    branch: BRANCH,
    base,
    changes,
    compareUrl: `https://github.com/${repo}/compare/${base}...${BRANCH}?expand=1`,
  };
};
