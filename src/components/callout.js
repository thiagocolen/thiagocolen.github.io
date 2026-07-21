import React from "react";

// Available inside post bodies as <Callout type="note">…</Callout> — see
// wrapRootElement.js, which puts it in the MDXProvider components map.
//
// Class strings are written out in full rather than composed (`bg-${type}`):
// Tailwind's purge scans src/**/*.js as plain text, so any class it cannot see
// literally is stripped from the build.
//
// Opacity uses `bg-opacity-*`, not the `bg-accent/20` slash form. This project
// is Tailwind 2.2 with no `mode: "jit"`, and slash-opacity is JIT-only there —
// it compiles to nothing at all.
const VARIANTS = {
  note: {
    label: "NOTE",
    box: "bg-accent bg-opacity-30",
    chip: "bg-accent",
  },
  tip: {
    label: "TIP",
    box: "bg-primary bg-opacity-20",
    chip: "bg-primary",
  },
  warn: {
    label: "WARNING",
    box: "bg-amber-400 bg-opacity-20",
    chip: "bg-amber-400",
  },
};

const Callout = ({ type = "note", title, children }) => {
  // An unknown type renders as a note rather than crashing the page — a
  // Writer Agent typo shouldn't take down the whole post.
  const variant = VARIANTS[type] || VARIANTS.note;

  return (
    <aside className={`callout border-2 border-black rounded shadow-md p-5 my-8 ${variant.box}`}>
      <div
        className={`inline-block font-head text-xs tracking-wider uppercase border-2 border-black rounded px-2.5 py-1 mb-3 text-black ${variant.chip}`}
      >
        {title || variant.label}
      </div>
      <div className="callout-body font-bentham text-black">{children}</div>
    </aside>
  );
};

export default Callout;
