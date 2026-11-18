"use client";

import { useState, type FormEvent } from "react";

type Service = { id: number; name: string; price: number; durationMin: number };
type Slot = { time: string; bayIds: number[] };

const input =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900";

const money = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function BookingForm({ services }: { services: Service[] }) {
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    carBrand: "",
    carModel: "",
    plateNumber: "",
    note: "",
  });

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  async function loadSlots(sId: number | null, d: string) {
    setTime("");
    if (!sId || !d) {
      setSlots([]);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/availability?serviceId=${sId}&date=${d}`);
    const data = await res.json();
    setSlots(res.ok ? data.slots : []);
    setLoading(false);
  }

  function pickService(id: number) {
    setServiceId(id);
    setMessage(null);
    loadSlots(id, date);
  }

  function pickDate(d: string) {
    setDate(d);
    setMessage(null);
    loadSlots(serviceId, d);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, date, time, ...form }),
    });
    const data = await res.json();

    if (res.ok) {
      setMessage({
        type: "ok",
        text: `Bron qabul qilindi: ${date}, ${time}, ${data.booking.bay.name}. Kutib qolamiz!`,
      });
    } else {
      setMessage({ type: "error", text: data.error ?? "Xatolik yuz berdi" });
    }
    loadSlots(serviceId, date);
  }

  const setField = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mt-8 space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">1. Xizmatni tanlang</h2>
        <div className="grid gap-2">
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => pickService(s.id)}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left ${
                serviceId === s.id
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-gray-300 hover:border-orange-500"
              }`}
            >
              <span>
                {s.name}
                <span className="block text-sm opacity-70">{s.durationMin} daqiqa</span>
              </span>
              <span className="font-semibold">{money(s.price)} so&apos;m</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">2. Sanani tanlang</h2>
        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) => pickDate(e.target.value)}
          suppressHydrationWarning
          className={input}
        />
      </section>

      {serviceId && date && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">3. Vaqtni tanlang</h2>
          {loading ? (
            <p className="opacity-70">Yuklanmoqda...</p>
          ) : slots.length === 0 ? (
            <p className="opacity-70">Bu kunda bo&apos;sh vaqt yo&apos;q. Boshqa sanani tanlang.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  onClick={() => setTime(s.time)}
                  className={`rounded-lg border px-2 py-2 text-sm ${
                    time === s.time
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-gray-300 hover:border-orange-500"
                  }`}
                >
                  {s.time}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {time && (
        <form onSubmit={submit} className="space-y-3">
          <h2 className="text-lg font-semibold">4. Ma&apos;lumotlaringiz</h2>
          <input required placeholder="Ismingiz" className={input}
            value={form.customerName} onChange={(e) => setField("customerName", e.target.value)} />
          <input required type="tel" placeholder="Telefon: +998 90 123 45 67" className={input}
            value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Mashina markasi (Chevrolet)" className={input}
              value={form.carBrand} onChange={(e) => setField("carBrand", e.target.value)} />
            <input required placeholder="Modeli (Gentra)" className={input}
              value={form.carModel} onChange={(e) => setField("carModel", e.target.value)} />
          </div>
          <input required placeholder="Davlat raqami (01A123BC)" className={input}
            value={form.plateNumber} onChange={(e) => setField("plateNumber", e.target.value)} />
          <textarea placeholder="Izoh (ixtiyoriy)" rows={2} className={input}
            value={form.note} onChange={(e) => setField("note", e.target.value)} />
          <button type="submit"
            className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600">
            Bron qilish
          </button>
        </form>
      )}

      {message && (
        <p className={`rounded-lg p-4 ${
          message.type === "ok" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

