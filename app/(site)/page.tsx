import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "../../lib/prisma";

const money = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const FIRST = 9 * 60; // jadval 09:00 dan boshlanadi
const CELLS = 18; // 18 ta yarim soat: 09:00 dan 18:00 gacha
const STEP = 30;

type State = "free" | "busy" | "closed" | "past";

const CELL: Record<State, string> = {
  free: "bg-signal",
  busy: "bg-[#3d566a]",
  past: "bg-white/10",
  closed: "border border-dashed border-white/20",
};

const features = [
  { title: "Telefon qilish shart emas", text: "Vaqtni o'zingiz tanlaysiz, ustaxona bandligi shu yerning o'zida ko'rinib turadi." },
  { title: "Narx va vaqt oldindan ma'lum", text: "Har bir xizmatning narxi va qancha davom etishi ro'yxatda yozilgan." },
  { title: "Vaqt faqat sizniki", text: "Siz tanlagan vaqt band bo'ladi, boshqa mijoz uni ololmaydi." },
  { title: "Bron darhol yetib boradi", text: "Navbat olishingiz bilan xodimlarga xabar tushadi." },
];

const steps = [
  { title: "Xizmatni tanlang", text: "Narxnomadan kerakli xizmatni bosing." },
  { title: "Vaqtni belgilang", text: "Sana va sariq bilan ko'rsatilgan bo'sh vaqtlardan birini tanlang." },
  { title: "Ma'lumot qoldiring", text: "Ism, telefon va mashina ma'lumotini yozing. Bron tayyor." },
];

const faqs = [
  { q: "Navbatni qanday olaman?", a: "Xizmat, sana va vaqtni tanlaysiz, so'ng ism, telefon va mashina ma'lumotini qoldirasiz. Bron shu zahoti qabul qilinadi." },
  { q: "Bronni bekor qilsam bo'ladimi?", a: "Ha, telefon yoki Telegram orqali xabar bering. Vaqt boshqa mijozga bo'shatiladi." },
  { q: "Narxlar aniqmi?", a: "Saytda xizmatning asosiy narxi ko'rsatilgan. Mashina holatiga qarab usta ish boshlashdan oldin siz bilan kelishadi." },
  { q: "Qaysi mashinalar bilan ishlaysiz?", a: "Yengil avtomobillarning ko'p markalari bilan. Aniq savol bo'lsa, qo'ng'iroq qiling." },
];

async function Board() {
  await connection();

  const now = new Date();
  const day = now.toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" });
  const dayStart = new Date(`${day}T00:00:00+05:00`).getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;

  const [bays, bookings] = await Promise.all([
    prisma.bay.findMany({ where: { isActive: true }, orderBy: { id: "asc" } }),
    prisma.booking.findMany({
      where: {
        status: { not: "CANCELLED" },
        startAt: { lt: new Date(dayEnd) },
        endAt: { gt: new Date(dayStart) },
      },
    }),
  ]);

  let freeCells = 0;
  const lanes = bays.map((bay) => {
    const open = toMin(bay.openTime);
    const close = toMin(bay.closeTime);

    const cells: State[] = Array.from({ length: CELLS }, (_, i) => {
      const m = FIRST + i * STEP;
      const s = dayStart + m * 60000;
      const e = s + STEP * 60000;

      if (m < open || m + STEP > close) return "closed";
      const busy = bookings.some(
        (b) => b.bayId === bay.id && b.startAt.getTime() < e && b.endAt.getTime() > s
      );
      if (busy) return "busy";
      if (e <= now.getTime()) return "past";
      freeCells++;
      return "free";
    });

    return { id: bay.id, name: bay.name, cells };
  });

  const [, mm, dd] = day.split("-");
  const label = `${Number(dd)}-${MONTHS[Number(mm) - 1]}`;
  const hours = String(freeCells / 2).replace(".", ",");

  return (
    <div className="rounded-xl bg-panel p-5 text-white sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl font-bold">Bugungi ish jadvali</h2>
        <span className="text-white/60">{label}</span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-[3.5rem_1fr] gap-3 text-xs text-white/50">
          <span />
          <div className="relative h-4">
            {[0, 6, 12, 18].map((i) => (
              <span
                key={i}
                className="absolute first:translate-x-0 last:-translate-x-full [&:not(:first-child):not(:last-child)]:-translate-x-1/2"
                style={{ left: `${(i / CELLS) * 100}%` }}
              >
                {String(9 + i / 2).padStart(2, "0")}:00
              </span>
            ))}
          </div>
        </div>

        {lanes.map((lane) => (
          <div key={lane.id} className="grid grid-cols-[3.5rem_1fr] items-center gap-3">
            <span className="text-sm text-white/80">{lane.name}</span>
            <div
              className="grid gap-0.5"
              style={{ gridTemplateColumns: `repeat(${CELLS}, minmax(0, 1fr))` }}
            >
              {lane.cells.map((c, i) => (
                <div key={i} className={`h-9 ${CELL[c]}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
        <span className="flex items-center gap-2"><i className={`h-3 w-3 ${CELL.free}`} />Bo&apos;sh</span>
        <span className="flex items-center gap-2"><i className={`h-3 w-3 ${CELL.busy}`} />Band</span>
        <span className="flex items-center gap-2"><i className={`h-3 w-3 ${CELL.past}`} />O&apos;tib ketgan</span>
        <span className="flex items-center gap-2"><i className={`h-3 w-3 ${CELL.closed}`} />Yopiq</span>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
        <p className="text-white/80">
          {freeCells > 0
            ? `Bugun postlarda jami ${hours} soat bo'sh`
            : "Bugun bo'sh vaqt qolmadi. Ertangi kunni tanlang."}
        </p>
        <Link href="/bron" className="rounded-md bg-signal px-4 py-2 font-semibold text-ink">
          Vaqt tanlash
        </Link>
      </div>
    </div>
  );
}

async function PriceList() {
  await connection();
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  return (
    <ul className="border-t border-line">
      {services.map((s) => (
        <li key={s.id} className="border-b border-line">
          <Link
            href={`/bron?service=${s.id}`}
            className="group -mx-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 px-3 py-4 hover:bg-paper"
          >
            <span className="text-lg font-semibold group-hover:underline">{s.name}</span>
            <span className="text-steel">{s.durationMin} daqiqa</span>
            <span className="mx-2 hidden flex-1 border-b border-dotted border-steel/50 sm:block" />
            <span className="ml-auto font-display text-2xl font-bold">
              {money(s.price)} so&apos;m
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <h1 className="font-display text-6xl font-extrabold leading-[0.95] sm:text-7xl">
            Mashinangizga navbat bir daqiqada
          </h1>
          <p className="mt-6 max-w-md text-lg text-steel">
            Moy almashtirishdan dvigatel ta&apos;mirigacha. Ustaxonaning bugungi
            bandligini o&apos;zingiz ko&apos;rib, qulay vaqtni tanlang.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/bron"
              className="rounded-md bg-ink px-6 py-3 text-lg font-semibold text-white hover:bg-panel"
            >
              Navbat olish
            </Link>
            <Link href="/xizmatlar" className="text-lg underline underline-offset-4">
              Narxlarni ko&apos;rish
            </Link>
          </div>
        </div>

        <Suspense fallback={<div className="h-80 rounded-xl bg-panel" />}>
          <Board />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-4xl font-bold">Narxnoma</h2>
        <p className="mb-6 mt-1 text-steel">Xizmatni bossangiz, bron sahifasi ochiladi.</p>
        <Suspense fallback={<p className="text-steel">Yuklanmoqda...</p>}>
          <PriceList />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-4xl font-bold">Qanday ishlaydi</h2>
        <ol className="mt-6 grid divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {steps.map((s, i) => (
            <li key={s.title} className="py-6 sm:px-6 sm:first:pl-0">
              <span className="font-display text-6xl font-bold text-steel/40">{i + 1}</span>
              <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
              <p className="mt-1 text-steel">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_2fr]">
        <h2 className="font-display text-4xl font-bold">Nega bizni tanlashadi</h2>
        <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title}>
              <dt className="font-display text-2xl font-bold">{f.title}</dt>
              <dd className="mt-1 text-steel">{f.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="mb-6 font-display text-4xl font-bold">Savollar</h2>
        <div className="border-t border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="ml-4 text-2xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-4 text-steel">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4">
        <div className="rounded-xl bg-panel p-8 text-white sm:flex sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="font-display text-4xl font-bold">Bugunga joy bor</h2>
            <p className="mt-1 text-white/70">Vaqtni tanlash bir daqiqa oladi.</p>
          </div>
          <Link
            href="/bron"
            className="mt-5 inline-block rounded-md bg-signal px-6 py-3 text-lg font-semibold text-ink sm:mt-0"
          >
            Navbat olish
          </Link>
        </div>
      </section>
    </>
  );
}
