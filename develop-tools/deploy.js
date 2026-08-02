// Publishes the built site in public/ to the gh-pages branch.
//
//   npm run deploy              # build (see package.json) then publish
//   npm run deploy -- --no-push # dry run: commit into the local cache clone only
//
// Why this exists instead of `gh-pages -d public`: PR previews live on the same
// gh-pages branch, under pr-preview/ (see .github/workflows/pr-preview.yml). The
// gh-pages default `remove: '.'` runs `git rm -r -f .` over the whole branch
// before copying, so every production deploy would delete the previews of any
// open PR. The array form below keeps them; the CLI's --remove takes a single
// pattern, and a lone negation matches nothing, so only the library API can
// express "everything except pr-preview".
//
// Every other option stays at its default, so commits keep landing as "Updates"
// with the same dotfile handling as the rest of the branch history.

const ghpages = require("gh-pages");

const options = {
  remove: ["*", "!pr-preview"],
  push: !process.argv.includes("--no-push"),
  // gh-pages clones/pushes the target branch into its own cache dir outside
  // the checked-out working tree, so it can't see credentials actions/checkout
  // persists into this repo's local .git/config. The deploy workflow sets this
  // to a token-embedded URL to authenticate; local runs leave it unset and
  // fall back to gh-pages' normal origin auto-detection.
  ...(process.env.GH_PAGES_REPO ? { repo: process.env.GH_PAGES_REPO } : {}),
};

ghpages.publish("public", options, (error) => {
  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  console.log(
    options.push
      ? "Published public/ to gh-pages. PR previews left untouched."
      : "Dry run: committed to node_modules/.cache/gh-pages, nothing pushed."
  );
});
