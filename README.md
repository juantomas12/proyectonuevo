# Interactive Web Studies

Repositorio compartido para comparar y evolucionar dos direcciones de web experimental dentro de una única aplicación Next.js.

## Experiencias

- **Study 01 — Threshold** (`/`): storytelling editorial controlado por scroll, zoom, galería horizontal, escenas apiladas y transiciones cinematográficas.
- **Study 02 — Alive** (`/alive`): retrato 2D reactivo, personaje WebGL real, shaders, partículas y seguimiento facial opcional con consentimiento.
- **Effect playground** (`/playground`): doce módulos reutilizables, cada uno con ruta propia y controles de parámetros.

El proyecto ejecutable está en [`immersive-scroll-template`](./immersive-scroll-template).

## Desarrollo

```bash
cd immersive-scroll-template
pnpm install
pnpm dev
```

La cámara nunca se inicia automáticamente. MediaPipe procesa los fotogramas localmente y no graba ni sube imágenes.
