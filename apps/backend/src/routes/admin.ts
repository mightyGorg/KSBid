import { Router } from "express";
import { prisma } from "../prisma";

export const adminRouter = Router();

const VALID_DECISIONS = ["APPROVED", "CHANGES_REQUESTED", "REJECTED"];

adminRouter.use((req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
});

adminRouter.get("/queue", async (req, res) => {
  const queue = await prisma.evidence.findMany({
    where: { status: "SUBMITTED" },
    include: {
      ksb: true,
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
    orderBy: { submittedAt: "asc" },
  });
  res.json(queue);
});

adminRouter.post("/evidence/:id/review", async (req, res) => {
  const { decision, feedback, points } = req.body || {};

  const reviewed = await prisma.$transaction(async (tx) => {
    const evidence = await tx.evidence.findUnique({
      where: { id: req.params.id },
    });
    if (!evidence || evidence.status !== "SUBMITTED")
      throw Object.assign(
        new Error("evidecence has already been reviewed or is unavailable"),
        { statusCode: 409 },
      );

    const requested =
      decision === "APPROVED" ? Math.max(0, Number(points) || 0) : 0;
    if (decision === "APPROVED" && !evidence.rewarded && requested <= 0)
      throw Object.assign(
        new Error("Approved evidence requires positive points"),
        { statusCode: 400 },
      );

    const reward = evidence.rewarded ? 0 : requested;

    await tx.evidence.update({
      where: { id: evidence.id },
      data: {
        status: decision,
        feedback: feedback ?? null,
        reviewedById: req.user.id,
        ...(evidence.rewarded ? {} : { pointsAwarded: reward }),
        rewarded: evidence.rewarded || reward > 0,
      },
    });

    if (reward > 0) {
      await tx.user.update({
        where: { id: evidence.userId },
        data: {
          points: { increment: reward },
          lifetimePoints: { increment: reward },
        },
      });
    }

    return tx.evidence.findUnique({
      where: { id: evidence.id },
      include: {
        ksb: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  });

  res.json(reviewed);
});
