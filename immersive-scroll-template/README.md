# Threshold — Interactive Studies

Dos demos creativas en una aplicación Next.js + TypeScript preparada para Sites.

## Rutas

- `/` — experiencia cinematográfica controlada por scroll.
- `/alive` — señal sintética 2D, personaje WebGL y modo cámara opcional.
- `/playground` — índice de doce efectos reutilizables.
- `/playground/[effect]` — banco de pruebas configurable de cada efecto.

## Stack

Next.js/Vinext, React, TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Lenis, Motion, Three.js, React Three Fiber, Drei y MediaPipe Tasks Vision.

## Comandos

```bash
pnpm install
pnpm dev
pnpm build
pnpm exec tsc --noEmit
```

## Privacidad

El modo de seguimiento facial es opcional, solicita consentimiento explícito y procesa la cámara localmente en el navegador. No graba ni almacena imágenes. La orientación de cabeza no se presenta como seguimiento ocular preciso.

## Imágenes

Las escenas editoriales utilizan fotografías descargadas de Unsplash bajo su licencia. La mirada principal es una máscara sintética creada íntegramente con HTML y CSS en `components/alive/InteractiveFace2D.tsx`: no utiliza ni imita a una persona real.
