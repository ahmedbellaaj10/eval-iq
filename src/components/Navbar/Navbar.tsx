import React from "react";

const Navbar = () => {
    return (
      <nav className="bg-blue-600 p-4 flex justify-between items-center text-white">
        <div className="text-2xl font-bold">EvalIQ</div>
        <a
          href="https://github.com/your-repo-link"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-sm"
        >
          GitHub Repo
        </a>
      </nav>
    );
  };

export default Navbar;
