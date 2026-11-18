import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "../../lib/prisma";

const money = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const features = [
  { title: "Onlayn navbat", text: "Telefon qilmasdan, o'zingizga qulay vaqtni tanlang." },
  { title: "Aniq narx va vaqt", text: "Xizmat narxi va davomiyligi oldindan ko'rinadi." },
  { title: "Ikki marta band bo'lmaydi", text: "Tanlagan vaqtingiz faqat sizniki, boshqa mijoz ololmaydi." },
  { title: "Tezkor tasdiq", text: "Bron qilishingiz bilan xodimlarga xabar boradi." },
];

const steps = [
  { n: "1", title: "Xizmatni tanlang", text: "Ro'yxatdan kerakli xizmatni bosing." },
  { n: "2", title: "Vaqtni belgilang", text: "Sana va bo'sh vaqtlardan birini tanlang." },
  { n: "3", title: "Ma'lumot qoldiring", text: "Ism, telefon va mashina ma'lumotini yozing, tamom." },
];

const faqs = [
  { q: "Navbatni qanday olaman?", a: "Xizmat, sana va vaqtni tanlaysiz, so'ng ism, telefon va mashina ma'lumotini qoldirasiz. Bron shu zahoti qabul qilinadi." },
  { q: "Bronni bekor qilsam bo'ladimi?", a: "Ha, telefon yoki Telegram orqali xabar bering, vaqt boshqa mijozga bo'shatiladi." },
  { q: "Narxlar aniqmi?", a: "Saytda xizmatning asosiy narxi ko'rsatilgan. Mashina holatiga qarab usta ish boshlashdan oldin kelishib oladi." },
  { q: "Qaysi mashinalar bilan ishlaysiz?", a: "Yengil avtomobillarning ko'p markalari bilan. Aniq savol bo'lsa, qo'ng'iroq qiling." },
];

async function ServicesPreview() {
  await connection();
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
    take: 6,
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <Link
          key={s.id}
          href={`/bron?service=${s.id}`}
          className="group rounded-2xl border border-white/10 bg-neutral-900 p-5 transition hover:border-orange-500"
        >
          <h3 className="text-lg font-semibold">{s.name}</h3>
          <p className="mt-1 text-sm opacity-60">{s.durationMin} daqiqa</p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xl font-bold text-orange-500">{money(s.price)} so&apos;m</span>
            <span className="text-sm opacity-60 group-hover:opacity-100">Bron qilish →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="bg-linear-to-b from-neutral-900 to-neutral-950">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-500">
            Avtoservis
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Mashinangiz ishonchli qo&apos;llarda
          </h1>
          <p className="mt-5 max-w-xl text-lg opacity-70">
            Moy almashtirishdan dvigatel ta&apos;mirigacha. Navbatni onlayn oling va navbatda
            turib vaqt yo&apos;qotmang.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/bron"
              className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-400"
            >
              Navbat olish
            </Link>
            <Link
              href="/xizmatlar"
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold hover:border-orange-500"
            >
              Xizmatlar va narxlar
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Xizmatlar</h2>
        <p className="mb-8 mt-1 opacity-70">Mashhur xizmatlar va narxlari</p>
        <Suspense fallback={<p className="opacity-70">Yuklanmoqda...</p>}>
          <ServicesPreview />
        </Suspense>
        <div className="mt-6">
          <Link href="/xizmatlar" className="text-orange-500 underline">
            Barcha xizmatlar →
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-neutral-900">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-8 text-3xl font-bold">Nega biz</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title}>
                <div className="mb-3 h-1 w-10 rounded bg-orange-500" />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm opacity-70">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-3xl font-bold">3 qadamda navbat oling</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-white/10 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-black">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm opacity-70">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="mb-6 text-3xl font-bold">Ko&apos;p so&apos;raladigan savollar</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="rounded-xl border border-white/10 bg-neutral-900 p-4">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-3 text-sm opacity-70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-2xl bg-orange-500 p-8 text-black sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">Navbatni hoziroq oling</h2>
            <p className="mt-1 opacity-80">Bir daqiqada, telefon qilmasdan.</p>
          </div>
          <Link
            href="/bron"
            className="mt-4 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white sm:mt-0"
          >
            Navbat olish
          </Link>
        </div>
      </section>
    </>
  );
}
