"use client";

import Link from "next/link";
import { useState } from "react";
import { site, nav } from "../lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-floor/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-3xl font-extrabold tracking-tight">
          {site.name}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-steel hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${site.phoneRaw}`} className="hidden font-medium lg:block">
            {site.phone}
          </a>
          <Link
            href="/bron"
            className="rounded-md bg-ink px-4 py-2 font-semibold text-white hover:bg-panel"
          >
            Navbat olish
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-md border border-line px-3 py-2 text-sm md:hidden"
            aria-expanded={open}
          >
            {open ? "Yopish" : "Menyu"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line px-4 py-2 md:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-lg"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
