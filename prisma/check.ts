import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log(await prisma.service.findMany());
  console.log(await prisma.bay.findMany());
}

main().finally(() => prisma.$disconnect());