import React from "react";
import { AiFillGithub } from "react-icons/ai";

const Navbar = () => {
  return (
    <nav className="bg-darkBlue p-4 flex justify-between items-center text-white">
      <div className="text-2xl font-bold">EvalIQ</div>
      <a
        href="https://github.com/ahmedbellaaj10/eval-iq"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-white no-underline"
      >
        <AiFillGithub className="text-3xl" />
        <span>GitHub Repo</span>
      </a>
    </nav>
  );
};

export default Navbar;


