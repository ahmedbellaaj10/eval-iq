import { db } from "@/db/index";
import { experiments, llms, systemPrompts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const seedExperiments = async () => {
  try {
    // Fetch all LLMs and System Prompts
    const allLlms = await db.select().from(llms).execute();
    const allSystemPrompts = await db.select().from(systemPrompts).execute();

    // Generate combinations of LLMs and System Prompts
    const combinations = allLlms.flatMap((llm: any) =>
      allSystemPrompts.map((prompt: any) => ({
        llm_id: llm.id,
        system_prompt_id: prompt.id,
        aggregate_score: null, // Initial aggregate score is null
      }))
    );

    // Insert combinations into experiments table, avoiding duplicates
    for (const combination of combinations) {
      const existingExperiment = await db
        .select()
        .from(experiments)
        .where(
          and(
            eq(experiments.llm_id, combination.llm_id),
            eq(experiments.system_prompt_id, combination.system_prompt_id)
          )
        )
        .execute();

      if (existingExperiment.length === 0) {
        await db.insert(experiments).values(combination).execute();
      }
    }

    console.log("Experiments table seeded successfully!");
  } catch (error) {
    console.error("Error seeding experiments table:", error);
  }
};

// Run the seed script
seedExperiments();
