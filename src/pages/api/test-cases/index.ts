import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/index";
import { testCases } from "@/db/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = await db.select().from(testCases).execute();
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch test cases" });
    }
  }
  
  if (req.method === "POST") {
    const { prompt, expected_output, system_prompt_id } = req.body;

    if (!prompt || !expected_output || !system_prompt_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await db.insert(testCases).values({ prompt, expected_output, system_prompt_id }).execute();
      return res.status(201).json({ message: "Test case added successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to add test case" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}