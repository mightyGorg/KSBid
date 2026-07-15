import { prisma } from "../prisma";
import { Router } from "express";

export const itemsRouter = Router()

itemsRouter.get('/', async (request, response) => {
  console.log(request)
  const items = await prisma.item.findMany()
  console.log(items)
  response.json(items) 
})

itemsRouter.get('/:item', async (request, response) => {
  const { id } = request.params
  const { item } = await prisma.item.findUnique(id)
  response.json(item) 
})
