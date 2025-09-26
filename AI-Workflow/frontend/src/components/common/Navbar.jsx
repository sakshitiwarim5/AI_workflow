import React from "react";
import AiLogo from "../../assets/ai.png";

function Navbar() {
  return (
    <nav className="bg-white h-[7vh] px-10 py-2 flex justify-between items-center border-b border-gray-200 shadow-sm z-50">
      <div className="flex gap-4 items-center">
        <div>
          <img src={AiLogo} alt="GenAI Stack Logo" className="h-8 w-8" />{" "}
        </div>
        <div className="font-semibold text-[16px]">GenAI Stack</div>
      </div>
      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-200">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-white to-yellow-200 font-extrabold text-lg font-serif tracking-wider">
          ST
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
