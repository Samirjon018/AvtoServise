import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "../../../lib/prisma";

export const metadata = { title: "Xizmatlar va narxlar" };

const money = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const duration = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return [h ? `${h} soat` : "", m ? `${m} daqiqa` : ""].filter(Boolean).join(" ");
};

async function Services() {
  await connection();
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  return (
    <ul className="border-t border-line">
      {services.map((s) => (
        <li
          key={s.id}
          className="grid gap-4 border-b border-line py-6 sm:grid-cols-[1fr_auto] sm:items-center"
        >
          <div>
            <h2 className="text-xl font-semibold">{s.name}</h2>
            {s.description && (
              <p className="mt-1 max-w-xl text-steel">{s.description}</p>
            )}
            <p className="mt-2 text-steel">Davomiyligi: {duration(s.durationMin)}</p>
          </div>
          <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end sm:gap-3">
            <span className="font-display text-3xl font-bold">
              {money(s.price)} so&apos;m
            </span>
            <Link
              href={`/bron?service=${s.id}`}
              className="rounded-md border border-ink px-4 py-2 font-semibold hover:bg-ink hover:text-white"
            >
              Bron qilish
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-5xl font-extrabold">Xizmatlar va narxlar</h1>
      <p className="mt-2 max-w-xl text-steel">
        Har bir xizmatning narxi va qancha vaqt olishi oldindan ko&apos;rsatilgan.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-steel">Yuklanmoqda...</p>}>
          <Services />
        </Suspense>
      </div>
      <p className="mt-8 max-w-xl text-steel">
        Ko&apos;rsatilgan narx xizmatning asosiy narxi. Mashina holatiga qarab usta
        ish boshlashdan oldin siz bilan kelishadi.
      </p>
    </section>
  );
}