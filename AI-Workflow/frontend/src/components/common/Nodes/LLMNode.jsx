import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SettingSvg from "../../../assets/setting.svg";
import LLMPng from "../../../assets/llm.png"

function LLMNode({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm min-w-[340px] font-sans border border-gray-100 hover:shadow-gray-200">
      {/* Title & Settings */}
      <div className="flex gap-2 items-center p-3">
        <img src={LLMPng} alt="Knowledge Base" className="w-5 h-5" />
        <span className="font-semibold text-base">LLM (Gemini)</span>
        <button className="w-fit h-fit ml-auto">
          <img src={SettingSvg} alt="setting" className="h-4 w-4" />
        </button>
      </div>
      {/* Subheading */}
      <div className="flex items-center px-4 py-2 bg-violet-100 rounded mb-2 text-gray-900 text-sm">
        Run a query with Gemini LLM
      </div>
        <div className="px-4 pb-3 flex flex-col gap-3">
        {/* Model */}
        <div>
          <label className="text-gray-800 text-sm">Model</label>
          <select
            className="border border-gray-300 rounded-md w-full p-2 text-sm outline-0 mt-1"
            value={data.model}
            onChange={data.onModelChange}
          >
            <option>Gemini</option>
            <option className="" disabled>GPT-3.5 Turbo</option>
          </select>
        </div>
        {/* Prompt */}
        <div>
          <label className="text-gray-800 text-sm">Prompt</label>
          <textarea
            className="border border-gray-300 rounded-md w-full min-h-[60px] p-2 text-sm resize-none outline-0 mt-1"
            value={data.prompt}
            onChange={data.onPromptChange}
            placeholder="Prompt message"
          />
        </div>
        {/* Temperature */}
        <div>
          <label className="text-gray-800 text-sm">Temperature</label>
          <input
            className="border border-gray-300 rounded-md w-full p-2 text-sm outline-0 mt-1"
            type="number"
            // value={data.temperature}
            value={75}
            min={0}
            max={2}
            step={0.01}
            onChange={data.onTemperatureChange}
          />
        </div>
        {/* Web Search Tool Toggle */}
        <div className="flex items-center">
          <label className="text-gray-800 text-sm">WebSearch Tool</label>
          <label className="ml-auto flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.webSearchEnabled}
              onChange={data.onWebSearchToggle}
              className="accent-green-600 w-4 h-4"
            />
            <span className="ml-2 text-green-600 select-none">{data.webSearchEnabled ? "ON" : "OFF"}</span>
          </label>
        </div>
        {/* SERF API */}
        <div>
          <label className="text-gray-800 text-sm">SERF API</label>
          <div className="relative">
            <input
              type={ "password"}
              className="border border-gray-300 rounded-md w-full p-2 text-sm outline-0 mt-1 disabled:text-gray-500"
              // value={data.serfApiKey}
              value="************************"
              disabled
              onChange={data.onSerfApiKeyChange}
            />
          </div>
        </div>
      </div>
      {/* Output label */}
      <div className="text-right  text-sm bg-white text-gray-800 px-3 rounded hover:bg-gray-50 border-none mb-4">
          Output
        </div>
      {/* Edge handles */}
      <Handle type="target" position={Position.Left} id="target" className="!bg-green-500" />
      <Handle type="source" position={Position.Right} id="source" className="!bg-orange-500" />
    </div>
  );
}

export default memo(LLMNode);
