import type { Metadata } from "next";
import { PlaygroundIndex } from "@/components/alive/PlaygroundIndex";

export const metadata: Metadata = {
  title: "Effect Playground",
  description: "Biblioteca configurable de doce interacciones reutilizables para experiencias web experimentales.",
};

export default function PlaygroundPage() {
  return <PlaygroundIndex />;
}
