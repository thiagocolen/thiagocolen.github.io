import React from "react";
import { navigate } from "gatsby";
import Footer from "../components/footer";
import Container from "../components/container";
import Poster from "../components/poster";
import Seo from "../components/seo";

// ProfilePage + a Person mainEntity is the schema.org shape recommended for a
// dedicated bio page — distinct from the bare Person block on the home page,
// so search engines see one canonical "about" document rather than two
// competing Person entities.
const ABOUT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Thiago Colen",
    url: "https://thiagocolen.github.io/about/",
    jobTitle: "AI Engineer",
    description:
      "AI Engineer building production agentic systems (LangGraph, Retrieval-Augmented Generation, Anthropic Claude), with a background in front-end development and web architecture.",
    knowsAbout: [
      "Agentic Systems",
      "LangGraph",
      "Retrieval-Augmented Generation",
      "Anthropic Claude",
      "TypeScript",
      "AWS",
      "Terraform",
      "Front-End Architecture",
    ],
    sameAs: [
      "https://github.com/thiagocolen",
      "https://www.linkedin.com/in/thiagocolen/",
      "https://dev.to/thiagocolen",
    ],
  },
};

const CONNECT_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/thiagocolen",
    viewBox: "0 0 496 512",
    path: "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/thiagocolen/",
    viewBox: "0 0 448 512",
    path: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z",
  },
  {
    label: "Email",
    href: "mailto:thiago.souzacolen@gmail.com",
    viewBox: "0 0 24 24",
    path: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  },
];

const KNOWS_ABOUT = [
  "Agentic Systems",
  "LangGraph",
  "Retrieval-Augmented Generation",
  "Anthropic Claude",
  "TypeScript",
  "AWS",
  "Terraform",
  "Front-End Architecture",
];

const AboutPage = () => {
  return (
    <>
      <Seo
        title="About"
        description="Thiago Colen — AI Engineer building production agentic systems (LangGraph, Retrieval-Augmented Generation, Anthropic Claude), with a background in front-end development and cloud infrastructure."
        path="/about/"
        schema={ABOUT_SCHEMA}
      />
      <Poster hideControls />
      <Container className="bg-transparent">
        <section className="max-w-3xl mx-auto w-full pt-4 pb-16">
          {/* Card doubles as a "back to home" link — nested Connect anchors
              stop propagation so they still open their own href instead of
              also navigating home. */}
          <div
            className="bg-white border-4 border-black p-6 sm:p-10 shadow-md rounded cursor-pointer"
            onClick={() => navigate("/")}
          >
            <h1 className="font-head text-2xl sm:text-3xl font-extrabold mb-2">
              Thiago Colen
            </h1>
            <p className="font-domine text-xs sm:text-sm uppercase tracking-wide font-bold text-black text-opacity-70 mb-6">
              AI Engineering, Agentic Systems (LangGraph, RAG) &amp; Anthropic Claude ·
              Software &amp; Front-End Architecture
            </p>

            <div className="font-sans text-sm sm:text-base leading-relaxed text-black space-y-4">
              <p>
                Software Engineer building production-grade agentic system, a
                cloud-native Deep Agent (LangGraph.js) grounded by a custom
                RAG pipeline.
              </p>
              <p>
                The service is deployed on AWS (Lightsail, CloudFront) via
                Terraform, and exposed through the Agent Client Protocol, a
                REST/SSE API, and a Model Context Protocol server — with a
                companion CLI (patb-cli) bridging it into the Zed IDE.
              </p>
              <p>
                That work sits on top of years as a Front-End Developer and
                Web Architect, most recently at Santander/F1rst, where I built
                proprietary front-end and UI frameworks, led Micro Front-End
                and Web Components architectures and shipped AWS-hosted (S3,
                Lambda, API Gateway) static deployment pipelines for
                large-scale applications.
              </p>
              <p>
                I&apos;m currently focused on Agentic Systems,
                Retrieval-Augmented Generation, Prompt Engineering, and
                Anthropic Claude / LLM integration.
              </p>
            </div>

            {/* Skills / knowsAbout, mirrored from the Person schema so the
                visible page and the structured data tell the same story. */}
            <div className="mt-8">
              <h2 className="font-head text-xs uppercase tracking-widest font-extrabold mb-3">
                Works With
              </h2>
              <ul className="flex flex-wrap gap-2">
                {KNOWS_ABOUT.map((skill) => (
                  <li
                    key={skill}
                    className="font-domine text-xs sm:text-sm font-bold border-2 border-black bg-accent px-3 py-1 rounded shadow-xs"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="mt-10">
              <h2 className="font-head text-xs uppercase tracking-widest font-extrabold mb-3">
                Connect
              </h2>
              <div
                className="flex flex-wrap gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                {CONNECT_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="w-12 h-12 flex items-center justify-center border-3 border-black bg-white hover:bg-black hover:text-white text-black rounded shadow-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    aria-label={link.label}
                  >
                    <svg className="w-6 h-6 fill-current" viewBox={link.viewBox}>
                      <path d={link.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Container>
      <Footer hideBio hideConnect />
    </>
  );
};

export default AboutPage;
