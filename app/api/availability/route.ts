import { prisma } from "../../../lib/prisma";

const TZ = "+05:00"; // O'zbekiston vaqti
const STEP_MIN = 30; // slotlar har 30 daqiqada

const toDate = (date: string, time: string) =>
  new Date(`${date}T${time}:00${TZ}`);

const toTime = (d: Date) =>
  d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tashkent",
  });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = Number(searchParams.get("serviceId"));
  const date = searchParams.get("date"); // 2026-11-17

  if (!serviceId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "serviceId va date kerak" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.isActive) {
    return Response.json({ error: "Xizmat topilmadi" }, { status: 404 });
  }

  const bays = await prisma.bay.findMany({ where: { isActive: true } });

  const dayStart = toDate(date, "00:00");
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      status: { not: "CANCELLED" },
      startAt: { lt: dayEnd },
      endAt: { gt: dayStart },
    },
  });

  const now = new Date();
  const durationMs = service.durationMin * 60 * 1000;
  const slots = new Map<string, number[]>(); // vaqt -> bo'sh postlar

  for (const bay of bays) {
    const open = toDate(date, bay.openTime).getTime();
    const close = toDate(date, bay.closeTime).getTime();
    const bayBookings = bookings.filter((b) => b.bayId === bay.id);

    for (let s = open; s + durationMs <= close; s += STEP_MIN * 60 * 1000) {
      const e = s + durationMs;
      if (s <= now.getTime()) continue; // o'tib ketgan vaqt

      const busy = bayBookings.some(
        (b) => b.startAt.getTime() < e && b.endAt.getTime() > s
      );
      if (busy) continue;

      const key = toTime(new Date(s));
      slots.set(key, [...(slots.get(key) ?? []), bay.id]);
    }
  }

  const result = [...slots.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, bayIds]) => ({ time, bayIds }));

  return Response.json({
    service: { id: service.id, name: service.name, durationMin: service.durationMin },
    date,
    slots: result,
  });
}