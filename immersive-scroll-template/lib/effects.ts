export const effects = [
  { slug: "gaze-2d", number: "01", title: "Synthetic gaze", type: "Signal", description: "A non-human graphic mask with reactive eyes, blink and parallax." },
  { slug: "head-3d", number: "02", title: "3D head", type: "WebGL", description: "Procedural head rig with cursor-directed rotation." },
  { slug: "avatar-3d", number: "03", title: "3D avatar", type: "WebGL", description: "Idle motion, blink, click reaction and real lighting." },
  { slug: "face-tracking", number: "04", title: "Face tracking", type: "Vision", description: "Optional local head-position control with explicit consent." },
  { slug: "infinite-zoom", number: "05", title: "Infinite zoom", type: "Scroll", description: "A frame scales into the next visual layer." },
  { slug: "horizontal-gallery", number: "06", title: "Horizontal rail", type: "Scroll", description: "Vertical input mapped to a spatial project sequence." },
  { slug: "image-stack", number: "07", title: "Image stack", type: "Scroll", description: "Layered masks, scale and depth-aware scene changes." },
  { slug: "particles", number: "08", title: "Particle field", type: "WebGL", description: "A lightweight field that drifts around pointer input." },
  { slug: "liquid-shader", number: "09", title: "Liquid shader", type: "GLSL", description: "A fragment shader with time and cursor uniforms." },
  { slug: "magnetic-cursor", number: "10", title: "Magnetic cursor", type: "Pointer", description: "Proximity-driven attraction with elastic release." },
  { slug: "tilt-image", number: "11", title: "3D image tilt", type: "Pointer", description: "Perspective and light respond to local pointer position." },
  { slug: "scene-transition", number: "12", title: "Scene transition", type: "Motion", description: "A reversible mask-based transition between visual states." },
] as const;

export type EffectSlug = (typeof effects)[number]["slug"];

export function getEffect(slug: string) {
  return effects.find((effect) => effect.slug === slug);
}

