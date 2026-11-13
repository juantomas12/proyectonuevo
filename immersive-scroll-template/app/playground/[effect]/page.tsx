import { notFound } from "next/navigation";
import { EffectWorkbench } from "@/components/alive/EffectWorkbench";
import { effects, getEffect } from "@/lib/effects";

export function generateStaticParams() {
  return effects.map((effect) => ({ effect: effect.slug }));
}

export default async function EffectPage({ params }: { params: Promise<{ effect: string }> }) {
  const { effect: slug } = await params;
  const effect = getEffect(slug);
  if (!effect) notFound();
  return <EffectWorkbench slug={effect.slug} title={effect.title} type={effect.type} description={effect.description} />;
}
