import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "../lib/prisma";
import BookingForm from "./BookingForm";

async function Booking() {
  await connection();

  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  return (
    <BookingForm
      services={services.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        durationMin: s.durationMin,
      }))}
    />
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Avtoservis</h1>
      <p className="mt-1 opacity-70">
        Onlayn navbat: xizmat va qulay vaqtni tanlang
      </p>
      <Suspense fallback={<p className="mt-8 opacity-70">Yuklanmoqda...</p>}>
        <Booking />
      </Suspense>
    </main>
  );
}
