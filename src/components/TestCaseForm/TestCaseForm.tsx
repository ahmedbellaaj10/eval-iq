import React, { useState } from "react";
import axios from "axios";

const TestCaseForm = ({ onSubmit }: { onSubmit: Function }) => {
  const [prompt, setPrompt] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [systemPromptId, setSystemPromptId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/test-cases", {
        prompt,
        expected_output: expectedOutput,
        system_prompt_id: Number(systemPromptId),
      });
      onSubmit();
    } catch (error) {
      console.error("Error adding test case:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h3 className="font-bold mb-4">Add New Test Case</h3>
      <input
        type="text"
        placeholder="Prompt"
        className="w-full mb-2 p-2 border"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <input
        type="text"
        placeholder="Expected Output"
        className="w-full mb-2 p-2 border"
        value={expectedOutput}
        onChange={(e) => setExpectedOutput(e.target.value)}
      />
      <input
        type="number"
        placeholder="System Prompt ID"
        className="w-full mb-2 p-2 border"
        value={systemPromptId}
        onChange={(e) => setSystemPromptId(e.target.value)}
      />
      <button className="bg-blue-600 text-white p-2 rounded" type="submit">
        Add Test Case
      </button>
    </form>
  );
};

export default TestCaseForm;
