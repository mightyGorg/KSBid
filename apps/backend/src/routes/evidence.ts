import { prisma } from "../prisma";
import { Router } from "express";

export const evidenceRouter = Router();

evidenceRouter.get("/evidence", async (req, res) => {
  const evidence = await prisma.evidence.findMany({
    where: { userId: req.user?.id },
    include: { ksb: true },
    orderBy: { submittedAt: "desc" },
  });

  res.json(evidence);
});

evidenceRouter.post("/evidence", async (req, res) => {
  const { ksbId, title, description } = (req.body || {}) as { ksbId: string; title: string; description: string };

  if (!ksbId || !title || !description)
    throw new Error("all fields are required");

  const evidence = await prisma.evidence.create({
    data: { userId: req.user?.id, ksbId, title, description },
  });

  res.status(201).json(evidence);
});
