"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { EffectSlug } from "@/lib/effects";
import { InteractiveFace2D } from "./InteractiveFace2D";
import { ReactiveScene, type SceneVariant } from "./ReactiveScene";
import { WebcamController } from "./WebcamController";

type Parameters = {
  speed: number;
  sensitivity: number;
  intensity: number;
  smoothing: number;
};

const defaults: Parameters = {
  speed: 1,
  sensitivity: 1,
  intensity: 1,
  smoothing: 0.65,
};

function Range({ label, value, onChange, min = 0.2, max = 2 }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number }) {
  return (
    <label className="block border-b border-white/10 py-4">
      <span className="mb-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/50"><span>{label}</span><span>{value.toFixed(2)}</span></span>
      <input className="w-full cursor-ew-resize accent-cyan-300" type="range" min={min} max={max} step="0.05" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function CssEffect({ slug, parameters }: { slug: EffectSlug; parameters: Parameters }) {
  const subject = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const transition = Math.max(0.12, parameters.smoothing * 0.9);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!subject.current || !stage.current) return;
    const rect = stage.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const strength = parameters.sensitivity * parameters.intensity;

    if (slug === "tilt-image") {
      subject.current.style.transform = `rotateY(${x * 26 * strength}deg) rotateX(${-y * 20 * strength}deg) scale(1.04)`;
    } else if (slug === "magnetic-cursor") {
      subject.current.style.transform = `translate(${x * 150 * strength}px,${y * 110 * strength}px) scale(${1 + Math.max(0, .4 - Math.hypot(x, y)) * .2})`;
    } else if (slug === "horizontal-gallery") {
      subject.current.style.transform = `translateX(${(-25 - x * 24 * strength)}%)`;
    } else if (slug === "infinite-zoom") {
      subject.current.style.transform = `translate(${x * 16}px,${y * 12}px) scale(${1 + (active ? .8 : .18) * parameters.intensity})`;
    }

    if (slug === "image-stack") {
      stage.current.querySelectorAll<HTMLElement>("[data-layer]").forEach((layer, index) => {
        const depth = index + 1;
        layer.style.transform = `translate(${x * depth * 30 * strength}px,${y * depth * 24 * strength}px) rotate(${(index - 1) * 4 + x * depth * 3}deg)`;
      });
    }

    if (slug === "scene-transition") {
      stage.current.style.setProperty("--mask-x", `${(x + .5) * 100}%`);
      stage.current.style.setProperty("--mask-y", `${(y + .5) * 100}%`);
    }
  };

  const resetPointer = () => {
    if (subject.current) subject.current.style.transform = "";
    stage.current?.querySelectorAll<HTMLElement>("[data-layer]").forEach((layer, index) => {
      layer.style.transform = `translate(${index * 10}px,${index * 10}px) rotate(${(index - 1) * 4}deg)`;
    });
  };

  return (
    <div
      ref={stage}
      className="relative grid h-full min-h-[68svh] w-full place-items-center overflow-hidden bg-[#d7f7ee] text-[#0a1612] [--mask-x:50%] [--mask-y:50%] [perspective:1100px]"
      onPointerMove={move}
      onPointerLeave={resetPointer}
      onClick={() => setActive((value) => !value)}
    >
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(9,30,24,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(9,30,24,.15)_1px,transparent_1px)] [background-size:42px_42px]" />

      {slug === "infinite-zoom" && (
        <div ref={subject} className="relative h-[58%] w-[54%] overflow-hidden shadow-2xl will-change-transform" style={{ transition: `transform ${transition / parameters.speed}s cubic-bezier(.16,1,.3,1)` }}>
          <Image src="/images/coast.jpg" alt="Demo de zoom" fill sizes="50vw" className="object-cover" />
          <span className="absolute inset-5 border border-white/50" />
        </div>
      )}

      {slug === "horizontal-gallery" && (
        <div ref={subject} className="flex w-[170%] gap-4 will-change-transform" style={{ transform: `translateX(${active ? -42 : -12}%)`, transition: `transform ${transition / parameters.speed}s cubic-bezier(.16,1,.3,1)` }}>
          {["monolith", "curve", "void", "water"].map((image, index) => (
            <div key={image} className="relative aspect-[4/5] w-1/4 overflow-hidden"><Image src={`/images/${image}.jpg`} alt="" fill sizes="25vw" className="object-cover" /><span className="absolute bottom-3 left-3 font-display text-3xl text-white">0{index + 1}</span></div>
          ))}
        </div>
      )}

      {slug === "image-stack" && (
        <div className="relative h-[62%] w-[48%]">
          {["forest", "glacier", "mist"].map((image, index) => (
            <div key={image} data-layer className="absolute inset-0 overflow-hidden border border-white/30 shadow-2xl will-change-transform" style={{ transform: `translate(${index * 10}px,${index * 10}px) rotate(${(index - 1) * 4}deg)`, transition: `transform ${transition}s cubic-bezier(.16,1,.3,1)`, zIndex: index }}>
              <Image src={`/images/${image}.jpg`} alt="" fill sizes="40vw" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {slug === "magnetic-cursor" && (
        <div ref={subject} className="will-change-transform" style={{ transition: `transform ${transition}s cubic-bezier(.16,1,.3,1)` }}><button className="rounded-full bg-[#0a1612] px-11 py-7 text-xs uppercase tracking-[0.22em] text-white shadow-[0_20px_60px_rgba(0,0,0,.2)]">Come closer</button></div>
      )}

      {slug === "tilt-image" && (
        <div ref={subject} className="relative h-[66%] w-[52%] overflow-hidden shadow-2xl will-change-transform [transform-style:preserve-3d]" style={{ transition: `transform ${transition}s cubic-bezier(.16,1,.3,1)` }}>
          <Image src="/images/dunes.jpg" alt="Demo de inclinación 3D" fill sizes="50vw" className="object-cover" />
          <span className="absolute bottom-5 left-5 font-display text-5xl text-white [transform:translateZ(70px)]">Depth</span>
          <span className="absolute right-5 top-5 h-14 w-14 rounded-full border border-white/60 [transform:translateZ(45px)]" />
        </div>
      )}

      {slug === "scene-transition" && (
        <div ref={subject} className="relative h-full w-full overflow-hidden">
          <Image src="/images/glacier.jpg" alt="Escena de transición" fill sizes="70vw" className="object-cover" />
          <div className="absolute inset-0 overflow-hidden bg-[#ff603d] transition-[clip-path]" style={{ clipPath: active ? "circle(92% at var(--mask-x) var(--mask-y))" : `circle(${14 + parameters.intensity * 7}% at var(--mask-x) var(--mask-y))`, transitionDuration: `${1.2 * parameters.smoothing / parameters.speed}s` }}>
            <Image src="/images/coast.jpg" alt="" fill sizes="70vw" className="object-cover opacity-80" />
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex justify-between text-[9px] uppercase tracking-[0.2em] opacity-55"><span>Move pointer</span><span>Click to toggle</span></div>
    </div>
  );
}

export function EffectWorkbench({ slug, title, type, description }: { slug: EffectSlug; title: string; type: string; description: string }) {
  const [parameters, setParameters] = useState<Parameters>(defaults);
  const [look, setLook] = useState<{ x: number; y: number } | null>(null);
  const variantMap: Partial<Record<EffectSlug, SceneVariant>> = {
    "head-3d": "head",
    "avatar-3d": "avatar",
    particles: "particles",
    "liquid-shader": "liquid",
  };
  const variant = variantMap[slug];
  const isCss = ["infinite-zoom", "horizontal-gallery", "image-stack", "magnetic-cursor", "tilt-image", "scene-transition"].includes(slug);
  const set = (key: keyof Parameters, value: number) => setParameters((current) => ({ ...current, [key]: value }));

  return (
    <main className="min-h-screen bg-[#080b0c] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 text-[10px] uppercase tracking-[0.22em] md:px-8">
        <Link href="/playground">← All modules</Link>
        <div className="flex items-center gap-3"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /><span>{type} / Live</span></div>
      </header>

      <div className="grid min-h-[calc(100svh-61px)] lg:grid-cols-[minmax(0,1fr)_350px]">
        <section className="relative min-h-[68svh] overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r">
          {slug === "gaze-2d" && <div className="grid h-full min-h-[68svh] place-items-center bg-[radial-gradient(circle_at_50%_45%,#12343b,#050708_65%)] p-8"><InteractiveFace2D sensitivity={parameters.sensitivity * parameters.intensity} /></div>}
          {variant && <ReactiveScene className="absolute inset-0" variant={variant} speed={parameters.speed} sensitivity={parameters.sensitivity} intensity={parameters.intensity} smoothing={parameters.smoothing} />}
          {slug === "face-tracking" && (
            <div className="relative h-full min-h-[68svh]"><ReactiveScene externalLook={look} className="absolute inset-0" speed={parameters.speed} sensitivity={parameters.sensitivity} intensity={parameters.intensity} smoothing={parameters.smoothing} /><div className="absolute bottom-6 right-6"><WebcamController onLook={setLook} /></div></div>
          )}
          {isCss && <CssEffect slug={slug} parameters={parameters} />}
        </section>

        <aside className="p-6 md:p-8">
          <div className="flex items-center justify-between"><p className="text-[10px] uppercase tracking-[0.23em] text-cyan-300">{type}</p><button onClick={() => setParameters(defaults)} className="text-[9px] uppercase tracking-[0.18em] text-white/35 transition-colors hover:text-white">Reset</button></div>
          <h1 className="font-display mt-4 text-5xl tracking-[-0.05em]">{title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/50">{description}</p>
          <div className="mt-7 border-t border-white/10">
            <Range label="Speed" value={parameters.speed} onChange={(value) => set("speed", value)} />
            <Range label="Sensitivity" value={parameters.sensitivity} onChange={(value) => set("sensitivity", value)} />
            <Range label="Intensity" value={parameters.intensity} onChange={(value) => set("intensity", value)} />
            <Range label="Smoothing" value={parameters.smoothing} min={0.1} max={1} onChange={(value) => set("smoothing", value)} />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[["Soft", .55], ["Balanced", 1], ["Extreme", 1.65]].map(([label, value]) => (
              <button key={String(label)} onClick={() => setParameters({ speed: Number(value), sensitivity: Number(value), intensity: Number(value), smoothing: label === "Soft" ? .85 : .45 })} className="border border-white/10 px-2 py-3 text-[9px] uppercase tracking-[0.14em] text-white/50 transition-colors hover:border-cyan-300/50 hover:text-cyan-200">{label}</button>
            ))}
          </div>
          <p className="mt-6 text-[10px] leading-relaxed text-white/30">Move the pointer over the preview, click it, and change the controls. Every module now consumes its parameters directly.</p>
        </aside>
      </div>
    </main>
  );
}
