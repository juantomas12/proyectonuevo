"use client";

import { gsap } from "gsap";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export function MagneticButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  const button = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={button}
      data-magnetic
      className={className}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        gsap.to(button.current, {
          x: (event.clientX - rect.left - rect.width / 2) * 0.22,
          y: (event.clientY - rect.top - rect.height / 2) * 0.22,
          duration: 0.35,
        });
      }}
      onPointerLeave={() => gsap.to(button.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, .4)" })}
      {...props}
    >
      {children}
    </button>
  );
}

