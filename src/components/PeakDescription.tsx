"use client";

import { useState } from "react";

const PREVIEW_CHARS = 450;

export default function PeakDescription({
  text,
  sourceUrl,
}: {
  text: string;
  sourceUrl: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = text.split("\n").filter(Boolean);
  const collapsible = text.length > PREVIEW_CHARS;
  const collapsed = collapsible && !expanded;

  return (
    <section className="space-y-4">
      <div
        className={`space-y-4 leading-relaxed text-muted ${
          collapsed
            ? "max-h-64 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
            : ""
        }`}
      >
        {paragraphs.map((paragraph, i) =>
          // The opening paragraph reads as an editorial lead.
          i === 0 ? (
            <p key={i} className="font-serif text-2xl leading-snug text-paper">
              {paragraph}
            </p>
          ) : (
            <p key={i}>{paragraph}</p>
          ),
        )}
      </div>
      <p className="label flex flex-wrap items-center gap-x-5 gap-y-1 text-muted">
        {collapsible && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-mint underline-offset-4 hover:underline"
          >
            {expanded ? "Zwiń ↑" : "Czytaj więcej ↓"}
          </button>
        )}
        <span>
          Źródło{" "}
          <a href={sourceUrl} className="underline hover:text-paper">
            Wikipedia
          </a>{" "}
          (CC BY-SA)
        </span>
      </p>
    </section>
  );
}
