import Link from "next/link";
import { effects } from "@/lib/effects";

export function PlaygroundIndex() {
  return (
    <main className="min-h-screen bg-[#f0eee8] px-5 pb-16 pt-24 text-[#101412] md:px-10 md:pt-32">
      <header className="mx-auto max-w-[1500px] border-b border-black/20 pb-12">
        <div className="mb-12 flex items-center justify-between text-[10px] uppercase tracking-[0.22em]">
          <Link href="/alive">← Experience 02</Link>
          <Link href="/">Study 01</Link>
        </div>
        <p className="mb-5 text-[10px] uppercase tracking-[0.25em]">Reusable interaction library / 12 modules</p>
        <h1 className="font-display text-[clamp(4.5rem,12vw,12rem)] leading-[0.72] tracking-[-0.08em]">Effect<br /><i>playground.</i></h1>
      </header>

      <section className="mx-auto grid max-w-[1500px] md:grid-cols-2 xl:grid-cols-3">
        {effects.map((effect) => (
          <Link
            key={effect.slug}
            href={`/playground/${effect.slug}`}
            className="group relative min-h-[360px] overflow-hidden border-b border-black/20 p-7 transition-colors hover:bg-[#101412] hover:text-white md:border-r md:p-9"
          >
            <div className="flex justify-between text-[10px] uppercase tracking-[0.22em] opacity-50"><span>{effect.number}</span><span>{effect.type}</span></div>
            <div className="absolute inset-x-7 bottom-7 md:inset-x-9 md:bottom-9">
              <h2 className="font-display text-5xl tracking-[-0.05em] md:text-6xl">{effect.title}</h2>
              <p className="mt-4 max-w-[30ch] text-sm leading-relaxed opacity-55">{effect.description}</p>
              <span className="mt-8 inline-block text-[10px] uppercase tracking-[0.22em] transition-transform group-hover:translate-x-2">Open module →</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

