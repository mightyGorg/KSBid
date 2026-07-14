import { Router } from "express";
import { prisma } from "../prisma";
import { EvidenceStatus } from "../../prisma/generated/prisma/enums";

export const evidenceRouter = Router();

const REVISABLE: EvidenceStatus[] = ["DRAFT", "CHANGES_REQUESTED", "APPROVED"];
const EDITABLE: EvidenceStatus[] = ["DRAFT", "CHANGES_REQUESTED"];

evidenceRouter.get("/evidence", async (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ error: "Authentication required" });

  const evidence = await prisma.evidence.findMany({
    where: { userId },
    include: { ksb: true },
    orderBy: { submittedAt: "desc" },
  });

  res.json(evidence);
});

evidenceRouter.post("/evidence", async (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ error: "Authentication required" });

  const { title, description, ksbId } = req.body || {};

  if (!ksbId || !title || !description)
    return res.status(400).json({ error: "all fields are required" });

  const evidence = await prisma.evidence.create({
    data: { userId, ksbId, title, description },
  });
  res.status(201).json(evidence);
});

evidenceRouter.patch("/evidence/:id", async (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ error: "Authentication required" });

  const existing = await prisma.evidence.findUnique({
    where: { id: req.params.id },
  });
  if (!existing || existing.userId !== userId)
    return res.status(404).json({ error: "Evidence not found" });
  if (!REVISABLE.includes(existing.status))
    return res
      .status(400)
      .json({ error: "this evidence can no longer be edited" });

  const status = existing.status === "APPROVED" ? "DRAFT" : existing.status;
  const { title, description, ksbId } = req.body || {};

  const updated = await prisma.evidence.update({
    where: { id: existing.id },
    data: { title, description, ksbId, status },
  });
  res.json(updated);
});

evidenceRouter.delete("/evidence/:id", async (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ error: "Authentication required" });

  const existing = await prisma.evidence.findUnique({
    where: { id: req.params.id },
  });
  if (!existing || existing.userId !== userId)
    return res.status(404).json({ error: "Evidence not found" });
  if (existing.status !== "DRAFT")
    return res.status(400).json({ error: "Only drafts can be deleted" });

  await prisma.evidence.delete({ where: { id: existing.id } });
  res.status(204).end();
});

evidenceRouter.post("/evidence/:id/submit", async (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ error: "Authentication required" });

  const result = await prisma.evidence.updateMany({
    where: { id: req.params.id, userId, status: { in: EDITABLE } },
    data: { status: "SUBMITTED", submittedAt: new Date() },
  });
  if (result.count === 0)
    return res.status(400).json({ error: "Evidence cannot be submitted" });

  const evidence = await prisma.evidence.findUnique({
    where: { id: req.params.id },
  });
  res.json(evidence);
});
