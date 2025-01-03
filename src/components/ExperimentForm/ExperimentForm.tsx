import React, { useState, useEffect } from "react";
import axios from "axios";

const ExperimentForm = () => {
  const [llms, setLlms] = useState([]);
  const [systemPrompts, setSystemPrompts] = useState([]);
  const [iqAspects, setIqAspects] = useState([]); // IQ Aspects state
  const [selectedIQAspect, setSelectedIQAspect] = useState("");
  const [filteredPrompts, setFilteredPrompts] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const iqResponse = await axios.get("/api/system-prompts/iq-aspects"); // Fetch IQ aspects
        const promptResponse = await axios.get("/api/system-prompts"); // Fetch system prompts
        const llmResponse = await axios.get("/api/llms"); // Fetch LLMs

        setIqAspects(iqResponse.data); // Populate IQ aspects dropdown
        setSystemPrompts(promptResponse.data); // Populate system prompts
        setLlms(llmResponse.data); // Populate LLM dropdown
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter system prompts based on selected IQ aspect
  useEffect(() => {
    const filtered = systemPrompts.filter(
      (prompt) => prompt.iq_aspect === selectedIQAspect
    );
    setFilteredPrompts(filtered);
  }, [selectedIQAspect, systemPrompts]);

  const handleSubmit = () => {
    console.log("Selected IQ Aspect:", selectedIQAspect);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h3 className="font-bold text-lg mb-4">Create Experiment</h3>

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
      <select className="w-full mb-4 p-2 border rounded">
        <option value="">Select LLM</option>
        {llms.map((llm: any) => (
          <option key={llm.id} value={llm.id}>
            {llm.name}
          </option>
        ))}
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Submit
      </button>

      {/* Display System Prompts Below the Form */}
      {selectedIQAspect && filteredPrompts.length > 0 && (
        <div className="mt-6">
          <h4 className="font-bold text-lg mb-2">
            System Prompt for {selectedIQAspect}:
          </h4>
          <div className="list-disc list-inside">
            {filteredPrompts.map((prompt: any) => (
              <div key={prompt.id} className="mb-2">
                {prompt.prompt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentForm;
