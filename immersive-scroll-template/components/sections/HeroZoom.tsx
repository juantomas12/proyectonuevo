"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { animationConfig } from "@/lib/animation-config";

gsap.registerPlugin(ScrollTrigger);

export function HeroZoom() {
  const section = useRef<HTMLElement>(null);
  const imageWrap = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const meta = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", {
        yPercent: 115,
        duration: 1.25,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.12,
      });
      gsap.from(meta.current, { opacity: 0, y: 14, duration: 0.8, delay: 0.7 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: animationConfig.scrub,
        },
      });

      timeline
        .to(imageWrap.current, { scale: animationConfig.heroScale, borderRadius: 0 }, 0)
        .to(image.current, { scale: 1.08 }, 0)
        .to(title.current, { yPercent: -30, opacity: 0 }, 0)
        .to(meta.current, { y: -40, opacity: 0 }, 0.05)
        .to("[data-scroll-cue]", { opacity: 0 }, 0);
    }, root);

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer || !image.current) return;
      const x = (event.clientX / window.innerWidth - 0.5) * animationConfig.heroMouseParallax;
      const y = (event.clientY / window.innerHeight - 0.5) * animationConfig.heroMouseParallax;
      gsap.to(image.current, { x, y, duration: 1.1, ease: "power3.out" });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={section}
      id="top"
      data-scene="01"
      className="relative h-[185svh] bg-[#080808] text-[#f2efe8]"
      aria-labelledby="hero-title"
    >
      <div className="sticky top-0 h-svh overflow-hidden p-3 md:p-5">
        <div
          ref={imageWrap}
          className="absolute inset-3 overflow-hidden rounded-[1.4rem] will-change-transform md:inset-5 md:rounded-[2rem]"
        >
          <Image
            ref={image}
            src="/images/threshold.jpg"
            alt="Arquitectura de hormigón atravesada por luz dramática"
            fill
            priority
            sizes="100vw"
            className="scale-[1.03] object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.55))]" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between px-4 pb-8 pt-20 md:px-8 md:pb-10 md:pt-24">
          <div ref={meta} className="flex max-w-xs items-start gap-4 text-[10px] uppercase leading-relaxed tracking-[0.22em] text-white/75">
            <span className="mt-1 h-px w-10 shrink-0 bg-[#d9ff57]" />
            A scroll-driven study in scale, matter and perception.
          </div>

          <h1
            ref={title}
            id="hero-title"
            className="font-display max-w-[13ch] text-[clamp(4rem,13.2vw,12rem)] font-medium leading-[0.76] tracking-[-0.075em] will-change-transform"
          >
            <span className="block overflow-hidden"><span data-hero-line className="block">Beyond</span></span>
            <span className="block overflow-hidden pl-[12vw]"><span data-hero-line className="block italic">the visible.</span></span>
          </h1>

          <div className="flex items-end justify-between text-[10px] uppercase tracking-[0.22em] text-white/65">
            <span>Experimental archive No. 01</span>
            <div data-scroll-cue className="flex items-center gap-3">
              <span>Scroll to enter</span>
              <span className="relative h-9 w-px overflow-hidden bg-white/25">
                <span className="scroll-cue-line absolute inset-x-0 top-0 h-1/2 bg-white" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
