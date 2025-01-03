import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineEllipsis, AiOutlinePlus } from "react-icons/ai";
import "./Sidebar.css";

const Sidebar = ({ onSelectTestCase }: { onSelectTestCase: Function }) => {
  const [testCases, setTestCases] = useState([]);
  const [iqAspects, setIqAspects] = useState([]);
  const [iqAspect, setIqAspect] = useState(""); // Selected IQ Aspect for filtering
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTestCase, setCurrentTestCase] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [iqAspectField, setIqAspectField] = useState(""); // IQ Aspect in modal
  const [systemPromptId, setSystemPromptId] = useState<number | null>(null); // System prompt ID for the test case
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Fetch all test cases or filtered by IQ Aspect
  const fetchTestCases = async () => {
    try {
      const response = await axios.get("/api/test-cases", {
        params: { iqAspect }, // Filter by IQ Aspect if selected
      });
      const sortedTestCases = response.data.sort((a: any, b: any) => a.id - b.id); // Sort by ID
      setTestCases(sortedTestCases);
    } catch (error) {
      console.error("Error fetching test cases:", error);
    }
  };

  // Fetch all IQ aspects
  const fetchIQAspects = async () => {
    try {
      const response = await axios.get("/api/system-prompts/iq-aspects");
      setIqAspects(response.data);
    } catch (error) {
      console.error("Error fetching IQ aspects:", error);
    }
  };

  // Add a new test case
  const handleAdd = async (newTestCase: any) => {
    try {
      console.log("Adding Test Case:", newTestCase);
      await axios.post("/api/test-cases", newTestCase);
      fetchTestCases(); // Refresh test cases
    } catch (error: any) {
      console.error("Error adding test case:", error.response?.data || error.message);
      alert("Failed to add test case. Please check the input fields.");
    }
  };

  // Update an existing test case
  const handleUpdate = async (updatedTestCase: any) => {
    try {
      await axios.put(`/api/test-cases/${updatedTestCase.id}`, updatedTestCase);
      fetchTestCases();
    } catch (error: any) {
      console.error("Error updating test case:", error.response?.data || error.message);
      alert("Failed to update test case. Please check the input fields.");
    }
  };

  // Delete a test case
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/test-cases/${id}`);
      fetchTestCases();
    } catch (error: any) {
      console.error("Error deleting test case:", error.response?.data || error.message);
      alert("Failed to delete test case.");
    }
  };

  // Open the modal for adding/editing a test case
  const openModal = (testCase: any = null) => {
    setCurrentTestCase(testCase);
    setPrompt(testCase?.prompt || "");
    setExpectedOutput(testCase?.expected_output || "");
    setIqAspectField(testCase?.iq_aspect || "");
    setShowModal(true);
  };

  // Open the modal for deleting a test case
  const openDeleteModal = (testCase: any) => {
    setCurrentTestCase(testCase);
    setShowDeleteModal(true);
  };

  // Toggle the dropdown menu for test case actions
  const toggleDropdown = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id)); // Toggles the dropdown
  };

  // Automatically set system prompt ID when IQ aspect is selected
  useEffect(() => {
    const fetchSystemPromptId = async () => {
      try {
        if (iqAspectField) {
          const response = await axios.get("/api/system-prompts", {
            params: { iqAspect: iqAspectField },
          });
          const prompt = response.data.find((p: any) => p.iq_aspect === iqAspectField);
          setSystemPromptId(prompt?.id || null);
        } else {
          setSystemPromptId(null);
        }
      } catch (error) {
        console.error("Error fetching system prompt ID:", error);
      }
    };
    fetchSystemPromptId();
  }, [iqAspectField]);

  // Initial fetches
  useEffect(() => {
    fetchTestCases();
    fetchIQAspects();
  }, [iqAspect]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Test Cases</h2>
        <button onClick={() => openModal()}>
          <AiOutlinePlus />
        </button>
      </div>
      <select
        className="sidebar-select"
        value={iqAspect}
        onChange={(e) => setIqAspect(e.target.value)}
      >
        <option value="">All IQ Aspects</option>
        {iqAspects.map((aspect: string) => (
          <option key={aspect} value={aspect}>
            {aspect}
          </option>
        ))}
      </select>
      <ul>
        {testCases.map((testCase: any) => (
          <li key={testCase.id} className="sidebar-test-case">
            <span>{testCase.prompt}</span>
            <div className="relative">
              <button
                onClick={() => toggleDropdown(testCase.id)}
                className="dropdown-button"
              >
                <AiOutlineEllipsis />
              </button>
              {openDropdownId === testCase.id && (
                <div className="dropdown-menu">
                  <button onClick={() => openModal(testCase)}>Edit</button>
                  <button
                    className="dropdown-delete"
                    onClick={() => openDeleteModal(testCase)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for Add/Edit Test Case */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {currentTestCase ? "Edit Test Case" : "Add New Test Case"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newTestCase = {
                  id: currentTestCase?.id,
                  prompt,
                  expected_output: expectedOutput,
                  system_prompt_id: systemPromptId,
                };

                if (!newTestCase.prompt || !newTestCase.expected_output || !newTestCase.system_prompt_id) {
                  alert("Please fill in all fields.");
                  return;
                }

                if (currentTestCase) {
                  handleUpdate(newTestCase);
                } else {
                  handleAdd(newTestCase);
                }

                setShowModal(false);
              }}
            >
              <input
                type="text"
                placeholder="Prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <input
                type="text"
                placeholder="Expected Output"
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
              />
              <select
                className="sidebar-select"
                value={iqAspectField}
                onChange={(e) => setIqAspectField(e.target.value)}
              >
                <option value="">Select IQ Aspect</option>
                {iqAspects.map((aspect: string) => (
                  <option key={aspect} value={aspect}>
                    {aspect}
                  </option>
                ))}
              </select>
              <div className="actions">
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Delete Test Case</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{currentTestCase?.prompt}</strong>?
            </p>
            <div className="actions">
              <button
                type="button"
                className="cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete"
                onClick={() => {
                  handleDelete(currentTestCase.id);
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
