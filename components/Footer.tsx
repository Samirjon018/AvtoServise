import Link from "next/link";
import { site, nav } from "../lib/site";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-neutral-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="text-xl font-extrabold">
            {site.name}
            <span className="text-orange-500">.</span>
          </div>
          <p className="mt-2 text-sm opacity-70">{site.tagline}</p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Sahifalar</h4>
          <ul className="space-y-2 text-sm opacity-80">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-orange-500">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/bron" className="hover:text-orange-500">
                Navbat olish
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Aloqa</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>
              <a href={`tel:${site.phoneRaw}`} className="hover:text-orange-500">
                {site.phone}
              </a>
            </li>
            <li>{site.address}</li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-50">
        © {site.name}. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
}
