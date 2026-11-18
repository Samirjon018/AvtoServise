import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { site } from "../lib/site";

export const metadata: Metadata = {
  title: { default: `${site.name} — avtoservis`, template: `%s | ${site.name}` },
  description: "Onlayn navbat, aniq narxlar va sifatli avtoservis xizmati.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
