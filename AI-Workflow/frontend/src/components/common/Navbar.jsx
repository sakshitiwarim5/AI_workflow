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
      <div className="h-6 w-6 rounded-full text-white font-bold font-mono bg-pink-400 flex items-center justify-center text-center">
        S
      </div>
    </nav>
  );
}

export default Navbar;
