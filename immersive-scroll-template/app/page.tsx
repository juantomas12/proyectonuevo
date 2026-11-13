import { SmoothScrollProvider } from "@/components/animations/SmoothScrollProvider";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { SiteChrome } from "@/components/SiteChrome";
import { HeroZoom } from "@/components/sections/HeroZoom";
import { InfiniteImageReveal } from "@/components/sections/InfiniteImageReveal";
import { HorizontalGallery } from "@/components/sections/HorizontalGallery";
import { StackedImages } from "@/components/sections/StackedImages";
import { CinematicTransition } from "@/components/sections/CinematicTransition";
import { FinalSection } from "@/components/sections/FinalSection";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <SiteChrome />
      <main>
        <HeroZoom />
        <InfiniteImageReveal />
        <HorizontalGallery />
        <StackedImages />
        <CinematicTransition />
        <FinalSection />
      </main>
    </SmoothScrollProvider>
  );
}
