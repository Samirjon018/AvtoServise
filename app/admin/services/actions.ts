"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/session";

function readFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const durationMin = Number(formData.get("durationMin"));
  const description = String(formData.get("description") ?? "").trim();

  if (!name || name.length > 100) return null;
  if (!Number.isInteger(price) || price < 0 || price > 100000000) return null;
  if (!Number.isInteger(durationMin) || durationMin < 5 || durationMin > 600) return null;

  return { name, price, durationMin, description: description || null };
}

export async function createService(formData: FormData) {
  if (!(await getSession())) return;
  const data = readFields(formData);
  if (!data) return;

  await prisma.service.create({ data: { ...data, isActive: true } });
  revalidatePath("/", "layout");
}

export async function updateService(formData: FormData) {
  if (!(await getSession())) return;
  const id = Number(formData.get("id"));
  const data = readFields(formData);
  if (!id || !data) return;

  await prisma.service.update({
    where: { id },
    data: { ...data, isActive: formData.get("isActive") === "on" },
  });
  revalidatePath("/", "layout");
}