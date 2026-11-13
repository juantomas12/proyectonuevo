"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function FinalSection() {
  const section = useRef<HTMLElement>(null);
  const images = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-final-line]", {
        yPercent: 115,
        stagger: 0.08,
        scrollTrigger: {
          trigger: root,
          start: "top 65%",
          end: "top 20%",
          scrub: 1,
        },
      });
      gsap.from("[data-final-meta]", {
        opacity: 0,
        y: 30,
        scrollTrigger: { trigger: root, start: "top 40%", end: "top 15%", scrub: 1 },
      });
    }, root);

    const onMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      gsap.to(images.current?.querySelectorAll("[data-float-image]") ?? [], {
        x: (index) => x * (index + 1) * 26,
        y: (index) => y * (index + 1) * 18,
        rotate: (index) => x * (index % 2 ? -5 : 5),
        duration: 1.2,
        ease: "power3.out",
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={section}
      data-scene="06"
      className="relative min-h-[125svh] overflow-hidden bg-[#d9ff57] px-5 pb-8 pt-[18svh] text-[#11110f] md:px-10 md:pb-10"
      aria-labelledby="final-title"
    >
      <div ref={images} aria-hidden="true" className="absolute inset-0 opacity-90">
        <div data-float-image className="absolute left-[7vw] top-[12svh] h-[18vw] min-h-36 w-[14vw] min-w-28 rotate-[-7deg] overflow-hidden">
          <Image src="/images/dunes.jpg" alt="" fill sizes="20vw" className="object-cover" />
        </div>
        <div data-float-image className="absolute right-[8vw] top-[20svh] h-[15vw] min-h-28 w-[11vw] min-w-24 rotate-[8deg] overflow-hidden">
          <Image src="/images/glacier.jpg" alt="" fill sizes="15vw" className="object-cover" />
        </div>
        <div data-float-image className="absolute bottom-[18svh] right-[17vw] h-[12vw] min-h-24 w-[18vw] min-w-36 rotate-[-4deg] overflow-hidden">
          <Image src="/images/void.jpg" alt="" fill sizes="20vw" className="object-cover" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[98svh] max-w-[1600px] flex-col justify-between">
        <p data-final-meta className="ml-auto max-w-[26ch] text-sm leading-relaxed">
          The screen is not a surface. It is a space: elastic, responsive, and alive to movement.
        </p>

        <h2 id="final-title" className="font-display my-[12svh] text-[clamp(4.8rem,14.5vw,14rem)] font-medium leading-[0.72] tracking-[-0.085em]">
          <span className="block overflow-hidden"><span data-final-line className="block">Not a page.</span></span>
          <span className="block overflow-hidden text-right"><span data-final-line className="block italic">A passage.</span></span>
        </h2>

        <div data-final-meta className="grid items-end gap-8 border-t border-black/30 pt-6 md:grid-cols-3">
          <p className="text-[10px] uppercase leading-relaxed tracking-[0.22em]">Threshold®<br />Interactive study 01</p>
          <p className="text-[10px] uppercase leading-relaxed tracking-[0.22em] md:text-center">Direction — Motion — Code<br />Madrid / 2026</p>
          <div className="md:text-right">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                href="/alive"
                className="group inline-flex items-center gap-5 rounded-full bg-[#11110f] px-7 py-5 text-xs uppercase tracking-[0.2em] text-white"
              >
                Enter experience 02
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
