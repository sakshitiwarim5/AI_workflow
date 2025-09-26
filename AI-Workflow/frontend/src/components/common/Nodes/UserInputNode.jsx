import {memo} from "react";
import { Handle, Position } from "@xyflow/react";
import QueryImg from "../../../assets/UserInput/query.png";
import SettingSvg from "../../../assets/setting.svg";

 function UserInputNode({ data }) {
  return (
    <div className="bg-white h-fit  rounded-xl shadow-sm min-w-[300px]   font-sans border border-gray-100  hover:shadow-gray-200">
      <div className="flex items-center  p-3">
        <div className="flex items-center justify-center gap-2">
          <img src={QueryImg} alt="query image" className="w-5 h-5" />
          <span className="font-semibold text-base">User Input</span>
        </div>
        <button className="w-fit h-fit ml-auto ">
          <img src={SettingSvg} alt="setting" className="h-4 w-4" />
        </button>
      </div>
      <div className="bg-blue-100 rounded pl-4 py-2 mb-3 text-gray-900 text-sm">
        Enter point for querys
      </div>
      <div className="px-4 flex flex-col gap-y-2">
        <label className="text-gray-800 text-sm">Query</label>
        <textarea
          className="border border-gray-300 rounded-md w-full min-h-[60px] p-2 text-sm resize-none outline-0 "
          placeholder="Write your query here"
          value={data.query || ""}
          onChange={data.onChange}
        />
        <div className="text-right  text-sm bg-white text-gray-800 px-3 rounded hover:bg-gray-50 border-none mb-4">
          Query
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="custom" className="!bg-orange-400"/>
    </div>
  );
}

export default memo(UserInputNode);