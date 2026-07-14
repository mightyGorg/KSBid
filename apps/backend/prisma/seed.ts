import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { prisma } from '../src/prisma';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

async function main() {
  // -------------------------
  // USERS
  // -------------------------
  await prisma.user.createMany({
    data: [
      {
        id: "11111111-1111-1111-1111-111111111111",
        email: "alice@example.com",
        name: "Alice",
        passwordHash: "hash1",
        points: 10,
        lifetimePoints: 10,
        role: "USER",
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        email: "bob@example.com",
        name: "Bob",
        passwordHash: "hash2",
        points: 20,
        lifetimePoints: 20,
        role: "ADMIN",
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        email: "carol@example.com",
        name: "Carol",
        passwordHash: "hash3",
        points: 5,
        lifetimePoints: 5,
        role: "USER",
      },
      {
        id: "44444444-4444-4444-4444-444444444444",
        email: "dave@example.com",
        name: "Dave",
        passwordHash: "hash4",
        points: 15,
        lifetimePoints: 15,
        role: "USER",
      },
      {
        id: "55555555-5555-5555-5555-555555555555",
        email: "eve@example.com",
        name: "Eve",
        passwordHash: "hash5",
        points: 0,
        lifetimePoints: 0,
        role: "USER",
      },
    ],
    skipDuplicates: true,
  });

  // -------------------------
  // KSB
  // -------------------------
  await prisma.ksb.createMany({
    data: [
      {
        id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
        code: "KSB001",
        type: "KNOWLEDGE",
        description: "Understands core concepts",
      },
      {
        id: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
        code: "KSB002",
        type: "SKILL",
        description: "Able to perform tasks",
      },
      {
        id: "aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
        code: "KSB003",
        type: "BEHAVIOUR",
        description: "Shows good behaviour",
      },
      {
        id: "aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4",
        code: "KSB004",
        type: "KNOWLEDGE",
        description: "Understands advanced topics",
      },
      {
        id: "aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaa5",
        code: "KSB005",
        type: "SKILL",
        description: "Demonstrates proficiency",
      },
    ],
    skipDuplicates: true,
  });

  // -------------------------
  // EVIDENCE
  // -------------------------
  await prisma.evidence.createMany({
    data: [
      {
        id: "eeeeeee1-eeee-eeee-eeee-eeeeeeeeeee1",
        userId: "11111111-1111-1111-1111-111111111111",
        ksbId: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
        title: "Evidence 1",
        description: "Description 1",
      },
      {
        id: "eeeeeee2-eeee-eeee-eeee-eeeeeeeeeee2",
        userId: "22222222-2222-2222-2222-222222222222",
        ksbId: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
        title: "Evidence 2",
        description: "Description 2",
        feedback: "Good job",
        pointsAwarded: 5,
        rewarded: true,
        submittedAt: new Date("2024-01-01T10:00:00Z"),
        reviewedById: "33333333-3333-3333-3333-333333333333",
      },
      {
        id: "eeeeeee3-eeee-eeee-eeee-eeeeeeeeeee3",
        userId: "33333333-3333-3333-3333-333333333333",
        ksbId: "aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
        title: "Evidence 3",
        description: "Description 3",
      },
      {
        id: "eeeeeee4-eeee-eeee-eeee-eeeeeeeeeee4",
        userId: "44444444-4444-4444-4444-444444444444",
        ksbId: "aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4",
        title: "Evidence 4",
        description: "Description 4",
        feedback: "Needs improvement",
        pointsAwarded: 2,
        submittedAt: new Date("2024-02-01T12:00:00Z"),
        reviewedById: "22222222-2222-2222-2222-222222222222",
      },
      {
        id: "eeeeeee5-eeee-eeee-eeee-eeeeeeeeeee5",
        userId: "55555555-5555-5555-5555-555555555555",
        ksbId: "aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaa5",
        title: "Evidence 5",
        description: "Description 5",
      },
    ],
    skipDuplicates: true,
  });

  // -------------------------
  // ITEMS (valid UUIDs!)
  // -------------------------
  await prisma.item.createMany({
    data: [
      {
        id: "10000000-0000-0000-0000-000000000001",
        name: "Item 1",
        description: "Desc 1",
        minimumBid: 1,
        closesAt: new Date("2025-01-01T12:00:00Z"),
        status: "OPEN",
        kind: "PHYSICAL",
      },
      {
        id: "10000000-0000-0000-0000-000000000002",
        name: "Item 2",
        description: "Desc 2",
        minimumBid: 5,
        closesAt: new Date("2025-01-02T12:00:00Z"),
        status: "OPEN",
        kind: "DIGITAL",
      },
      {
        id: "10000000-0000-0000-0000-000000000003",
        name: "Item 3",
        description: "Desc 3",
        minimumBid: 10,
        closesAt: new Date("2025-01-03T12:00:00Z"),
        status: "CLOSED",
        kind: "PHYSICAL",
      },
      {
        id: "10000000-0000-0000-0000-000000000004",
        name: "Item 4",
        description: "Desc 4",
        minimumBid: 2,
        closesAt: new Date("2025-01-04T12:00:00Z"),
        status: "OPEN",
        kind: "DIGITAL",
      },
      {
        id: "10000000-0000-0000-0000-000000000005",
        name: "Item 5",
        description: "Desc 5",
        minimumBid: 3,
        closesAt: new Date("2025-01-05T12:00:00Z"),
        status: "CANCELLED",
        kind: "PHYSICAL",
      },
    ],
    skipDuplicates: true,
  });

  // -------------------------
  // BIDS (valid UUIDs)
  // -------------------------
  await prisma.bid.createMany({
    data: [
      {
        id: "20000000-0000-0000-0000-000000000001",
        itemId: "10000000-0000-0000-0000-000000000001",
        userId: "11111111-1111-1111-1111-111111111111",
        amount: 5,
        placedAt: new Date("2025-01-01T13:00:00Z"),
      },
      {
        id: "20000000-0000-0000-0000-000000000002",
        itemId: "10000000-0000-0000-0000-000000000002",
        userId: "22222222-2222-2222-2222-222222222222",
        amount: 6,
        placedAt: new Date("2025-01-02T13:00:00Z"),
      },
      {
        id: "20000000-0000-0000-0000-000000000003",
        itemId: "10000000-0000-0000-0000-000000000003",
        userId: "33333333-3333-3333-3333-333333333333",
        amount: 12,
        placedAt: new Date("2025-01-03T13:00:00Z"),
      },
      {
        id: "20000000-0000-0000-0000-000000000004",
        itemId: "10000000-0000-0000-0000-000000000004",
        userId: "44444444-4444-4444-4444-444444444444",
        amount: 3,
        placedAt: new Date("2025-01-04T13:00:00Z"),
      },
      {
        id: "20000000-0000-0000-0000-000000000005",
        itemId: "10000000-0000-0000-0000-000000000005",
        userId: "55555555-5555-5555-5555-555555555555",
        amount: 4,
        placedAt: new Date("2025-01-05T13:00:00Z"),
      },
    ],
    skipDuplicates: true,
  });

  // -------------------------
  // SET WINNING BID
  // -------------------------
  await prisma.item.update({
    where: { id: "10000000-0000-0000-0000-000000000003" },
    data: { winningBidId: "20000000-0000-0000-0000-000000000003" },
  });

  console.log("Seed completed successfully");
}


main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
