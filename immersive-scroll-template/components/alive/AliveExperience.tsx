"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { SmoothScrollProvider } from "@/components/animations/SmoothScrollProvider";
import { StackedImages } from "@/components/sections/StackedImages";
import { CustomCursor } from "./CustomCursor";
import { InteractiveFace2D } from "./InteractiveFace2D";
import { ReactiveScene } from "./ReactiveScene";
import { WebcamController } from "./WebcamController";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  ["01", "Gaze", "Pointer and head position become a shared direction."],
  ["02", "Presence", "The scene notices proximity without pretending to know identity."],
  ["03", "Matter", "Light, particles and surfaces respond with physical inertia."],
  ["04", "Memory", "Every scroll gesture can be reversed, revisited and felt again."],
];

function AliveHorizontal() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    const rail = track.current;
    if (!root || !rail) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)": () => {
          const distance = () => rail.scrollWidth - window.innerWidth;
          gsap.to(rail, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: { trigger: root, pin: true, scrub: 1, end: () => `+=${distance()}`, invalidateOnRefresh: true },
          });
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="overflow-hidden bg-[#e8ffea] text-[#09110d] md:h-svh">
      <div ref={track} className="flex flex-col gap-4 px-5 py-20 md:h-full md:w-max md:flex-row md:items-center md:gap-8 md:px-[8vw] md:py-0">
        <div className="flex min-h-[60svh] w-full shrink-0 flex-col justify-between md:h-[70svh] md:w-[45vw]">
          <p className="text-[10px] uppercase tracking-[0.25em]">04 / Interaction grammar</p>
          <h2 className="font-display text-[clamp(4rem,9vw,9rem)] leading-[0.78] tracking-[-0.07em]">Every input<br /><i>has meaning.</i></h2>
          <p className="max-w-xs text-sm leading-relaxed text-black/55">Not more effects. Better relationships between gesture, feedback and atmosphere.</p>
        </div>
        {capabilities.map(([number, title, copy], index) => (
          <article key={number} className="group relative flex min-h-[58svh] w-full shrink-0 flex-col justify-between overflow-hidden border border-black/20 p-7 md:h-[70svh] md:w-[42vw] md:p-10">
            <div className="absolute inset-0 origin-bottom scale-y-0 bg-[#0d1b16] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
            <div className="relative z-10 flex justify-between text-[10px] uppercase tracking-[0.22em] group-hover:text-white/60"><span>{number}</span><span>Input / Output</span></div>
            <div className="relative z-10 transition-colors group-hover:text-white">
              <span className="mb-8 block font-display text-8xl font-light text-black/10 group-hover:text-cyan-300/20">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-6xl tracking-[-0.05em]">{title}</h3>
              <p className="mt-5 max-w-[28ch] text-sm leading-relaxed text-black/55 group-hover:text-white/55">{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AliveExperience() {
  const root = useRef<HTMLDivElement>(null);
  const zoomSection = useRef<HTMLElement>(null);
  const zoomFrame = useRef<HTMLDivElement>(null);
  const zoomBack = useRef<HTMLDivElement>(null);
  const [faceLook, setFaceLook] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-alive-word]", { yPercent: 110, duration: 1.1, stagger: 0.08, ease: "power4.out" });
      gsap.from("[data-alive-meta]", { opacity: 0, y: 18, duration: 0.8, delay: 0.6 });

      gsap.timeline({
        scrollTrigger: { trigger: zoomSection.current, start: "top top", end: "bottom bottom", scrub: 1 },
      })
        .fromTo(zoomFrame.current, { width: "34vw", height: "42svh", borderRadius: 28 }, { width: "100vw", height: "100svh", borderRadius: 0, ease: "none" }, 0)
        .fromTo(zoomBack.current, { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, ease: "none" }, 0.35)
        .to(zoomFrame.current, { scale: 3.2, opacity: 0, ease: "none" }, 0.55);
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <SmoothScrollProvider>
      <div ref={root} className="bg-[#050708] text-white">
        <CustomCursor />
        <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between p-5 text-[10px] uppercase tracking-[0.22em] mix-blend-difference md:p-8">
          <Link href="/alive">ALIVE® / 02</Link>
          <div className="flex items-center gap-5 md:gap-8">
            <Link href="/">Study 01</Link>
            <Link href="/playground">Playground ↗</Link>
          </div>
        </nav>

        <main>
          <section className="relative min-h-[125svh] overflow-hidden px-5 pb-20 pt-24 md:px-10 md:pt-28">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,229,255,.12),transparent_38%)]" />
            <div className="relative z-10 mx-auto grid max-w-[1550px] items-center gap-4 md:grid-cols-[1fr_minmax(360px,520px)_1fr]">
              <div className="relative z-20 self-start pt-[8svh]">
                <p data-alive-meta className="mb-6 text-[10px] uppercase leading-relaxed tracking-[0.25em] text-white/45">Human input<br />Machine response</p>
                <div className="overflow-hidden"><h1 data-alive-word className="font-display text-[clamp(5rem,11vw,11rem)] leading-[0.73] tracking-[-0.08em]">It sees</h1></div>
              </div>

              <InteractiveFace2D sensitivity={1} externalLook={faceLook} />

              <div className="relative z-20 self-end pb-[8svh] text-right">
                <div className="overflow-hidden"><p data-alive-word className="font-display text-[clamp(5rem,11vw,11rem)] italic leading-[0.73] tracking-[-0.08em]">you move.</p></div>
                <p data-alive-meta className="ml-auto mt-7 max-w-[26ch] text-sm leading-relaxed text-white/45">Move the cursor. Click the portrait. Or let your head become the controller.</p>
                <div className="mt-6 flex justify-end"><WebcamController onLook={setFaceLook} /></div>
              </div>
            </div>
            <div className="absolute bottom-7 left-5 right-5 flex justify-between border-t border-white/15 pt-4 text-[9px] uppercase tracking-[0.22em] text-white/35 md:left-10 md:right-10">
              <span>02D portrait mode</span><span>Click / blink</span><span>Scroll / descend</span>
            </div>
          </section>

          <section ref={zoomSection} className="relative h-[220svh] bg-[#d6d2c6] text-black">
            <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
              <div ref={zoomBack} className="absolute inset-0 opacity-0">
                <Image src="/images/glacier.jpg" alt="Textura de hielo azul" fill sizes="100vw" className="object-cover" />
                <div className="absolute inset-0 bg-cyan-950/25" />
                <p className="absolute bottom-8 left-6 max-w-[15ch] font-display text-[clamp(3rem,7vw,7rem)] leading-[0.82] tracking-[-0.06em] text-white md:left-10">The surface remembers.</p>
              </div>
              <div ref={zoomFrame} className="relative z-10 overflow-hidden bg-black will-change-[width,height,transform]">
                <Image src="/images/demo-face.png" alt="Retrato de demostración ampliándose con el scroll" fill sizes="100vw" className="object-cover" />
              </div>
              <p className="absolute left-5 top-24 z-20 text-[10px] uppercase tracking-[0.25em] md:left-10">02 / Cross the image</p>
            </div>
          </section>

          <section className="relative h-[185svh] bg-[#071014]">
            <div className="sticky top-0 h-svh overflow-hidden">
              <ReactiveScene externalLook={faceLook} className="absolute inset-0" />
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 pt-24 md:p-10 md:pt-28">
                <div>
                  <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-cyan-200/60">03 / Real-time WebGL entity</p>
                  <h2 className="font-display max-w-[9ch] text-[clamp(4rem,9vw,9rem)] leading-[0.78] tracking-[-0.07em]">A presence,<br /><i>not a picture.</i></h2>
                </div>
                <div className="flex items-end justify-between">
                  <p className="max-w-[30ch] text-sm leading-relaxed text-white/45">Procedural geometry. Real lights. Shader-driven atmosphere. Cursor or face position steers the same character rig.</p>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-white/35">Click the entity / reaction</span>
                </div>
              </div>
            </div>
          </section>

          <AliveHorizontal />
          <StackedImages />

          <section className="relative h-[115svh] overflow-hidden bg-[#050708]">
            <ReactiveScene externalLook={faceLook} className="absolute inset-0 opacity-70" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(5,7,8,.7))]" />
            <div className="relative z-10 flex h-full flex-col justify-between p-6 pb-10 pt-24 md:p-10 md:pb-12 md:pt-28">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">06 / The laboratory stays open</p>
              <div>
                <h2 className="font-display text-[clamp(4.8rem,13vw,13rem)] leading-[0.72] tracking-[-0.08em]">Make it<br /><i>respond.</i></h2>
                <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-6">
                  <p className="max-w-sm text-sm leading-relaxed text-white/45">Twelve reusable effects, isolated and adjustable. The start of a living component library.</p>
                  <Link href="/playground" className="rounded-full bg-cyan-300 px-7 py-5 text-xs uppercase tracking-[0.2em] text-black transition-transform hover:scale-105">Open playground ↗</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </SmoothScrollProvider>
  );
}

