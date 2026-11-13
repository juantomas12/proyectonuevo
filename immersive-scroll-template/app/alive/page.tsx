import type { Metadata } from "next";
import { AliveExperience } from "@/components/alive/AliveExperience";

export const metadata: Metadata = {
  title: "Alive — Human Interaction Study",
  description: "Experiencia experimental con señal sintética reactiva, personaje WebGL, seguimiento facial opcional y laboratorio de efectos.",
};

export default function AlivePage() {
  return <AliveExperience />;
}
