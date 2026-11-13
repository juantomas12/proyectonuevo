"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { animationConfig } from "@/lib/animation-config";

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  {
    number: "01",
    title: "Some places whisper.",
    label: "Madeira / 32.7607° N",
    image: "/images/forest.jpg",
    alt: "Bosque cubierto por niebla visto desde el aire",
    color: "#182118",
  },
  {
    number: "02",
    title: "Others hold their breath.",
    label: "Alaska / 58.3019° N",
    image: "/images/glacier.jpg",
    alt: "Textura translúcida de un glaciar azul",
    color: "#10242c",
  },
  {
    number: "03",
    title: "All of them remember.",
    label: "Bern / 46.9480° N",
    image: "/images/mist.jpg",
    alt: "Bosque alpino envuelto en niebla",
    color: "#272520",
  },
];

export function StackedImages() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)": () => {
          const panels = gsap.utils.toArray<HTMLElement>("[data-stack-panel]");
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: `+=${window.innerHeight * animationConfig.sectionScroll.stacked}`,
              pin: true,
              scrub: 1,
            },
          });

          panels.slice(1).forEach((panel, index) => {
            const previous = panels[index];
            const image = panel.querySelector("img");
            const title = panel.querySelector("[data-stack-title]");
            const at = index + 0.6;
            timeline
              .fromTo(
                panel,
                { clipPath: "inset(100% 0% 0% 0%)" },
                { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 },
                at,
              )
              .fromTo(image, { scale: 1.22 }, { scale: 1, ease: "none", duration: 1 }, at)
              .to(previous, { scale: 0.92, opacity: 0.25, duration: 1 }, at)
              .fromTo(title, { yPercent: 110 }, { yPercent: 0, duration: 0.6 }, at + 0.28);
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      data-scene="04"
      className="stacked-section relative h-svh overflow-hidden bg-[#111] text-white"
      aria-label="Storytelling visual en capas"
    >
      {scenes.map((scene, index) => (
        <article
          key={scene.number}
          data-stack-panel
          className="stack-panel absolute inset-0 overflow-hidden will-change-[clip-path,transform]"
          style={{ zIndex: index + 1, backgroundColor: scene.color }}
        >
          <Image src={scene.image} alt={scene.alt} fill sizes="100vw" className="object-cover opacity-85" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.64))]" />
          <div className="absolute inset-0 flex flex-col justify-between p-6 pb-10 pt-24 md:p-12 md:pb-14 md:pt-28">
            <div className="flex justify-between text-[10px] uppercase tracking-[0.25em] text-white/65">
              <span>04 — Layered memory</span>
              <span>{scene.number} / 03</span>
            </div>
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div className="overflow-hidden">
                <h2
                  data-stack-title
                  className="font-display max-w-[11ch] text-[clamp(3.4rem,8.5vw,8.5rem)] leading-[0.82] tracking-[-0.065em]"
                >
                  {scene.title}
                </h2>
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/60">{scene.label}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
