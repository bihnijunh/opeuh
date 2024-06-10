import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: userId as string },
    });

    if (!transactions.length) {
      return res.status(404).json({ error: 'No transactions found' });
    }

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ error: 'Something went wrong', details: (error as Error).message });
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return GET(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}