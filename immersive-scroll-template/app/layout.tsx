import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Threshold — Interactive Studies",
    template: "%s — Threshold",
  },
  description:
    "Dos experiencias web experimentales: narrativa cinematográfica controlada por scroll y un laboratorio 3D reactivo.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
