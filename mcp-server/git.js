// Git plumbing for the publisher tool.
//
// The agent works directly in the repo's main working tree: every tool call
// switches it to `new-articles`, writes there, and (on stage_changes) commits
// and pushes. There is no separate worktree. The trade-off is deliberate — a
// publishing session leaves your working tree checked out on `new-articles`,
// and files stay there uncommitted until stage_changes lands them.
//
// The safety boundary is the branch, not isolation: `new-articles` is hardcoded
// and no workflow builds it, so nothing the agent pushes reaches the public
// site without a human opening a PR. If switching branches isn't possible
// (uncommitted changes git would clobber), the switch fails loudly and the
// reason is handed back to the agent rather than forced through.
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
export const POSTS_DIR = path.join(REPO_ROOT, "content", "posts");
export const ASSETS_DIR = path.join(REPO_ROOT, ASSETS_SUBPATH);

// Everything the agent is allowed to commit, as git pathspecs (POSIX
// separators — git does not accept backslashes here even on Windows).
// An explicit allowlist, not a convenience: it is what keeps an unrelated
// dirty file in the working tree out of the agent's commits.
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

const currentBranch = () => git(["branch", "--show-current"]);

// Which branch `new-articles` is cut from, and what its pull request targets.
//
// Normally `master`: it carries the MDX content pipeline and every published
// post, and it is what `npm run deploy` ships. Rather than hardcoding it, we
// default to whatever the working tree had checked out before we switched —
// that guarantees the base has the same content pipeline you're editing
// against even when you're working off a release branch, and it falls back to
// master below. Override with MCP_BASE_BRANCH when that isn't what you want.
const resolveBase = (previous) => {
  if (process.env.MCP_BASE_BRANCH) return process.env.MCP_BASE_BRANCH;

  // Detached HEAD gives an empty string; the branch can't be its own base.
  if (!previous || previous === BRANCH) return "master";

  return previous;
};

// git switch, but a refusal (uncommitted changes it would overwrite) becomes a
// clear, actionable message instead of a raw non-zero exit. The tool() wrapper
// in index.js turns a thrown error into MCP error text the agent reads back.
const switchBranch = async (args) => {
  try {
    await git(["switch", ...args]);
  } catch (error) {
    const detail = (error.stderr || error.message || "").trim();
    throw new Error(
      `Cannot switch to '${BRANCH}': ${detail}\n` +
        "Commit or stash the changes in your working tree, then try again."
    );
  }
};

// Puts the main working tree on `new-articles` and returns the directories the
// post tools write into. Safe to call on every tool invocation: once we are
// already on the branch it is a no-op beyond ensuring the directories exist.
export const ensureBranch = async () => {
  const previous = await currentBranch();

  if (previous !== BRANCH) {
    if (await branchExists(BRANCH)) {
      await switchBranch([BRANCH]);
    } else if (await branchExists(`origin/${BRANCH}`)) {
      // Only on the remote — create a local tracking branch from it.
      await switchBranch(["-c", BRANCH, `origin/${BRANCH}`]);
    } else {
      // Brand new — cut it from the base and remember the base so the PR link
      // keeps pointing at it even after you switch branches later.
      const base = resolveBase(previous);
      await switchBranch(["-c", BRANCH, base]);
      await git(["config", "mcp.baseBranch", base]);
    }
  }

  // Pull only if the branch is already on the remote and fast-forwards
  // cleanly. A diverged branch is a human's problem to resolve — never
  // rebase or merge on the agent's behalf.
  try {
    await git(["pull", "--ff-only", "origin", BRANCH]);
  } catch {
    // No upstream yet, or it diverged. Either way, keep going: the commit
    // succeeds locally and `push` below will surface a real conflict.
  }

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  return { postsDir: POSTS_DIR, assetsDir: ASSETS_DIR };
};

export const pendingChanges = async () => {
  const status = await git(["status", "--porcelain", "--", ...PATHS]);

  return status ? status.split("\n").map((line) => line.trim()) : [];
};

// Commits and pushes only the PATHS allowlist. The pathspec means that even if
// something else in the working tree is dirty, it stays out of the commit.
export const commitAndPush = async (message) => {
  const changes = await pendingChanges();

  if (!changes.length) {
    return { pushed: false, reason: `No changes under ${PATHS.join(", ")} to commit.` };
  }

  await git(["add", "--", ...PATHS]);
  await git(["commit", "-m", message, "--", ...PATHS]);
  await git(["push", "--set-upstream", "origin", BRANCH]);

  const sha = await git(["rev-parse", "--short", "HEAD"]);
  const remote = await git(["remote", "get-url", "origin"]);
  const repo = remote
    .replace(/^git@github\.com:/, "")
    .replace(/^https:\/\/github\.com\//, "")
    .replace(/\.git$/, "");

  let base = "master";
  try {
    base = await git(["config", "--get", "mcp.baseBranch"]);
  } catch {
    // Branch predates the config, or it was cleared. `master` is a safe
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
