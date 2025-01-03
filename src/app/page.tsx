"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import TestCaseForm from "@/components/TestCaseForm/TestCaseForm";
import ExperimentForm from "@/components/ExperimentForm/ExperimentForm";
import Navbar from "@/components/Navbar/Navbar";
import { useState } from "react";

export default function Home() {
  const [selectedTestCase, setSelectedTestCase] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar
          onSelectTestCase={(testCase: any) => setSelectedTestCase(testCase)}
          onFilterIQ={(aspect: string) => console.log("Filtering by:", aspect)}
        />
        <div className="w-3/4 p-4 space-y-6">
          <ExperimentForm />
          <TestCaseForm onSubmit={() => console.log("Test case added!")} />
        </div>
      </div>
    </div>
  );
}

