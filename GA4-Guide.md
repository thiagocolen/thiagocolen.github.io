# GA4 Developer Guide

How Google Analytics 4 (GA4) is wired into this site, how to configure it, and how to read the per-page stats it collects.

## Table of Contents

- [How it's wired in](#how-its-wired-in)
- [Set up your GA4 property](#set-up-your-ga4-property)
- [Configure the site](#configure-the-site)
- [Verify tracking is live](#verify-tracking-is-live)
- [Reading per-page view stats](#reading-per-page-view-stats)
- [Privacy behavior](#privacy-behavior)
- [Troubleshooting](#troubleshooting)

## How it's wired in

Tracking is added via [`gatsby-plugin-google-gtag`](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag/), configured in `gatsby-config.js`. It is **opt-in and environment-gated** — no flags to remember, the build figures it out on its own:

| Build | `GA4_MEASUREMENT_ID` set? | PR preview? | Tracking |
| :--- | :---: | :---: | :---: |
| `gatsby develop` | usually not (see below) | — | off |
| `npm run build` (production, local) | yes, once configured | no | **on** |
| `npm run build` (fresh clone, no `.env.production`) | no | no | off |
| CI PR preview (`.github/workflows/pr-preview.yml`) | no | yes | off |

The relevant bit of `gatsby-config.js`:

```js
const isPreview = Boolean(pathPrefix); // true only for PR preview builds
const gaMeasurementId = process.env.GA4_MEASUREMENT_ID;

...

...(gaMeasurementId && !isPreview
  ? [{ resolve: "gatsby-plugin-google-gtag", options: { trackingIds: [gaMeasurementId], ... } }]
  : []),
```

Two things worth knowing if you're touching this file:

- **`gatsby-config.js` doesn't get `.env.*` for free.** Gatsby only auto-loads `.env.<NODE_ENV>` into the *browser bundle*, and only for `GATSBY_`-prefixed vars, via a `dotenv` call inside its own webpack config — which runs *after* `gatsby-config.js` is first evaluated. Since `GA4_MEASUREMENT_ID` is read here, in a plain Node config file, the guide's `require("dotenv").config(...)` at the top of `gatsby-config.js` is what actually puts it in `process.env` in time. No `GATSBY_` prefix is needed (and using one would leak the ID into the client bundle unnecessarily — `gatsby-plugin-google-gtag` bakes it into the rendered `<script>` tag itself).
- **PR previews are excluded on purpose.** They're throwaway builds served from `/pr-preview/pr-N/` on the same domain as production; counting them would pollute page-view stats with reviewer/bot traffic on paths that don't exist after the PR closes.

## Set up your GA4 property

1. Go to [Google Analytics](https://analytics.google.com/) and sign in with the Google account you want to own this data.
2. **Admin** (gear icon, bottom left) → **Create Property**.
   - Property name: `thiagocolen.github.io` (or similar)
   - Time zone / currency: whatever's convenient — doesn't affect tracking.
3. When asked for a platform, choose **Web**.
   - Website URL: `https://thiagocolen.github.io`
   - Stream name: anything, e.g. `Production`
4. GA4 creates a **Data Stream** and shows you a **Measurement ID** shaped like `G-XXXXXXXXXX`. That's the only value this integration needs.

You do not need to add the `gtag.js` snippet GA shows you manually — the Gatsby plugin generates and injects it.

## Configure the site

1. Copy `.env.example` if you haven't already:
   ```sh
   cp .env.example .env.production
   ```
2. Replace the placeholder with your real ID:
   ```
   GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. Build and deploy as usual:
   ```sh
   npm run deploy
   ```

`.env.production` is gitignored — the ID lives only on the machine that runs `npm run deploy` (see `README.md` → **Available Scripts**). Nothing needs to change in CI: the PR preview workflow intentionally never sees this variable.

If you ever move deploys into CI, add `GA4_MEASUREMENT_ID` as a GitHub Actions repository secret and pass it as an `env:` entry on the build step — the code already handles "unset" gracefully, so there's no other change needed.

## Verify tracking is live

**Locally, before deploying:**

```sh
npm run build
grep -c "googletagmanager" public/index.html   # should print a number > 0, not 0
```

**After deploying, in the browser:**

1. Open the live site with DevTools → Network open, filter for `collect` or `google-analytics`.
2. Navigate between pages — each navigation should fire a request to `google-analytics.com/g/collect` (or `/collect` under `googletagmanager.com`).

**In GA4 itself (best signal):**

1. **Reports → Realtime** in the GA4 UI. Open your site in another tab and click around — you should show up as an active user within a few seconds, with the page path you're on.
2. For deeper debugging, install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension and check the console for `gtag` event logs, or use GA4's **Admin → DebugView**.

If Realtime shows nothing after a minute of clicking around, see [Troubleshooting](#troubleshooting).

## Reading per-page view stats

Once data is flowing (allow 24-48h for non-Realtime reports to populate fully):

- **Reports → Engagement → Pages and screens** — the main per-page view. Shows views, active users, and average engagement time, one row per page path. Sort by **Views** to rank pages.
- **Realtime** — page-by-page activity in the last 30 minutes, useful right after publishing a new post.
- **Explore → Free form** — build a custom table/chart if you want to slice by page *and* another dimension (e.g. page path × referrer, or page path × country). Drag `Page path + query string` into rows and `Views` into values.
- To see one specific post's stats: add a filter on `Page path + query string` containing the post's slug (posts live at `/blog/post/<slug>/`).

For a lighter-weight daily glance, the GA4 mobile app (Google Analytics on iOS/Android) shows the same Realtime and Engagement data without opening a browser.

## Privacy behavior

Two settings are already on in `gatsby-config.js`, intentionally:

- `gtagConfig.anonymize_ip: true` — truncates the visitor's IP before it's used for geolocation.
- `pluginConfig.respectDNT: true` — the plugin skips loading `gtag.js` entirely for visitors with the browser **Do Not Track** header set.

GA4 still sets cookies for the visitors it does track, so if EU/UK traffic is a meaningful share of the audience, a cookie-consent mechanism (e.g. gating the plugin behind a "accept analytics" click) would be the next step — not implemented here, since there's no consent UI on the site today.

## Troubleshooting

**Realtime shows nothing.**
- Confirm `GA4_MEASUREMENT_ID` is actually the one for *this* property (Admin → Data Streams → click your stream → ID is shown at the top).
- Ad blockers and tracker blockers (uBlock Origin, Brave's shields, Firefox Enhanced Tracking Protection) block `google-analytics.com`/`googletagmanager.com` outright — test in an unblocked/incognito context, or check the Network tab for a blocked (red) request rather than assuming nothing fired.
- Do Not Track is on in your browser — see [Privacy behavior](#privacy-behavior); try a different browser/profile to confirm.

**Grep for `googletagmanager` on a fresh production build returns 0.**
- `.env.production` is missing, missing the `GA4_MEASUREMENT_ID` line, or the file wasn't saved. It's gitignored, so a fresh clone genuinely starts without it — see [Configure the site](#configure-the-site).
- You're building with `PATH_PREFIX` set (i.e. reproducing a PR preview build locally) — this is correct, not a bug; see [How it's wired in](#how-its-wired-in).

**Tracking fires on `gatsby develop`, and you don't want that.**
- Check whether `GA4_MEASUREMENT_ID` accidentally ended up in `.env.development` — it should only be in `.env.production`.
