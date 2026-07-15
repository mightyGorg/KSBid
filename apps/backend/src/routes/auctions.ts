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
      data: {
        status: "CLOSED",
      },
    });
  }

  return item;
};

const createWinningBid = async (
  tx: any,
  itemId: string,
  userId: string,
  amount: number,
) => {
  const bid = await tx.bid.create({
    data: {
      itemId,
      userId,
      amount,
    },
  });

  await tx.item.update({
    where: { id: itemId },
    data: {
      winningBidId: bid.id,
    },
  });

  return bid;
};

itemsRouter.get("/", async (_req, res) => {
  await prisma.item.updateMany({
    where: {
      status: "OPEN",
      closesAt: {
        lte: new Date(),
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

  res.json(
    items.map((item) => ({
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
    })),
  );
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

itemsRouter.post("/:id/bid", async (req: any, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;
  const { amount } = req.body;

  if (!Number.isInteger(amount) || amount <= 0) {
    return res.status(400).json({
      message: "Invalid bid amount",
    });
  }

  try {
    const bid = await prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({
        where: {
          id: itemId,
        },
        include: {
          winningBid: true,
        },
      });

      if (!item) {
        throw new Error("Item not found");
      }

      if (item.status !== "OPEN") {
        throw new Error("Auction is closed");
      }

      if (item.closesAt <= new Date()) {
        await tx.item.update({
          where: { id: item.id },
          data: {
            status: "CLOSED",
          },
        });

        throw new Error("Auction has expired");
      }

      const bidder = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!bidder) {
        throw new Error("User not found");
      }

      const currentWinningBid = item.winningBid;

      const minimumAllowed = currentWinningBid
        ? currentWinningBid.amount + 1
        : item.minimumBid;

      if (amount < minimumAllowed) {
        throw new Error(`Minimum bid is ${minimumAllowed}`);
      }

      if (!currentWinningBid) {
        if (bidder.points < amount) {
          throw new Error("Insufficient points");
        }

        await tx.user.update({
          where: { id: bidder.id },
          data: {
            points: {
              decrement: amount,
            },
          },
        });

        return createWinningBid(tx, itemId, userId, amount);
      }

      if (currentWinningBid.userId === bidder.id) {
        const delta = amount - currentWinningBid.amount;

        if (bidder.points < delta) {
          throw new Error("Insufficient points");
        }

        await tx.user.update({
          where: {
            id: bidder.id,
          },
          data: {
            points: {
              decrement: delta,
            },
          },
        });

        return createWinningBid(tx, itemId, userId, amount);
      }

      const previousLeader = await tx.user.findUnique({
        where: {
          id: currentWinningBid.userId,
        },
      });

      if (!previousLeader) {
        throw new Error("Previous leader not found");
      }

      if (bidder.points < amount) {
        throw new Error("Insufficient points");
      }

      await tx.user.update({
        where: {
          id: previousLeader.id,
        },
        data: {
          points: {
            increment: currentWinningBid.amount,
          },
        },
      });

      await tx.user.update({
        where: {
          id: bidder.id,
        },
        data: {
          points: {
            decrement: amount,
          },
        },
      });

      return createWinningBid(tx, itemId, userId, amount);
    });

    res.json(bid);
  } catch (error: any) {
    res.status(400).json({
      message: error.message ?? "Failed to place bid",
    });
  }
});
