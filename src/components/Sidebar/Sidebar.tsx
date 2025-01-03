import React, { useState, useEffect } from "react";
import axios from "axios";

const Sidebar = ({ onSelectTestCase, onFilterIQ }: { onSelectTestCase: Function; onFilterIQ: Function }) => {
    const [testCases, setTestCases] = useState([]);
    const [iqAspect, setIqAspect] = useState("");
  
    const fetchTestCases = async () => {
      try {
        const response = await axios.get("/api/test-cases", { params: { iqAspect } });
        setTestCases(response.data);
      } catch (error) {
        console.error("Error fetching test cases:", error);
      }
    };
  
    useEffect(() => {
      fetchTestCases();
    }, [iqAspect]);
  
    return (
      <aside className="w-1/4 bg-gray-100 h-screen p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Test Cases</h2>
        <select
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setIqAspect(e.target.value)}
        >
          <option value="">Filter by IQ Aspect</option>
          <option value="Mathematical">Mathematical</option>
          <option value="Historical">Historical</option>
          <option value="Enigmas">Enigmas</option>
        </select>
        <ul>
          {testCases.map((testCase: any) => (
            <li
              key={testCase.id}
              className="p-2 mb-2 bg-white border rounded cursor-pointer hover:bg-gray-200"
              onClick={() => onSelectTestCase(testCase)}
            >
              {testCase.prompt}
            </li>
          ))}
        </ul>
      </aside>
    );
  };

export default Sidebar;
