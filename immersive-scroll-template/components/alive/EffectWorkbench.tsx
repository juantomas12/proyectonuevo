"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { EffectSlug } from "@/lib/effects";
import { InteractiveFace2D } from "./InteractiveFace2D";
import { ReactiveScene } from "./ReactiveScene";
import { WebcamController } from "./WebcamController";

function Range({ label, value, onChange, min = 0.2, max = 2 }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number }) {
  return (
    <label className="block border-b border-white/10 py-5">
      <span className="mb-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/50"><span>{label}</span><span>{value.toFixed(2)}</span></span>
      <input className="w-full accent-cyan-300" type="range" min={min} max={max} step="0.05" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function CssEffect({ slug, intensity, speed }: { slug: EffectSlug; intensity: number; speed: number }) {
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  return (
    <div
      className="relative grid h-full w-full place-items-center overflow-hidden bg-[#d7f7ee] text-[#0a1612] [perspective:1000px]"
      onPointerMove={(event) => {
        if (!card.current) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.current.style.transform = `rotateY(${x * 18 * intensity}deg) rotateX(${-y * 14 * intensity}deg) scale(1.04)`;
      }}
      onPointerLeave={() => { if (card.current) card.current.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)"; }}
      onClick={() => setActive((value) => !value)}
    >
      {slug === "infinite-zoom" && (
        <div ref={card} className="relative h-[56%] w-[52%] overflow-hidden transition-transform duration-700" style={{ transform: active ? `scale(${1.7 * intensity})` : "scale(1)" }}>
          <Image src="/images/coast.jpg" alt="Demo de zoom" fill sizes="50vw" className="object-cover" />
        </div>
      )}
      {slug === "horizontal-gallery" && (
        <div ref={card} className="flex w-[140%] gap-4 transition-transform" style={{ transform: `translateX(${active ? -20 * intensity : 10}%)`, transitionDuration: `${1 / speed}s` }}>
          {["monolith", "curve", "void"].map((image) => <div key={image} className="relative aspect-[4/5] w-1/3 overflow-hidden"><Image src={`/images/${image}.jpg`} alt="" fill sizes="30vw" className="object-cover" /></div>)}
        </div>
      )}
      {slug === "image-stack" && (
        <div className="relative h-[62%] w-[48%]">
          {["forest", "glacier", "mist"].map((image, index) => <div key={image} className="absolute inset-0 overflow-hidden transition-transform duration-700" style={{ transform: `translate(${index * 8 * intensity}px, ${index * 8 * intensity}px) rotate(${(index - 1) * 4 * intensity}deg)` }}><Image src={`/images/${image}.jpg`} alt="" fill sizes="40vw" className="object-cover" /></div>)}
        </div>
      )}
      {slug === "magnetic-cursor" && (
        <div ref={card} className="transition-transform duration-300"><button className="rounded-full bg-[#0a1612] px-10 py-6 text-xs uppercase tracking-[0.22em] text-white">Come closer</button></div>
      )}
      {slug === "tilt-image" && (
        <div ref={card} className="relative h-[66%] w-[52%] overflow-hidden shadow-2xl transition-transform duration-300 [transform-style:preserve-3d]"><Image src="/images/dunes.jpg" alt="Demo de inclinación 3D" fill sizes="50vw" className="object-cover" /><span className="absolute bottom-5 left-5 font-display text-4xl text-white [transform:translateZ(60px)]">Depth</span></div>
      )}
      {slug === "scene-transition" && (
        <div ref={card} className="relative h-full w-full overflow-hidden">
          <Image src="/images/glacier.jpg" alt="Escena de transición" fill sizes="70vw" className="object-cover" />
          <div className="absolute inset-0 overflow-hidden bg-[#ff603d] transition-[clip-path]" style={{ clipPath: active ? "circle(80% at 50% 50%)" : "circle(12% at 50% 50%)", transitionDuration: `${1.2 / speed}s` }}><Image src="/images/coast.jpg" alt="" fill sizes="70vw" className="object-cover opacity-70" /></div>
        </div>
      )}
      <p className="pointer-events-none absolute bottom-5 left-5 text-[9px] uppercase tracking-[0.2em] opacity-50">Move / click to test</p>
    </div>
  );
}

export function EffectWorkbench({ slug, title, type, description }: { slug: EffectSlug; title: string; type: string; description: string }) {
  const [speed, setSpeed] = useState(1);
  const [sensitivity, setSensitivity] = useState(1);
  const [intensity, setIntensity] = useState(1);
  const [smoothing, setSmoothing] = useState(0.65);
  const [look, setLook] = useState<{ x: number; y: number } | null>(null);
  const is3D = ["head-3d", "avatar-3d", "particles", "liquid-shader"].includes(slug);
  const isCss = ["infinite-zoom", "horizontal-gallery", "image-stack", "magnetic-cursor", "tilt-image", "scene-transition"].includes(slug);

  return (
    <main className="min-h-screen bg-[#080b0c] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 text-[10px] uppercase tracking-[0.22em] md:px-8">
        <Link href="/playground">← All modules</Link><span>{type} / Live workbench</span>
      </header>
      <div className="grid min-h-[calc(100svh-61px)] lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="relative min-h-[68svh] overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r">
          {slug === "gaze-2d" && <div className="grid h-full min-h-[68svh] place-items-center p-12"><InteractiveFace2D sensitivity={sensitivity} /></div>}
          {is3D && <ReactiveScene className="absolute inset-0" />}
          {slug === "face-tracking" && (
            <div className="relative h-full min-h-[68svh]"><ReactiveScene externalLook={look} className="absolute inset-0" /><div className="absolute bottom-6 right-6"><WebcamController onLook={setLook} /></div></div>
          )}
          {isCss && <CssEffect slug={slug} intensity={intensity} speed={speed} />}
        </section>
        <aside className="p-6 md:p-8">
          <p className="mb-4 text-[10px] uppercase tracking-[0.23em] text-cyan-300">{type}</p>
          <h1 className="font-display text-5xl tracking-[-0.05em]">{title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/50">{description}</p>
          <div className="mt-8 border-t border-white/10">
            <Range label="Speed" value={speed} onChange={setSpeed} />
            <Range label="Sensitivity" value={sensitivity} onChange={setSensitivity} />
            <Range label="Intensity" value={intensity} onChange={setIntensity} />
            <Range label="Smoothing" value={smoothing} min={0.1} max={1} onChange={setSmoothing} />
          </div>
          <p className="mt-6 text-[10px] leading-relaxed text-white/30">Parameters are isolated per module. The component API is ready to connect these values to a future design-token preset system.</p>
        </aside>
      </div>
    </main>
  );
}

