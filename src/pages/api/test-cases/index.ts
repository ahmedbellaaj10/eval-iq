import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/index";
import { testCases, systemPrompts } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { iqAspect } = req.query;

      let query = db.select().from(testCases);

      if (iqAspect) {
        // Fetch system_prompt_ids for the given IQ aspect
        const promptIds = await db
          .select({ id: systemPrompts.id })
          .from(systemPrompts)
          .where(eq(systemPrompts.iq_aspect, iqAspect))
          .execute();

        const ids = promptIds.map((prompt) => prompt.id);

        // Filter test cases by system_prompt_id
        query = query.where(inArray(testCases.system_prompt_id, ids));
      }

      const data = await query.execute();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching test cases:", error);
      return res.status(500).json({ error: "Failed to fetch test cases" });
    }
  }

  if (req.method === "POST") {
    try {
      const { prompt, expected_output, system_prompt_id } = req.body;

      if (!prompt || !expected_output || !system_prompt_id) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const newTestCase = await db
        .insert(testCases)
        .values({ prompt, expected_output, system_prompt_id })
        .returning();

      return res.status(201).json(newTestCase);
    } catch (error) {
      console.error("Error adding test case:", error);
      return res.status(500).json({ error: "Failed to add test case" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
