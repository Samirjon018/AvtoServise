"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { createSession, destroySession } from "../../lib/session";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const loginName = String(formData.get("login") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const admin = await prisma.admin.findUnique({ where: { login: loginName } });
  const ok = admin ? await bcrypt.compare(password, admin.passwordHash) : false;

  if (!admin || !ok) return { error: "Login yoki parol noto'g'ri" };

  await createSession(admin.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
