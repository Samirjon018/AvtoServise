import Link from "next/link";
import { site } from "../../../lib/site";

export const metadata = { title: "Aloqa" };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-5xl font-extrabold">Aloqa</h1>
      <p className="mt-2 max-w-xl text-steel">
        Savolingiz bo&apos;lsa, qo&apos;ng&apos;iroq qiling yoki Telegramga yozing.
        Navbat olish uchun qo&apos;ng&apos;iroq shart emas.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <dl className="divide-y divide-line border-y border-line">
          <div className="py-5">
            <dt className="text-steel">Telefon</dt>
            <dd className="mt-1 font-display text-3xl font-bold">
              <a href={`tel:${site.phoneRaw}`} className="hover:underline">
                {site.phone}
              </a>
            </dd>
          </div>
          <div className="py-5">
            <dt className="text-steel">Telegram</dt>
            <dd className="mt-1 font-display text-3xl font-bold">
              <a href={site.telegram} target="_blank" rel="noreferrer" className="hover:underline">
                {site.telegramLabel}
              </a>
            </dd>
          </div>
          <div className="py-5">
            <dt className="text-steel">Manzil</dt>
            <dd className="mt-1 text-xl">{site.address}</dd>
          </div>
          <div className="py-5">
            <dt className="text-steel">Ish vaqti</dt>
            <dd className="mt-1 text-xl">{site.hours}</dd>
          </div>
        </dl>

        {site.mapEmbed ? (
          <iframe
            src={site.mapEmbed}
            title="Avtoservis joylashuvi"
            loading="lazy"
            className="h-96 w-full rounded-xl border-0"
          />
        ) : (
          <div className="flex flex-col justify-center rounded-xl bg-panel p-8 text-white">
            <h2 className="font-display text-4xl font-bold">Navbatni onlayn oling</h2>
            <p className="mt-2 text-white/70">
              Bo&apos;sh vaqtni tanlang, qolganini o&apos;zimiz hal qilamiz.
            </p>
            <Link
              href="/bron"
              className="mt-6 inline-block self-start rounded-md bg-signal px-6 py-3 text-lg font-semibold text-ink"
            >
              Navbat olish
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}