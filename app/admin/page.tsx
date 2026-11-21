import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getSession } from "../../lib/session";
import { logout } from "./actions";
import { setStatus, deleteBooking } from "./booking-actions";

const LABELS: Record<string, string> = {
  NEW: "Yangi",
  CONFIRMED: "Tasdiqlangan",
  IN_PROGRESS: "Bajarilmoqda",
  DONE: "Tugadi",
  CANCELLED: "Bekor qilingan",
};

const COLORS: Record<string, string> = {
  NEW: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  DONE: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-200 text-gray-700",
};

const fmt = (d: Date) =>
  d.toLocaleString("en-GB", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ all?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { all } = await searchParams;

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Tashkent",
  });
  const todayStart = new Date(`${today}T00:00:00+05:00`);

  const bookings = await prisma.booking.findMany({
    where: all ? {} : { startAt: { gte: todayStart } },
    include: { service: true, bay: true },
    orderBy: { startAt: "asc" },
  });

  const newCount = bookings.filter((b) => b.status === "NEW").length;

  return (
    <>
      <div className="flex items-center justify-between">
       <div className="flex items-center gap-4">
  <h1 className="text-2xl font-bold">Bronlar</h1>
  <Link href="/admin/services" className="text-blue-600 underline">
    Xizmatlar va narxlar
  </Link>
</div>
        <form action={logout}>
          <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            Chiqish
          </button>
        </form>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <span>
          Jami: <b>{bookings.length}</b>, yangi: <b>{newCount}</b>
        </span>
        {all ? (
          <Link href="/admin" className="text-blue-600 underline">
            Faqat bugundan keyingilar
          </Link>
        ) : (
          <Link href="/admin?all=1" className="text-blue-600 underline">
            Barcha bronlar
          </Link>
        )}
      </div>

      {bookings.length === 0 ? (
        <p className="mt-8 opacity-70">Hozircha bronlar yo&apos;q.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-lg border border-gray-300 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">
                  #{b.id} · {fmt(b.startAt)} · {b.bay.name}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${COLORS[b.status]}`}>
                  {LABELS[b.status]}
                </span>
              </div>

              <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                <div>🔧 {b.service.name}</div>
                <div>👤 {b.customerName}</div>
                <div>
                  🚙 {b.carBrand} {b.carModel}, {b.plateNumber}
                </div>
                <div>
                  📞{" "}
                  <a href={`tel:${b.phone}`} className="text-blue-600 underline">
                    {b.phone}
                  </a>
                </div>
                {b.note && <div className="sm:col-span-2">📝 {b.note}</div>}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <form action={setStatus} className="flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={b.id} />
                  {Object.keys(LABELS)
                    .filter((s) => s !== b.status)
                    .map((s) => (
                      <button
                        key={s}
                        name="status"
                        value={s}
                        className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:border-blue-500"
                      >
                        {LABELS[s]}
                      </button>
                    ))}
                </form>
                {b.status === "CANCELLED" && (
                  <form action={deleteBooking}>
                    <input type="hidden" name="id" value={b.id} />
                    <button className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
                      O&apos;chirish
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ all?: string }>;
}) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Suspense fallback={<p className="opacity-70">Yuklanmoqda...</p>}>
        <Dashboard searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
