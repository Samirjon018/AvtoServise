import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/session";
import { createService, updateService } from "./actions";

const input =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900";
const label = "mb-1 block text-sm opacity-70";

async function ServicesAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const services = await prisma.service.findMany({ orderBy: { id: "asc" } });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Xizmatlar va narxlar</h1>
        <Link href="/admin" className="text-blue-600 underline">
          Bronlarga qaytish
        </Link>
      </div>

      <section className="mt-6 rounded-lg border border-gray-300 p-4">
        <h2 className="mb-3 font-semibold">Yangi xizmat qo&apos;shish</h2>
        <form action={createService} className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label}>Nomi</label>
            <input name="name" required maxLength={100} className={input} />
          </div>
          <div>
            <label className={label}>Narxi (so&apos;m)</label>
            <input name="price" type="number" min={0} required className={input} />
          </div>
          <div>
            <label className={label}>Davomiyligi (daqiqa)</label>
            <input name="durationMin" type="number" min={5} max={600} required className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Tavsif (ixtiyoriy)</label>
            <textarea name="description" rows={2} className={input} />
          </div>
          <div className="sm:col-span-2">
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
              Qo&apos;shish
            </button>
          </div>
        </form>
      </section>

      <div className="mt-8 space-y-4">
        {services.map((s) => (
          <form
            key={s.id}
            action={updateService}
            className={`grid gap-3 rounded-lg border border-gray-300 p-4 sm:grid-cols-2 ${
              s.isActive ? "" : "opacity-60"
            }`}
          >
            <input type="hidden" name="id" value={s.id} />
            <div className="sm:col-span-2">
              <label className={label}>Nomi</label>
              <input name="name" defaultValue={s.name} required maxLength={100} className={input} />
            </div>
            <div>
              <label className={label}>Narxi (so&apos;m)</label>
              <input name="price" type="number" min={0} defaultValue={s.price} required className={input} />
            </div>
            <div>
              <label className={label}>Davomiyligi (daqiqa)</label>
              <input name="durationMin" type="number" min={5} max={600} defaultValue={s.durationMin} required className={input} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Tavsif</label>
              <textarea name="description" rows={2} defaultValue={s.description ?? ""} className={input} />
            </div>
            <div className="flex items-center justify-between sm:col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" defaultChecked={s.isActive} />
                Saytda ko&apos;rinsin
              </label>
              <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                Saqlash
              </button>
            </div>
          </form>
        ))}
      </div>
    </>
  );
}

export default function AdminServicesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Suspense fallback={<p className="opacity-70">Yuklanmoqda...</p>}>
        <ServicesAdmin />
      </Suspense>
    </main>
  );
}