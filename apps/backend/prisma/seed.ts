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

const sampleKsbs = [
  {
    code: "K1",
    type: "KNOWLEDGE" as const,
    description: "Understand core principles of secure software development.",
  },
  {
    code: "K2",
    type: "KNOWLEDGE" as const,
    description: "Explain database normalization and indexing strategies.",
  },
  {
    code: "S1",
    type: "SKILL" as const,
    description: "Implement REST API endpoints with validation and error handling.",
  },
  {
    code: "S2",
    type: "SKILL" as const,
    description: "Write automated tests for service and route layers.",
  },
  {
    code: "B1",
    type: "BEHAVIOUR" as const,
    description: "Communicate technical trade-offs clearly with stakeholders.",
  },
  {
    code: "B2",
    type: "BEHAVIOUR" as const,
    description: "Take ownership of code quality and continuous improvement.",
  },
];

async function main() {
  for (const ksb of sampleKsbs) {
    await prisma.ksb.upsert({
      where: { code: ksb.code },
      update: {
        type: ksb.type,
        description: ksb.description,
      },
      create: ksb,
    });
  }

  console.log(`Seeded ${sampleKsbs.length} KSB records`);

  const passwordHash = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      passwordHash,
      role: "USER",
    },
  });

  console.log("Seeded test user: test@example.com / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
