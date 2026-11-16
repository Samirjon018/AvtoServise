import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  await prisma.service.createMany({
    data: [
      { name: "Moy almashtirish", price: 150000, durationMin: 30 },
      { name: "Kompyuter diagnostikasi", price: 100000, durationMin: 60 },
      { name: "Tormoz kolodkasini almashtirish", price: 200000, durationMin: 90 },
      { name: "G'ildirak balansirovkasi", price: 120000, durationMin: 45 },
      { name: "Dvigatelni ta'mirlash", price: 1500000, durationMin: 240 },
    ],
  });

  await prisma.bay.createMany({
    data: [
      { name: "Post 1" },
      { name: "Post 2" },
      { name: "Post 3", openTime: "10:00", closeTime: "17:00" },
    ],
  });

  console.log("Seed tayyor");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());