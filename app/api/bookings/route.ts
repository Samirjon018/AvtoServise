import { prisma } from "../../../lib/prisma";

const TZ = "+05:00";

const toDate = (date: string, time: string) =>
  new Date(`${date}T${time}:00${TZ}`);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON noto'g'ri" }, { status: 400 });
  }

  const serviceId = Number(body.serviceId);
  const date = String(body.date ?? "");
  const time = String(body.time ?? "");
  const customerName = String(body.customerName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const carBrand = String(body.carBrand ?? "").trim();
  const carModel = String(body.carModel ?? "").trim();
  const plateNumber = String(body.plateNumber ?? "").trim().toUpperCase();
  const note = body.note ? String(body.note).trim() : null;

  if (
    !serviceId ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^\d{2}:\d{2}$/.test(time) ||
    !customerName ||
    phone.replace(/\D/g, "").length < 9 ||
    !carBrand ||
    !carModel ||
    !plateNumber
  ) {
    return Response.json({ error: "Ma'lumotlar to'liq emas" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.isActive) {
    return Response.json({ error: "Xizmat topilmadi" }, { status: 404 });
  }

  const startAt = toDate(date, time);
  if (isNaN(startAt.getTime()) || startAt.getTime() <= Date.now()) {
    return Response.json({ error: "Vaqt noto'g'ri yoki o'tib ketgan" }, { status: 400 });
  }
  const endAt = new Date(startAt.getTime() + service.durationMin * 60 * 1000);

  const booking = await prisma.$transaction(async (tx) => {
    const bays = await tx.bay.findMany({ where: { isActive: true } });

    for (const bay of bays) {
      const open = toDate(date, bay.openTime);
      const close = toDate(date, bay.closeTime);
      if (startAt < open || endAt > close) continue;

      const clash = await tx.booking.findFirst({
        where: {
          bayId: bay.id,
          status: { not: "CANCELLED" },
          startAt: { lt: endAt },
          endAt: { gt: startAt },
        },
      });
      if (clash) continue;

      return tx.booking.create({
        data: {
          customerName,
          phone,
          carBrand,
          carModel,
          plateNumber,
          note,
          startAt,
          endAt,
          serviceId: service.id,
          bayId: bay.id,
        },
        include: { service: true, bay: true },
      });
    }
    return null;
  });

  if (!booking) {
    return Response.json(
      { error: "Bu vaqt band, boshqa vaqt tanlang" },
      { status: 409 }
    );
  }

  return Response.json({ booking }, { status: 201 });
}
