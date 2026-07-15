import "dotenv/config";
<<<<<<< Updated upstream
import { PrismaClient } from "./generated/prisma/client";
=======
<<<<<<< HEAD
import { Pool } from "pg";
>>>>>>> Stashed changes
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

  console.log(`Seeded ${users.length} users and ${ksbs.length} KSBs`);
  console.log(`Login with admin@ksbid.dev or user@ksbid.dev / ${PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
<<<<<<< Updated upstream
=======
    await pool.end();
    process.exit(1);
=======
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

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
    type: "BEHAVIOR" as const,
    description: "Communicate technical trade-offs clearly with stakeholders.",
  },
  {
    code: "B2",
    type: "BEHAVIOR" as const,
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
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
>>>>>>> origin
>>>>>>> Stashed changes
  });
