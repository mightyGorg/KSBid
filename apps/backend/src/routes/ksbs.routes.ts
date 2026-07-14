import {prisma} from "../prisma"
import { Router } from "express";

export const ksbsRouter = Router()

ksbsRouter.get("/ksbs", async (req, res) => {
    const type = req.query.type
    const where = type ? { type } : {};

    const ksbs = await prisma.ksb.findMany({where, orderBy: { code: "asc"}})
    res.json(ksbs)
});