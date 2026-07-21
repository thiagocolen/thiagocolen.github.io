#!/usr/bin/env node
// MCP server exposing the article lifecycle as typed tools.
//
//   node mcp-server/index.js          (stdio; started by the MCP client)
//   npx @modelcontextprotocol/inspector node mcp-server/index.js
//
// All post logic is delegated to develop-tools/posts.js — the same module the
// npm scripts use, so the CLI and the agent can never drift apart. Writes land
// on the `new-articles` branch in your working tree (see git.js), which the
// server switches to on every call.

import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { ensureBranch, commitAndPush, pendingChanges, BRANCH } from "./git.js";

// posts.js is CommonJS; createRequire is the unambiguous way to load it from ESM.
const require = createRequire(import.meta.url);
const posts = require("../develop-tools/posts.js");

const server = new McpServer({ name: "articles", version: "1.0.0" });

const slug = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Slug may contain only lowercase letters, digits and hyphens");

// Both forms are valid and render identically; the agent needs to know the
// local one exists, otherwise it has no reason to reach for add_asset.
const COVER_IMAGE_HINT =
  "Cover image: either an absolute URL (https://...) or the site-relative path returned by add_asset (/images/...)";

// Tool handlers return text; a thrown error becomes an MCP error the model can
// read and correct. Wrapping here keeps every handler free of try/catch.
const tool = (handler) => async (args) => {
  try {
    // { postsDir, assetsDir } — both under the repo root on the new-articles branch.
    const dirs = await ensureBranch();
    const result = await handler(args, dirs);

    return {
      content: [
        { type: "text", text: typeof result === "string" ? result : JSON.stringify(result, null, 2) },
      ],
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: error.message }],
    };
  }
};

server.registerTool(
  "list_posts",
  {
    title: "List posts",
    description:
      "List every article with its slug, title, status, publish date and tags. Newest published first, drafts last.",
    inputSchema: {
      status: z
        .enum(["published", "unpublished"])
        .optional()
        .describe("Filter by status. Omit for all posts."),
    },
  },
  tool(({ status }, { postsDir }) => {
    const all = posts.listPosts(postsDir);
    return status ? all.filter((p) => p.status === status) : all;
  })
);

server.registerTool(
  "read_post",
  {
    title: "Read a post",
    description: "Return one article's full frontmatter and MDX body.",
    inputSchema: { slug: slug.describe("The post's slug (its filename without .mdx)") },
  },
  tool(({ slug }, { postsDir }) => posts.readPost(postsDir, slug))
);

server.registerTool(
  "create_draft",
  {
    title: "Create a draft",
    description:
      "Create a new article as an unpublished draft. The slug is derived from the title. Fails rather than overwriting an existing post.",
    inputSchema: {
      title: z.string().min(1).describe("Article title; also the source of the slug"),
      headline: z
        .string()
        .optional()
        .describe("Subtitle/deck shown under the title on the post page"),
      description: z
        .string()
        .optional()
        .describe("Short summary shown in listings and search results, not on the post page"),
      cover_image: z.string().optional().describe(COVER_IMAGE_HINT),
      tags: z.array(z.string()).optional().describe("Topic tags, e.g. ['nodejs', 'javascript']"),
      body: z.string().optional().describe("MDX body. Omit for a placeholder."),
    },
  },
  tool((args, { postsDir }) => posts.createDraft(postsDir, args))
);

server.registerTool(
  "update_post",
  {
    title: "Update a post",
    description:
      "Update an existing article's metadata and/or body. Only the fields you pass are changed. Use publish_post to change status.",
    inputSchema: {
      slug: slug.describe("The post to update"),
      title: z.string().optional(),
      headline: z
        .string()
        .optional()
        .describe("Subtitle/deck shown under the title on the post page"),
      description: z
        .string()
        .optional()
        .describe("Short summary shown in listings and search results, not on the post page"),
      cover_image: z.string().optional().describe(COVER_IMAGE_HINT),
      tags: z.array(z.string()).optional(),
      body: z.string().optional().describe("Replacement MDX body"),
    },
  },
  tool(({ slug, ...fields }, { postsDir }) => posts.updatePost(postsDir, slug, fields))
);

server.registerTool(
  "publish_post",
  {
    title: "Publish a post",
    description:
      "Mark a draft as published and stamp published_at. A no-op if already published; never overwrites an existing publish date. This only changes the file — run stage_changes to push it.",
    inputSchema: { slug: slug.describe("The post to publish") },
  },
  tool(({ slug }, { postsDir }) => posts.publishPost(postsDir, slug))
);

server.registerTool(
  "add_asset",
  {
    title: "Add an image asset",
    description:
      "Write a base64-encoded image into the site's static assets and return the URL to reference it by. Use the returned url in a post body (<img src=\"...\">) or as cover_image. Remote images that are already hosted need no upload — pass their URL directly instead.",
    inputSchema: {
      filename: z
        .string()
        .describe("Target filename with extension, e.g. 'lenia-grid.png'. No directories."),
      content: z
        .string()
        .describe("The image bytes, base64-encoded. A full data: URI is also accepted."),
      overwrite: z
        .boolean()
        .optional()
        .describe("Replace the file if it already exists. Defaults to false."),
    },
  },
  tool((args, { assetsDir }) => posts.addAsset(assetsDir, args))
);

server.registerTool(
  "stage_changes",
  {
    title: "Stage changes for review",
    description:
      `Commit all post and asset changes and push them to the '${BRANCH}' branch. No workflow builds that branch, so nothing goes live — open a pull request from it to trigger a preview and deploy. Returns a compare URL.`,
    inputSchema: {
      message: z.string().optional().describe("Commit message. Defaults to a summary of what changed."),
    },
  },
  tool(async ({ message }) => {
    const changes = await pendingChanges();

    if (!changes.length) {
      return `Nothing to stage — no post or asset changes on ${BRANCH}.`;
    }

    return commitAndPush(message || `content: update ${changes.length} file(s)`);
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
