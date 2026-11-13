"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    index: "I",
    title: "Monolith",
    subtitle: "Mass / Silence",
    image: "/images/monolith.jpg",
    alt: "Fachada moderna de líneas y sombras intensas",
  },
  {
    index: "II",
    title: "Soft edge",
    subtitle: "Curve / Tension",
    image: "/images/curve.jpg",
    alt: "Arquitectura curva de hormigón",
  },
  {
    index: "III",
    title: "The void",
    subtitle: "Absence / Form",
    image: "/images/void.jpg",
    alt: "Forma arquitectónica abstracta en escala de grises",
  },
  {
    index: "IV",
    title: "After rain",
    subtitle: "Water / Structure",
    image: "/images/water.jpg",
    alt: "Arquitectura minimalista reflejada en agua",
  },
  {
    index: "V",
    title: "Ascent",
    subtitle: "Rhythm / Weight",
    image: "/images/stairs.jpg",
    alt: "Escaleras geométricas de hormigón",
  },
];

export function HorizontalGallery() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    const rail = track.current;
    if (!root || !rail) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)": () => {
          const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth);
          const horizontal = gsap.to(rail, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: root,
              pin: true,
              scrub: 1,
              end: () => `+=${distance()}`,
              invalidateOnRefresh: true,
            },
          });

          gsap.utils.toArray<HTMLElement>("[data-gallery-image]").forEach((item) => {
            const image = item.querySelector("img");
            gsap.fromTo(
              image,
              { xPercent: -8 },
              {
                xPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  containerAnimation: horizontal,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          });
        },
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const images = Array.from(root.querySelectorAll("img"));
    images.forEach((image) => {
      if (!image.complete) image.addEventListener("load", refresh, { once: true });
    });

    return () => {
      images.forEach((image) => image.removeEventListener("load", refresh));
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={section}
      data-scene="03"
      className="gallery-section relative overflow-hidden bg-[#e8e4da] text-[#11110f] md:h-svh"
      aria-labelledby="gallery-title"
    >
      <div
        ref={track}
        className="gallery-track flex flex-col gap-4 px-5 py-20 md:h-full md:w-max md:flex-row md:items-center md:gap-[6vw] md:px-[8vw] md:py-0"
      >
        <div className="flex min-h-[55svh] w-full shrink-0 flex-col justify-between py-8 md:h-[76svh] md:w-[42vw] md:py-3">
          <p className="text-[10px] uppercase tracking-[0.28em]">03 — Selected fragments</p>
          <h2 id="gallery-title" className="font-display text-[clamp(4.5rem,10vw,10rem)] leading-[0.72] tracking-[-0.075em]">
            Studies<br /><span className="italic">in form.</span>
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-black/55">
            Five architectural observations. Move vertically to read the sequence horizontally.
          </p>
        </div>

        {projects.map((project, index) => (
          <article
            key={project.title}
            className={`gallery-card grid w-full shrink-0 gap-4 border-t border-black/20 pt-4 md:h-[76svh] md:w-[68vw] md:grid-cols-[1fr_auto] md:grid-rows-[1fr_auto] md:border-0 md:pt-0 ${index % 2 ? "md:-translate-y-[3vh]" : "md:translate-y-[3vh]"}`}
          >
            <div data-gallery-image className="relative min-h-[52svh] overflow-hidden bg-neutral-300 md:col-span-2 md:min-h-0">
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(min-width: 768px) 68vw, 100vw"
                className="scale-110 object-cover will-change-transform"
              />
            </div>
            <h3 className="font-display text-4xl tracking-[-0.04em] md:text-5xl">{project.title}</h3>
            <div className="text-right text-[10px] uppercase tracking-[0.24em] text-black/50">
              <span>{project.index}</span><br /><span>{project.subtitle}</span>
            </div>
          </article>
        ))}
        <div className="hidden h-px w-[5vw] shrink-0 md:block" />
      </div>
    </section>
  );
}
