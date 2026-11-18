"use client";

import Link from "next/link";
import { useState } from "react";
import { site, nav } from "../lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          {site.name}
          <span className="text-orange-500">.</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="opacity-80 hover:text-orange-500 hover:opacity-100">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${site.phoneRaw}`} className="hidden text-sm opacity-80 lg:block">
            {site.phone}
          </a>
          <Link
            href="/bron"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black hover:bg-orange-400"
          >
            Navbat olish
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm md:hidden"
            aria-expanded={open}
          >
            {open ? "Yopish" : "Menyu"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 py-3 md:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block py-2 opacity-90"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
