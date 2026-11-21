import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "../../../lib/prisma";
import BookingForm from "./BookingForm";

export const metadata = { title: "Navbat olish" };

type Params = Promise<{ service?: string }>;

async function Booking({ searchParams }: { searchParams: Params }) {
  await connection();
  const { service } = await searchParams;

  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  const wanted = Number(service);
  const initial = services.some((s) => s.id === wanted) ? wanted : null;

  return (
    <BookingForm
      key={initial ?? "none"}
      initialServiceId={initial}
      services={services.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        durationMin: s.durationMin,
      }))}
    />
  );
}

export default function BronPage({ searchParams }: { searchParams: Params }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-5xl font-extrabold">Navbat olish</h1>
      <p className="mt-2 text-steel">Xizmat va qulay vaqtni tanlang.</p>
      <Suspense fallback={<p className="mt-8 text-steel">Yuklanmoqda...</p>}>
        <Booking searchParams={searchParams} />
      </Suspense>
    </section>
  );
}