"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tween = gsap.to(line.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] bg-white/10">
      <div
        ref={line}
        className="h-full origin-left scale-x-0 bg-[#d9ff57] will-change-transform"
      />
    </div>
  );
}

