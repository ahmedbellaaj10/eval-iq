import React, { useState, useEffect } from "react";
import axios from "axios";

const ExperimentForm = () => {
  const [llms, setLlms] = useState([]);
  const [iqAspects, setIqAspects] = useState([]);
  const [systemPrompts, setSystemPrompts] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [selectedIQAspect, setSelectedIQAspect] = useState("");
  const [selectedLlm, setSelectedLlm] = useState("");
  const [selectedSystemPrompt, setSelectedSystemPrompt] = useState<any>(null);
  const [experiment, setExperiment] = useState<any>(null);
  const [filteredTestCases, setFilteredTestCases] = useState([]);
  const [selectedTestCase, setSelectedTestCase] = useState("");

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

  // Update the system prompt when the IQ aspect is selected
  useEffect(() => {
    const prompt = systemPrompts.find(
      (prompt: any) => prompt.iq_aspect === selectedIQAspect
    );
    setSelectedSystemPrompt(prompt || null);

    // Filter test cases based on the selected IQ aspect
    const filtered = testCases.filter(
      (testCase: any) => testCase.iq_aspect === selectedIQAspect
    );
    setFilteredTestCases(filtered);
  }, [selectedIQAspect, systemPrompts, testCases]);

  const handleLoadExperiment = async () => {
    if (!selectedLlm || !selectedSystemPrompt) {
      alert("Please select both IQ Aspect and LLM.");
      return;
    }

    try {
      // Fetch or load the experiment
      const response = await axios.get("/api/experiments", {
        params: {
          llm_id: selectedLlm,
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
        value={selectedLlm}
        onChange={(e) => setSelectedLlm(e.target.value)}
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
    </div>
  );
};

export default ExperimentForm;
