"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { getSession } from "../../lib/session";

const STATUSES = ["NEW", "CONFIRMED", "IN_PROGRESS", "DONE", "CANCELLED"] as const;
type Status = (typeof STATUSES)[number];

export async function setStatus(formData: FormData) {
  if (!(await getSession())) return;
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!id || !STATUSES.includes(status as Status)) return;

  await prisma.booking.update({
    where: { id },
    data: { status: status as Status },
  });
  revalidatePath("/admin");
}

export async function deleteBooking(formData: FormData) {
  if (!(await getSession())) return;
  const id = Number(formData.get("id"));
  if (!id) return;

  // faqat bekor qilingan bronni o'chirish mumkin
  await prisma.booking.deleteMany({ where: { id, status: "CANCELLED" } });
  revalidatePath("/admin");
}
