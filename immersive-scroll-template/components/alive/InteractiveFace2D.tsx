"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

type Look = { x: number; y: number };

export function InteractiveFace2D({
  sensitivity = 1,
  externalLook,
  embedded = false,
}: {
  sensitivity?: number;
  externalLook?: Look | null;
  embedded?: boolean;
}) {
  const shell = useRef<HTMLDivElement>(null);
  const pupils = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const [blink, setBlink] = useState(false);
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    const breathe = gsap.to(shell.current, {
      y: -7,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const onMove = (event: PointerEvent) => {
      if (!shell.current || externalLook) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      const distance = Math.hypot(x, y);
      gsap.to(shell.current, {
        rotateY: x * 12 * sensitivity,
        rotateX: -y * 9 * sensitivity,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.to(pupils.current?.querySelectorAll("[data-pupil]") ?? [], {
        x: x * 23 * sensitivity,
        y: y * 15 * sensitivity,
        duration: 0.28,
        ease: "power2.out",
      });
      gsap.to(halo.current, {
        rotate: x * 16,
        scale: 1 + Math.max(0, 0.52 - distance) * 0.12,
        duration: 0.8,
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      breathe.kill();
      window.removeEventListener("pointermove", onMove);
    };
  }, [externalLook, sensitivity]);

  useEffect(() => {
    if (!externalLook || !shell.current) return;
    gsap.to(shell.current, {
      rotateY: externalLook.x * 14,
      rotateX: -externalLook.y * 10,
      duration: 0.22,
    });
    gsap.to(pupils.current?.querySelectorAll("[data-pupil]") ?? [], {
      x: externalLook.x * 22,
      y: externalLook.y * 14,
      duration: 0.16,
    });
  }, [externalLook]);

  const react = () => {
    setBlink(true);
    setAwake((value) => !value);
    window.setTimeout(() => setBlink(false), 170);
    gsap.fromTo(shell.current, { scale: 0.97 }, { scale: 1, duration: 0.65, ease: "elastic.out(1, .45)" });
  };

  return (
    <div className={embedded ? "absolute inset-0" : "relative mx-auto aspect-[3/4] w-[min(76vw,520px)] [perspective:1200px]"}>
      <div
        ref={shell}
        onClick={react}
        onKeyDown={(event) => event.key === "Enter" && react()}
        role="button"
        tabIndex={0}
        aria-label="Entidad gráfica interactiva. Pulsa para provocar una reacción."
        className="group relative h-full w-full cursor-pointer overflow-hidden rounded-[44%_44%_38%_38%] border border-cyan-100/15 bg-[#05090b] shadow-[0_40px_160px_rgba(31,224,255,.17)] outline-none will-change-transform [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(79,238,255,.18),transparent_29%),radial-gradient(circle_at_28%_72%,rgba(255,99,49,.14),transparent_34%),linear-gradient(145deg,#071418,#020304_68%)]" />
        <div ref={halo} className="absolute left-1/2 top-[47%] aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/20 shadow-[inset_0_0_45px_rgba(81,232,255,.08),0_0_60px_rgba(81,232,255,.08)]">
          <span className="absolute left-1/2 top-[-5%] h-[110%] w-px bg-gradient-to-b from-transparent via-cyan-200/30 to-transparent" />
          <span className="absolute left-[-5%] top-1/2 h-px w-[110%] bg-gradient-to-r from-transparent via-cyan-200/25 to-transparent" />
          <span className="absolute inset-[9%] animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-white/10" />
        </div>

        <div className="absolute left-1/2 top-[16%] h-[67%] w-[69%] -translate-x-1/2 rounded-[48%_48%_42%_42%] border border-white/15 bg-[linear-gradient(150deg,rgba(255,255,255,.13),rgba(255,255,255,.015)_42%,rgba(0,229,255,.08))] shadow-[inset_18px_8px_38px_rgba(255,255,255,.04),inset_-22px_-18px_48px_rgba(0,0,0,.7)] backdrop-blur-sm">
          <span className="absolute left-1/2 top-[9%] h-[18%] w-px -translate-x-1/2 bg-gradient-to-b from-cyan-200/60 to-transparent" />
          <span className="absolute bottom-[12%] left-1/2 h-px w-[28%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100/55 to-transparent" />
          <span className="absolute bottom-[7%] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange-400 shadow-[0_0_16px_#ff6b35]" />
        </div>

        <div ref={pupils} className="absolute inset-0" aria-hidden="true">
          {([37, 63] as const).map((left) => (
            <div
              key={left}
              data-eye
              className="absolute top-[42%] h-[11%] w-[22%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[65%_35%_65%_35%] border border-cyan-100/35 bg-[#d9fcff] shadow-[0_0_26px_rgba(93,237,255,.42)] transition-transform duration-100"
              style={{ left: `${left}%`, transform: `translate(-50%,-50%) rotate(${left === 37 ? 5 : -5}deg) scaleY(${blink ? 0.08 : 1})` }}
            >
              <span data-pupil className="absolute left-1/2 top-1/2 aspect-square h-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_38%_32%,white_0_7%,#71eeff_9%,#07191d_38%,#010202_72%)] shadow-[0_0_18px_rgba(0,229,255,.9)]">
                <span className="absolute left-1/2 top-1/2 h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
              </span>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-[7%] top-[8%] flex justify-between text-[7px] uppercase tracking-[0.24em] text-cyan-100/35">
          <span>SYN/02</span><span>{awake ? "SIGNAL OPEN" : "LISTENING"}</span>
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:repeating-linear-gradient(180deg,transparent_0_3px,#b9fbff_4px)]" />
        <div className={`pointer-events-none absolute inset-x-0 h-px bg-cyan-200/50 shadow-[0_0_14px_#5cecff] transition-[top] duration-700 ${awake ? "top-[72%]" : "top-[24%]"}`} />
      </div>

      {!embedded && (
        <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-4 py-2 text-[9px] uppercase tracking-[0.22em] text-white/55 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" /> Synthetic signal / no human likeness
        </div>
      )}
    </div>
  );
}
