import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SettingSvg from "../../../assets/setting.svg";
import OutputPng from "../../../assets/Output.png";

function OutputNode({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm min-w-[300px] font-sans border border-gray-100 hover:shadow-gray-200">
      {/* Header with title and settings */}
      <div className="flex items-center p-3">
        <div className="flex items-center gap-2">
          <img
            src={OutputPng}
            alt="Output"
            className="w-5 h-5"
          />
          <span className="font-semibold text-base">Output</span>
        </div>
        <button className="w-fit h-fit ml-auto">
          <img src={SettingSvg} alt="settings" className="h-4 w-4" />
        </button>
      </div>
      {/* Subtitle */}
      <div className="flex items-center px-4 py-2 bg-orange-100 rounded text-gray-900 text-sm mb-5">
        Output of the result nodes as text
      </div>
      {/* Output Textarea */}
      <div className="px-4 pb-2">
        <label className="text-gray-800 text-sm mb-1 block">Output Text</label>
        <div className="bg-gray-100 rounded px-3 py-3 text-gray-500 text-sm min-h-[80px]">
          {data.output || "Output will be generated based on query"}
        </div>
      </div>

      {/* Status Indicator and Label */}
      <button className="ml-auto mr-4  text-sm bg-white text-gray-800 px-3 rounded hover:bg-gray-50 border border-gray-400 mb-4 flex justify-end hover:cursor-pointer"
      onClick={() => data.onChat && data.onChat()} > 
          <span>Chat</span>
        </button>
      {/* Edge handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="!bg-green-500"
      />
    </div>
  );
}

export default memo(OutputNode);
