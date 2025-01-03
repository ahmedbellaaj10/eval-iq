import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/index";
import { systemPrompts } from "@/db/schema";
import { sql } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await db
      .select({ iq_aspect: sql`DISTINCT ${systemPrompts.iq_aspect}` })
      .from(systemPrompts)
      .execute();

    // Map the result to a simple array of IQ aspects
    const iqAspects = data.map((row) => row.iq_aspect);

    res.status(200).json(iqAspects);
  } catch (error) {
    console.error("Error fetching IQ aspects:", error);
    res.status(500).json({ error: "Failed to retrieve IQ aspects" });
  }
}
