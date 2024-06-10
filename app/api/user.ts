import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const userId = typeof req.query.id === 'string' ? req.query.id : undefined;

  if (!userId) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      balance: true
    }
  })
  res.json(user)
} 