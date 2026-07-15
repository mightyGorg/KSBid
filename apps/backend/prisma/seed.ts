import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const PASSWORD = "password123";

const users = [
  { email: "admin@ksbid.dev", name: "Admin User", role: "ADMIN" as const },
  { email: "user@ksbid.dev", name: "Test User", role: "USER" as const },
];

const ksbs = [
  {
    code: "K1",
    type: "KNOWLEDGE" as const,
    description: "TO DO.",
  },
  {
    code: "K2",
    type: "KNOWLEDGE" as const,
    description: "TO DO.",
  },
  {
    code: "S1",
    type: "SKILL" as const,
    description: "TO DO.",
  },
  {
    code: "S2",
    type: "SKILL" as const,
    description: "TO DO.",
  },
  {
    code: "B1",
    type: "BEHAVIOUR" as const,
    description: "TO DO.",
  },
  {
    code: "B2",
    type: "BEHAVIOUR" as const,
    description: "TO DO.",
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role },
      create: { ...user, passwordHash },
    });
  }

  for (const ksb of ksbs) {
    await prisma.ksb.upsert({
      where: { code: ksb.code },
      update: { type: ksb.type, description: ksb.description },
      create: ksb,
    });
  }

  await prisma.item.deleteMany();

  await prisma.item.createMany({
    data: [
      {
        name: "Some avatar",
        description: "A mystery reward.",
        imageUrl: "http://localhost:5173/KSBid-signature.png",
        minimumBid: 50,
        kind: "DIGITAL",
        status: "OPEN",
        closesAt: new Date("2026-12-31T23:59:59Z"),
      },
      {
        name: "Anotha avatar",
        description: "A premium mystery reward.",
        imageUrl: "http://localhost:5173/KSBid-signature-2.png",
        minimumBid: 150,
        kind: "DIGITAL",
        status: "OPEN",
        closesAt: new Date("2026-12-31T23:59:59Z"),
      },
      {
        name: "Avatar 3",
        description: "A special mystery reward.",
        imageUrl: "http://localhost:5173/Wallpaper.png",
        minimumBid: 300,
        kind: "DIGITAL",
        status: "OPEN",
        closesAt: new Date("2026-12-31T23:59:59Z"),
      },
      {
        name: "Avatarrrrr",
        description: "A special mystery reward.",
        imageUrl: "http://localhost:5173/Wallpaper-2.png",
        minimumBid: 300,
        kind: "DIGITAL",
        status: "OPEN",
        closesAt: new Date("2026-12-31T23:59:59Z"),
      },
    ],
  });

  console.log(
    `Seeded ${users.length} users, ${ksbs.length} KSBs and 3 auction items`,
  );
  console.log(`Login with admin@ksbid.dev or user@ksbid.dev / ${PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
