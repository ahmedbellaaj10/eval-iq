import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import dotenv from "dotenv";
dotenv.config();

const ExperimentForm = () => {
  const [llms, setLlms] = useState([]);
  const [iqAspects, setIqAspects] = useState([]);
  const [systemPrompts, setSystemPrompts] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [selectedIQAspect, setSelectedIQAspect] = useState("");
  const [selectedLlm, setSelectedLlm] = useState<any>(null); // Store both id and name
  const [selectedSystemPrompt, setSelectedSystemPrompt] = useState<any>(null);
  const [experiment, setExperiment] = useState<any>(null);
  const [filteredTestCases, setFilteredTestCases] = useState<any[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState("");
  const [experimentResult, setExperimentResult] = useState<any>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const iqResponse = await axios.get("/api/system-prompts/iq-aspects");
        const promptResponse = await axios.get("/api/system-prompts");
        const llmResponse = await axios.get("/api/llms");
        const testCaseResponse = await axios.get("/api/test-cases");
        setIqAspects(iqResponse.data);
        setSystemPrompts(promptResponse.data);
        setLlms(llmResponse.data);
        setTestCases(testCaseResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Update system prompt and filter test cases when IQ aspect changes
  useEffect(() => {
    const prompt = systemPrompts.find(
      (prompt: any) => prompt.iq_aspect === selectedIQAspect
    );
    setSelectedSystemPrompt(prompt || null);

    // Filter test cases based on system_prompt_id
    if (prompt) {
      const filtered = testCases.filter(
        (testCase: any) => testCase.system_prompt_id === prompt.id
      );
      setFilteredTestCases(filtered);
    } else {
      setFilteredTestCases([]);
    }
  }, [selectedIQAspect, systemPrompts, testCases]);

  const handleLoadExperiment = async () => {
    if (!selectedLlm || !selectedSystemPrompt) {
      alert("Please select both IQ Aspect and LLM.");
      return;
    }

    try {
      const response = await axios.get("/api/experiments", {
        params: {
          llm_id: selectedLlm.id, // Use LLM ID for fetching experiment
          system_prompt_id: selectedSystemPrompt.id,
        },
      });
      setExperiment(response.data);
      alert("Experiment loaded successfully!");
    } catch (error) {
      console.error("Error fetching experiment:", error);
      alert("Failed to fetch experiment. Please try again.");
    }
  };

  const handleRunExperiment = async () => {
    if (!experiment || !selectedTestCase) {
      alert("Please select an experiment and a test case before running.");
      return;
    }
  
    try {
      const testCase = filteredTestCases.find(
        (tc) => tc.id === Number(selectedTestCase)
      );
  
      if (!testCase) {
        alert("Invalid test case selected.");
        return;
      }
  
      const messages = [
        { role: "system", content: selectedSystemPrompt.prompt },
        { role: "user", content: testCase.prompt },
      ];
  
      let apiEndpoint = "";
  
      if (selectedLlm.name === "Llama v3.1") {
        apiEndpoint = "/api/fireworks"; // Route for Llama
      } else if (selectedLlm.name === "Mistral Large") {
        apiEndpoint = "/api/mistral"; // Route for Mistral
      } else {
        alert("Unsupported LLM selected.");
        return;
      }
  
      const response = await axios.post(apiEndpoint, {
        model:
          selectedLlm.name === "Llama v3.1"
            ? "accounts/fireworks/models/llama-v3p1-70b-instruct"
            : "mistral-large-latest",
        messages,
      });
  
      if (response.status === 200 && response.data) {
        setExperimentResult({
          expected: testCase.expected_output,
          generated: response.data.choices[0]?.message?.content || "No response",
        });
        alert("Experiment run successfully!");
      } else {
        alert("Failed to get a valid response from the API.");
      }
    } catch (error) {
      console.error("Error running experiment:", error);
      alert("Failed to run experiment. Please try again.");
    }
  };
  
  
  

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h3 className="font-bold text-lg mb-4">Select Experiment</h3>

      {/* IQ Aspect Dropdown */}
      <select
        className="w-full mb-4 p-2 border rounded"
        value={selectedIQAspect}
        onChange={(e) => setSelectedIQAspect(e.target.value)}
      >
        <option value="">Select IQ Aspect</option>
        {iqAspects.map((aspect: string) => (
          <option key={aspect} value={aspect}>
            {aspect}
          </option>
        ))}
      </select>

      {/* LLM Dropdown */}
      <select
        className="w-full mb-4 p-2 border rounded"
        value={selectedLlm?.id || ""}
        onChange={(e) => {
          const selected = llms.find((llm: any) => llm.id === Number(e.target.value));
          setSelectedLlm(selected || null);
        }}
      >
        <option value="">Select LLM</option>
        {llms.map((llm: any) => (
          <option key={llm.id} value={llm.id}>
            {llm.name}
          </option>
        ))}
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleLoadExperiment}
      >
        Load From Database
      </button>

      {/* Display Selected System Prompt */}
      {selectedSystemPrompt && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h4 className="font-bold text-lg mb-2">Selected System Prompt:</h4>
          <p>{selectedSystemPrompt.prompt}</p>
        </div>
      )}

      {/* Test Case Dropdown */}
      {experiment && (
        <div className="mt-6">
          <h4 className="font-bold text-lg mb-2">Select Test Case:</h4>
          <select
            className="w-full mb-4 p-2 border rounded"
            value={selectedTestCase}
            onChange={(e) => setSelectedTestCase(e.target.value)}
          >
            <option value="">Select Test Case</option>
            {filteredTestCases.map((testCase: any) => (
              <option key={testCase.id} value={testCase.id}>
                {testCase.prompt}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Run Experiment Button */}
      {experiment && selectedTestCase && (
        <div className="mt-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleRunExperiment}
          >
            Run Experiment
          </button>
        </div>
      )}

      {/* Experiment Results */}
      {experimentResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h4 className="font-bold text-lg mb-2">Experiment Result:</h4>
          <p>
            <strong>Expected Response:</strong> {experimentResult.expected}
          </p>
          <p>
            <strong>Generated Response:</strong> {experimentResult.generated}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExperimentForm;
