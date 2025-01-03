import { db } from "../index";
import { systemPrompts  } from "../schema"; // Adjust the path to your schema file

const seedSystemPrompts = async () => {
  try {
    await db.insert(systemPrompts).values([
      {
        prompt: "Act as a cracked mathematician and solve the given operation / equation : respond directly by providing the result and write it with numbers not letters",
        iq_aspect: "Mathematical Capacity",
      },
      {
        prompt: "Act as a very cultured history phd holder and give the exact answers for this history question, and remeber: history is all about giving the exact information as it is mentioned in the ressources, so be careful and give the exact answer", 
        iq_aspect: "Historical Knowledge",
      },
      {
        prompt: "You are a very creative person, you have a strong capacity of solving enigmas, try to focus on the following problem and give an accurate answer given all the elements of the problem",
        iq_aspect: "Enigmas Solving",
      },
    ]);

    console.log("System prompts seeded successfully!");
  } catch (error) {
    console.error("Error seeding system prompts:", error);
  }
};

seedSystemPrompts();