"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { animationConfig } from "@/lib/animation-config";

gsap.registerPlugin(ScrollTrigger);

export function CinematicTransition() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)": () => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: `+=${window.innerHeight * animationConfig.sectionScroll.cinematic}`,
              pin: true,
              scrub: 1,
            },
          });

          timeline
            .to(frame.current, { width: "100vw", height: "100svh", borderRadius: 0, ease: "none" }, 0)
            .to(intro.current, { opacity: 0, y: -30 }, 0.12)
            .to(root, { backgroundColor: "#b64f2b", ease: "none" }, 0.28)
            .fromTo(
              reveal.current,
              { clipPath: "circle(0% at 50% 50%)" },
              { clipPath: "circle(76% at 50% 50%)", ease: "none" },
              0.42,
            )
            .fromTo(
              outro.current?.querySelectorAll("[data-cinematic-line]") ?? [],
              { yPercent: 110 },
              { yPercent: 0, stagger: 0.08, duration: 0.55, ease: "power3.out" },
              0.68,
            );
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      data-scene="05"
      className="cinematic-section relative flex h-svh items-center justify-center overflow-hidden bg-[#ded9cd] text-[#171612]"
      aria-labelledby="cinematic-title"
    >
      <div ref={intro} className="absolute left-6 top-24 z-20 md:left-12 md:top-28">
        <p className="mb-3 text-[10px] uppercase tracking-[0.28em]">05 — Expansion</p>
        <p className="max-w-[18ch] text-sm leading-relaxed text-black/55">A frame is only a frame until you cross its edge.</p>
      </div>

      <div
        ref={frame}
        className="relative h-[38svh] w-[68vw] overflow-hidden rounded-[1rem] will-change-[width,height,border-radius] md:h-[42svh] md:w-[38vw]"
      >
        <Image src="/images/curve.jpg" alt="Detalle curvo de arquitectura de hormigón" fill sizes="100vw" className="object-cover" />
      </div>

      <div
        ref={reveal}
        className="absolute inset-0 z-10 overflow-hidden will-change-[clip-path]"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        <Image src="/images/coast.jpg" alt="Mar abierto visto entre acantilados" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[#10222b]/30" />
        <div ref={outro} className="absolute inset-0 flex flex-col justify-end p-6 pb-10 text-white md:p-12 md:pb-14">
          <p className="mb-6 text-[10px] uppercase tracking-[0.28em] text-white/65">The threshold is open</p>
          <h2 id="cinematic-title" className="font-display text-[clamp(4rem,12vw,12rem)] leading-[0.75] tracking-[-0.075em]">
            <span className="block overflow-hidden"><span data-cinematic-line className="block">Enter the</span></span>
            <span className="block overflow-hidden pl-[11vw]"><span data-cinematic-line className="block italic">unknown.</span></span>
          </h2>
        </div>
      </div>
    </section>
  );
}
