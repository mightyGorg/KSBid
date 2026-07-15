import { Router } from "express";
import { prisma } from "../prisma";

export const meRouter = Router();

const PROFILE = {
  id: true,
  email: true,
  name: true,
  role: true,
  points: true,
  lifetimePoints: true,
  avatar: true,
} as const;

meRouter.get("/me", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    select: PROFILE,
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

meRouter.patch("/me", async (req, res) => {
  const { name } = req.body || {};

  if (name === undefined || !name.trim())
    return res.status(400).json({ error: "name cannot be empty" });

  const user = await prisma.user.update({
    where: { id: req.user?.id },
    data: { name: name.trim() },
    select: PROFILE,
  });
  res.json(user);
});
