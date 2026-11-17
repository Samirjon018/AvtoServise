import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const login = process.env.ADMIN_LOGIN;
  const password = process.env.ADMIN_PASSWORD;
  if (!login || !password || password.length < 8) {
    console.error("ADMIN_LOGIN va kamida 8 belgili ADMIN_PASSWORD kerak");
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.upsert({
    where: { login },
    update: { passwordHash },
    create: { login, passwordHash },
  });
  console.log(`Admin tayyor: ${login}`);
}

main().finally(() => prisma.$disconnect());
