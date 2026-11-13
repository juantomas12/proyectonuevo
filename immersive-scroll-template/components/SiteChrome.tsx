"use client";

import { useEffect, useState } from "react";

export function SiteChrome() {
  const [scene, setScene] = useState("01");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setScene((visible.target as HTMLElement).dataset.scene ?? "01");
      },
      { threshold: [0.25, 0.55, 0.8] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between p-5 text-[10px] font-medium uppercase tracking-[0.24em] text-white mix-blend-difference md:p-8">
      <a className="pointer-events-auto" href="#top" aria-label="Volver al inicio">
        THRESHOLD®
      </a>
      <div className="hidden items-center gap-3 md:flex">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
        Scroll study / MMXXVI
      </div>
      <span aria-live="polite">SCENE {scene} / 06</span>
    </header>
  );
}
