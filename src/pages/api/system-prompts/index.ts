import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/index";
import { systemPrompts } from "@/db/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = await db.select().from(systemPrompts).execute();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch system prompts" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}