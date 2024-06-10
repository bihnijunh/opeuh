// pages/api/balance.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    try {
      const balance = await prisma.balance.findUnique({
        where: { userId: userId as string },
      });

      if (!balance) {
        return res.status(404).json({ error: 'Balance not found' });
      }

      return res.status(200).json(balance);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}