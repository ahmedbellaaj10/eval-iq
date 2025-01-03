import { db } from "../index";
import { llms } from "../schema"; // Adjust the path to your schema file

const seedLLMs = async () => {
  try {
    await db.insert(llms).values([
      {
        name: "Llama v3.1",
        provider: "Fireworks",
        description: "Advanced open-source LLM for creative tasks.",
      },
      {
        name: "Mistral Large",
        provider: "Mistral",
        description: "Lightweight model for reasoning and translations.",
      },
    ]);

    console.log("LLMs seeded successfully!");
  } catch (error) {
    console.error("Error seeding LLMs:", error);
  }
};

seedLLMs();