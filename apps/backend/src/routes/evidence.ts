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
