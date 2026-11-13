"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.15, ease: "power3" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.15, ease: "power3" });
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });
    const move = (event: PointerEvent) => {
      dotX(event.clientX); dotY(event.clientY); ringX(event.clientX); ringY(event.clientY);
    };
    const over = (event: Event) => {
      const interactive = (event.target as HTMLElement).closest("a,button,[data-magnetic]");
      gsap.to(ring.current, { scale: interactive ? 1.8 : 1, duration: 0.3 });
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] hidden mix-blend-difference md:block" aria-hidden="true">
      <div ref={ring} className="absolute -left-5 -top-5 h-10 w-10 rounded-full border border-white/70" />
      <div ref={dot} className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-white" />
    </div>
  );
}

