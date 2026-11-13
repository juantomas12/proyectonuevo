"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

type FacePoints = {
  left: { x: number; y: number };
  right: { x: number; y: number };
};

const defaultEyes: FacePoints = {
  left: { x: 41.4, y: 38.7 },
  right: { x: 62.2, y: 38.7 },
};

export function InteractiveFace2D({
  sensitivity = 1,
  externalLook,
}: {
  sensitivity?: number;
  externalLook?: { x: number; y: number } | null;
}) {
  const root = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const pupils = useRef<HTMLDivElement>(null);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!head.current || externalLook) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      gsap.to(head.current, { rotateY: x * 7 * sensitivity, rotateX: -y * 5 * sensitivity, duration: 0.8, ease: "power3.out" });
      gsap.to(pupils.current?.querySelectorAll("[data-pupil]") ?? [], { x: x * 9 * sensitivity, y: y * 6 * sensitivity, duration: 0.35, ease: "power2.out" });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [externalLook, sensitivity]);

  useEffect(() => {
    if (!externalLook || !head.current) return;
    gsap.to(head.current, { rotateY: externalLook.x * 10, rotateX: -externalLook.y * 8, duration: 0.25 });
    gsap.to(pupils.current?.querySelectorAll("[data-pupil]") ?? [], { x: externalLook.x * 9, y: externalLook.y * 6, duration: 0.18 });
  }, [externalLook]);

  const doBlink = () => {
    setBlink(true);
    window.setTimeout(() => setBlink(false), 180);
  };

  return (
    <div ref={root} className="relative mx-auto aspect-[3/4] w-[min(72vw,520px)] [perspective:1200px]">
      <div
        ref={head}
        onClick={doBlink}
        className="relative h-full w-full cursor-pointer overflow-hidden rounded-[48%_48%_42%_42%] border border-white/10 bg-[#111] shadow-[0_40px_140px_rgba(0,229,255,.12)] will-change-transform [transform-style:preserve-3d]"
        role="button"
        tabIndex={0}
        onKeyDown={(event) => event.key === "Enter" && doBlink()}
        aria-label="Retrato interactivo. Pulsa para parpadear."
      >
        <Image src="/images/demo-face.png" alt="Retrato de demostración generado para el modo facial 2D" fill priority sizes="(max-width: 768px) 72vw, 520px" className="object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_28%,rgba(0,0,0,.22)_75%)]" />
        <div ref={pupils} className="absolute inset-0" aria-hidden="true">
          {[defaultEyes.left, defaultEyes.right].map((eye, index) => (
            <div
              key={index}
              className="absolute h-[3.1%] w-[3.1%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#090a08] shadow-[0_0_5px_rgba(255,255,255,.25)]"
              style={{ left: `${eye.x}%`, top: `${eye.y}%` }}
            >
              <span data-pupil className="absolute left-[38%] top-[34%] h-[24%] w-[24%] rounded-full bg-white/80" />
            </div>
          ))}
        </div>
        <div className={`absolute inset-x-[24%] top-[35.5%] h-[7%] bg-[#090909] transition-transform duration-100 ${blink ? "scale-y-100" : "scale-y-0"}`} style={{ transformOrigin: "top" }} aria-hidden="true" />
      </div>
      <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[9px] uppercase tracking-[0.22em] text-white/55 backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" /> Demo portrait / replaceable
      </div>
    </div>
  );
}
