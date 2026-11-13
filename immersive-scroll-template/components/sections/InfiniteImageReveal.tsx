"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { animationConfig } from "@/lib/animation-config";

gsap.registerPlugin(ScrollTrigger);

export function InfiniteImageReveal() {
  const section = useRef<HTMLElement>(null);
  const foreground = useRef<HTMLDivElement>(null);
  const background = useRef<HTMLDivElement>(null);
  const portal = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: animationConfig.scrub,
        },
      });

      timeline
        .fromTo(background.current, { scale: 1.35 }, { scale: 1, ease: "none" }, 0)
        .to(foreground.current, { scale: animationConfig.revealScale, opacity: 0, ease: "none" }, 0)
        .fromTo(
          portal.current,
          { clipPath: "inset(34% 30% 34% 30% round 20px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" },
          0.05,
        )
        .fromTo(copy.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, 0.6);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      data-scene="02"
      className="relative h-[230svh] bg-[#b9a47e] text-white"
      aria-labelledby="reveal-title"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div ref={background} className="absolute inset-0 will-change-transform">
          <Image
            src="/images/coast.jpg"
            alt="Costa rocosa cubierta por bruma oceánica"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div
          ref={portal}
          className="absolute inset-0 overflow-hidden will-change-[clip-path]"
        >
          <Image
            src="/images/coast.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div
          ref={foreground}
          className="absolute inset-0 z-10 origin-center overflow-hidden will-change-transform"
        >
          <Image
            src="/images/dunes.jpg"
            alt="Dunas del Namib vistas desde el aire"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div
          ref={copy}
          className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-6 pb-10 md:p-12 md:pb-14"
        >
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-white/70">02 — Passage</p>
            <h2 id="reveal-title" className="font-display max-w-[8ch] text-[clamp(3rem,8vw,8rem)] leading-[0.82] tracking-[-0.06em]">
              Through the surface.
            </h2>
          </div>
          <p className="hidden max-w-[25ch] text-sm leading-relaxed text-white/70 md:block">
            Scale becomes a doorway. The familiar dissolves, and a second landscape waits behind it.
          </p>
        </div>
      </div>
    </section>
  );
}
