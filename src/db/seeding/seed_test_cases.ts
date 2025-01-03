import { db } from "../index";
import { testCases  } from "../schema"; // Adjust the path to your schema file

const seedTestCases = async () => {
  try {
    await db.insert(testCases).values([
      { prompt: "What is 2 + 2?", expected_output: "4", system_prompt_id: 1 },
      { prompt: "Solve for x in the equation: 3x^2 - 12x + 9 = 0.", expected_output: "x = 1 or x = 3", system_prompt_id: 1 },
      { prompt: "Who was the first president of the United States?", expected_output: "George Washington", system_prompt_id: 2 },
      { prompt: "What were the main treaties signed during the Peace of Westphalia in 1648, and what were their impacts on the political landscape of Europe?", expected_output: "The Treaties of Münster and Osnabrück ended the Thirty Years' War and established principles of modern state sovereignty.", system_prompt_id: 2 },
      { prompt: "Alisson's mother has three kids: the oldest one is Leo, the other is Max. What is the name of the 3rd kid?", expected_output: "Alisson", system_prompt_id: 3 },
      { prompt: "You see a boat filled with people. It hasn’t sunk, but when you look again, you don’t see a single person. Why?", expected_output: "All the people were married.", system_prompt_id: 3 },
    ]);

    console.log("Test cases seeded successfully!");
  } catch (error) {
    console.error("Error seeding test cases:", error);
  }
};

seedTestCases();
