import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "../../../lib/prisma";
import { site } from "../../../lib/site";

export const metadata = { title: "Biz haqimizda" };

const principles = [
  {
    title: "Avval tushuntiramiz",
    text: "Ish boshlashdan oldin nima qilinishini, qancha turishini va qancha vaqt olishini aytamiz.",
  },
  {
    title: "Vaqtingizni hurmat qilamiz",
    text: "Navbat onlayn olinadi, shuning uchun kelganingizda kutib o'tirmaysiz.",
  },
  {
    title: "Qilingan ishni ko'rsatamiz",
    text: "Ish tugagach nimalar almashtirilgani va nima tavsiya etilishini yozib beramiz.",
  },
];

async function Facts() {
  await connection();
  const [bays, services] = await Promise.all([
    prisma.bay.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: true } }),
  ]);

  const items = [
    { label: "ish posti", value: String(bays) },
    { label: "xizmat turi", value: String(services) },
    { label: "ish vaqti", value: site.hours },
  ];

  return (
    <dl className="grid divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {items.map((i) => (
        <div key={i.label} className="py-6 sm:px-6 sm:first:pl-0">
          <dt className="text-steel">{i.label}</dt>
          <dd className="mt-1 font-display text-3xl font-bold">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-5xl font-extrabold">Biz haqimizda</h1>
      <p className="mt-4 max-w-2xl text-lg">
        {site.name} mashina egasining vaqtini hurmat qiladigan avtoservis. Avval
        nosozlikni aniqlaymiz, narx va muddatni kelishamiz, shundan keyingina ishni
        boshlaymiz.
      </p>

      <div className="mt-10">
        <Suspense fallback={<div className="h-24" />}>
          <Facts />
        </Suspense>
      </div>

      <h2 className="mt-14 font-display text-4xl font-bold">Ish tamoyillarimiz</h2>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {principles.map((p) => (
          <li key={p.title} className="grid gap-1 py-5 sm:grid-cols-[16rem_1fr] sm:gap-8">
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="text-steel">{p.text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <Link
          href="/bron"
          className="inline-block rounded-md bg-ink px-6 py-3 text-lg font-semibold text-white hover:bg-panel"
        >
          Navbat olish
        </Link>
      </div>
    </section>
  );
}