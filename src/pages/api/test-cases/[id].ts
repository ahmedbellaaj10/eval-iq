import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/index";
import { testCases } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { prompt, expected_output, system_prompt_id } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid ID parameter" });
    }

    try {
      await db
        .update(testCases)
        .set({
          prompt,
          expected_output,
          system_prompt_id,
        })
        .where(eq(testCases.id, Number(id)))
        .execute();

      return res.status(200).json({ message: "Test case updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update test case" });
    }
  }
  
  if (req.method === "DELETE") {
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid ID parameter" });
    }

    try {
      await db.delete(testCases).where(eq(testCases.id, Number(id))).execute();
      return res.status(200).json({ message: "Test case deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete test case" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}