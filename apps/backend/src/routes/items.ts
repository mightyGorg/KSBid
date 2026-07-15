import { Router } from "express";
import { prisma } from "../prisma";

export const itemsRouter = Router();

const closeExpiredItem = async (itemId: string) => {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (item && item.status === "OPEN" && item.closesAt <= new Date()) {
    return prisma.item.update({
      where: { id: item.id },
      data: { status: "CLOSED" },
    });
  }

  return item;
};

itemsRouter.get("/", async (_, res) => {
  const now = new Date();

  await prisma.item.updateMany({
    where: {
      status: "OPEN",
      closesAt: {
        lte: now,
      },
    },
    data: {
      status: "CLOSED",
    },
  });

  const items = await prisma.item.findMany({
    include: {
      winningBid: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      closesAt: "asc",
    },
  });

  const response = items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
    status: item.status,
    minimumBid: item.minimumBid,
    closesAt: item.closesAt,
    currentBid: item.winningBid?.amount ?? null,
    leader: item.winningBid?.user ?? null,
    nextMinimumBid: (item.winningBid?.amount ?? item.minimumBid - 1) + 1,
  }));

  res.json(response);
});

itemsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  await closeExpiredItem(id);

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      winningBid: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!item) {
    return res.status(404).json({
      message: "Item not found",
    });
  }

  res.json({
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
    status: item.status,
    minimumBid: item.minimumBid,
    closesAt: item.closesAt,

    currentBid: item.winningBid?.amount ?? null,

    leader: item.winningBid?.user ?? null,

    nextMinimumBid: (item.winningBid?.amount ?? item.minimumBid - 1) + 1,

    winner: item.status === "CLOSED" ? (item.winningBid?.user ?? null) : null,

    winningAmount:
      item.status === "CLOSED" ? (item.winningBid?.amount ?? null) : null,
  });
});
