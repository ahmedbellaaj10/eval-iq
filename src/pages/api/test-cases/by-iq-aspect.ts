import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/index";
import { testCases, systemPrompts } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { iqAspect } = req.query;

    if (!iqAspect || typeof iqAspect !== "string") {
      return res.status(400).json({ error: "IQ Aspect is required and must be a string" });
    }

    try {
      // Fetch the IDs of system prompts that match the IQ aspect
      const promptIds = await db
        .select({ id: systemPrompts.id })
        .from(systemPrompts)
        .where(eq(systemPrompts.iq_aspect, iqAspect))
        .execute();

      const ids = promptIds.map((prompt) => prompt.id);

      // If no matching system prompts are found, return an empty array
      if (ids.length === 0) {
        return res.status(200).json([]);
      }

      // Fetch test cases where `system_prompt_id` is in the retrieved IDs
      const data = await db
        .select()
        .from(testCases)
        .where(inArray(testCases.system_prompt_id, ids))
        .execute();

      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch test cases by IQ aspect" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
