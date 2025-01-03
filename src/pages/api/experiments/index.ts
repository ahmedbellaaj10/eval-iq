import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/index";
import { experiments } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { llm_id, system_prompt_id } = req.query;

    if (!llm_id || !system_prompt_id) {
      return res.status(400).json({ error: "LLM ID and System Prompt ID are required" });
    }

    try {
      // Fetch the experiment
      const experiment = await db
        .select()
        .from(experiments)
        .where(
          and(
            eq(experiments.llm_id, Number(llm_id)),
            eq(experiments.system_prompt_id, Number(system_prompt_id))
          )
        )
        .execute();

      if (experiment.length === 0) {
        return res.status(404).json({ error: "Experiment not found" });
      }

      return res.status(200).json(experiment[0]);
    } catch (error) {
      console.error("Error fetching experiment:", error);
      return res.status(500).json({ error: "Failed to fetch experiment" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
