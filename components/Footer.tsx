import Link from "next/link";
import { site, nav } from "../lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 bg-panel text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="font-display text-3xl font-extrabold">{site.name}</div>
          <p className="mt-2 max-w-xs text-white/70">{site.tagline}</p>
        </div>

        <div>
          <h4 className="mb-3 font-display text-xl font-bold">Sahifalar</h4>
          <ul className="space-y-2 text-white/70">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/bron" className="hover:text-white">
                Navbat olish
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-xl font-bold">Aloqa</h4>
          <ul className="space-y-2 text-white/70">
            <li>
              <a href={`tel:${site.phoneRaw}`} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li>{site.address}</li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/50">
        © {site.name}
      </div>
    </footer>
  );
}
