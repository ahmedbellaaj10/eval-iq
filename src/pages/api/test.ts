import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../db';
import { llms } from '../../db/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await db.select().from(llms);
  res.status(200).json({ llms: data });
}
