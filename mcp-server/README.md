# `articles` MCP server

An MCP server exposing the article lifecycle as typed tools, so an agent can draft,
revise and publish posts without shelling out to the npm scripts.

Configured in `.mcp.json` at the repo root:

```json
{
  "mcpServers": {
    "articles": {
      "command": "node",
      "args": ["mcp-server/index.js"]
    }
  }
}
```

Run it by hand with the inspector:

```sh
npx @modelcontextprotocol/inspector node mcp-server/index.js
```

## Tools

| Tool | What it does |
|---|---|
| `list_posts` | All articles: slug, title, headline, status, date, tags. Optional `status` filter (`published` / `unpublished`). |
| `read_post` | Full frontmatter + MDX body for one slug. |
| `create_draft` | New `.mdx` as an unpublished draft. Slug derived from the title. Fails rather than overwriting. |
| `update_post` | Patch title / headline / description / tags / cover_image / body on an existing slug. Only fields you pass change. |
| `publish_post` | Flips status to published and stamps `published_at`. No-op if already published, never rewrites an existing date. |
| `add_asset` | Writes a base64 image into `static/images/` and returns the `/images/…` URL to reference it by. Refuses to overwrite unless asked. |
| `stage_changes` | Commits posts *and* assets, pushes to the `new-articles` branch. Returns a compare URL. |

## The article shape

`headline` and `description` are different things and the tools describe them
separately, because an authoring agent will otherwise conflate them:

- **`headline`** — the deck/subtitle rendered under the `<h1>` on the post page.
- **`description`** — the listing blurb. Shown on article cards, *not* on the
  post page itself.

Rich content goes in the body as MDX. Beyond plain HTML you get:

- `<Callout type="note|tip|warn" title="OPTIONAL">…</Callout>` — see
  `src/components/callout.js`. An unrecognised `type` degrades to `note`.
- the [mdx-embed](https://www.mdx-embed.com/) shortcodes (`<YouTube>`,
  `<CodePen>`, `<Tweet>`, …), which need no import.

Both are provided by the `MDXProvider` in `src/wrapRootElement.js`, registered
from *both* `gatsby-browser.js` and `gatsby-ssr.js`. A component missing from
that map does not degrade — it fails to render.

## Images

Two options, both valid:

- **Already hosted** — pass the URL straight to `cover_image` or put it in an
  `<img>` in the body. Every imported dev.to post works this way. No upload.
- **Local** — `add_asset` writes the bytes to `static/images/` and hands back a
  `/images/…` path. Gatsby copies `static/` verbatim to the site root.

Local images are served as-is: `gatsby-plugin-sharp` / `gatsby-plugin-image` are
in `package.json` but not enabled in `gatsby-config.js`, so there is no
responsive/optimised variant pipeline to hook into. Large source files ship at
full size.

Post bodies reference local images root-relative (`/images/foo.png`), and PR
previews build under a path prefix (`/pr-preview/pr-N/`). `src/utils/assetUrl.js`
reconciles those — it is applied to every `<img>` via the MDXProvider and to
`cover_image` in `postPage.js` / `articleList.js`. Remote URLs pass through
untouched. Skipping it produces images that work locally and in production but
404 in the preview, which is the one place the post gets reviewed.

## Where the files live

The server works directly in your main working tree. On every call it switches
the tree to the `new-articles` branch (creating it if needed) and writes posts
to `content/posts/` and images to `static/images/` (see `PATHS` in `git.js` —
the commit pathspec is an explicit allowlist, so an unrelated dirty file can
never ride along). If the tree has uncommitted changes that would block the
switch, the call fails with an explanation instead of forcing it — commit or
stash first.

Two consequences worth knowing: a publishing session **leaves your working tree
on `new-articles`**, and the draft files sit there uncommitted until
`stage_changes` lands them.

The base branch for `new-articles` is inferred from whatever branch the tree was
on before the first switch (`master` if it was already on `new-articles`),
overridable with `MCP_BASE_BRANCH`. `master` is the usual answer — it holds the
content pipeline and every published post, and it is what gets deployed.

All post logic is delegated to `develop-tools/posts.js` — the same module the npm
scripts use, so the CLI and the agent can never drift apart.

## The flow

```
add_asset (optional, for local images)
     │
     ▼
create_draft ──► update_post (iterate) ──► publish_post ──► stage_changes ──► open PR
                      ▲                                          │
                      └────── read_post to inspect ──────────────┘
```

1. **Draft** — `create_draft` writes the file with `status: unpublished`. It is on
   disk on the `new-articles` branch, uncommitted. `add_asset` first if the post
   needs local images, so the returned URLs can go straight into the body.
2. **Iterate** — `read_post` / `update_post` as many times as you like. Still local,
   still uncommitted.
3. **Publish** — `publish_post` only edits frontmatter. Nothing is live yet; this is
   a file change, not a deploy.
4. **Stage** — `stage_changes` commits and pushes to `new-articles`. Deliberately, no
   CI workflow builds that branch, so pushing still does not publish anything to the web.
5. **PR** — open a pull request from the returned compare URL. That is what triggers
   the preview build. Merging it still publishes nothing: the deploy is a manual
   `npm run deploy` from `master`, run by a human.

There are three independent gates before anything goes public: `publish_post` (the
post's own status flag), the pull request, and `npm run deploy` (the actual deploy).
Steps 1–5 are all reversible; only the deploy is outward-facing.
