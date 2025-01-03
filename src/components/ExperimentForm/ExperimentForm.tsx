import React, { useState, useEffect } from "react";
import axios from "axios";

const ExperimentForm = () => {
    const [llms, setLlms] = useState([]);
    const [systemPrompts, setSystemPrompts] = useState([]);
    const [selectedLlm, setSelectedLlm] = useState("");
    const [selectedSystemPrompt, setSelectedSystemPrompt] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const llmResponse = await axios.get("/api/llms");
          const promptResponse = await axios.get("/api/system-prompts");
          setLlms(llmResponse.data);
          setSystemPrompts(promptResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);
  
    const handleSubmit = () => {
      console.log("Selected LLM:", selectedLlm);
      console.log("Selected System Prompt:", selectedSystemPrompt);
    };
  
    return (
      <div className="p-4 bg-white shadow-md rounded-md">
        <h3 className="font-bold text-lg mb-4">Create Experiment</h3>
        <select
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setSelectedLlm(e.target.value)}
        >
          <option value="">Select LLM</option>
          {llms.map((llm: any) => (
            <option key={llm.id} value={llm.id}>
              {llm.name}
            </option>
          ))}
        </select>
        <select
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setSelectedSystemPrompt(e.target.value)}
        >
          <option value="">Select System Prompt</option>
          {systemPrompts.map((prompt: any) => (
            <option key={prompt.id} value={prompt.id}>
              {prompt.prompt}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    );
  };

export default ExperimentForm;
