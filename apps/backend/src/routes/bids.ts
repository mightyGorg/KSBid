import { Router } from 'express'
import { prisma } from '../prisma'

const bidsRouter = Router()

bidsRouter.get("/", async (_, res) => {
  const bids = await prisma.bid.findMany()
  res.json(bids)
})

bidsRouter.post('/', async(req, res) => {
  const { bid } = req.body
  const item = await prisma.item.findUnique({
    where: {
      id: bid.itemId
    }
  }) 
  const { _max: max_bid } = await prisma.bid.aggregate({
    _max: {
      amount: true
    }, 
    where: {
      itemId: bid.itemId
    }
  })

  const new_bid = await prisma.bid.create({
    data: bid
  })

  if (max_bid.amount == null) {
    await prisma.item.update({
      where: {
        id: item.id,
      },
      data: {
        winningBidId: new_bid.id
      }
    })
  }
  else if (bid.amount > max_bid.amount) {
    await prisma.item.update({
      where: { id: item.id },
      data: { winningBidId: new_bid.id }
    })
  } 

  res.json({ message: "ok" })
})




