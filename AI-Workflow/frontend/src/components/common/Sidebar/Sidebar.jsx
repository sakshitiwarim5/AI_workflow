import { useDnD } from "./DnDContext";
import QueryImg from "../../../assets/UserInput/query.png";
import OutputPng from "../../../assets/Output.png";
import LLMPng from "../../../assets/llm.png";
import KnowledgeBaseIcon from "../../../assets/KnowledgeBaseIcon.png";
import FolderIcon from "../../../assets/folder.png";

const Sidebar = () => {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";

    // Set dataTransfer type for React Flow drop handling
    event.dataTransfer.setData("application/reactflow", nodeType);
  };

  return (
    <aside className="px-4 bg-white shadow-sm h-full min-w-[350px] z-10">
      <button className="flex w-full items-center justify-between bg-[#F6F6F6] rounded-xl shadow-xs border border-gray-300 px-4 py-3 my-6 cursor-pointer">
        <span className="text-xl">
          Chat With AI
        </span>
        <span className="ml-2">
          <img src={FolderIcon} alt="icon" className="w-5 h-5"/>
        </span>
      </button>

      <div className="description text-lg text-gray-800 pb-2 text-start">
        Components
      </div>

      <div
        className="flex items-center gap-3 bg-white rounded-xl border border-gray-400 px-4 py-3 w-full mb-3"
        onDragStart={(event) => onDragStart(event, "userInputNode")}
        draggable
      >
        <img src={QueryImg} alt="Node" className="w-5 h-5 object-cover" />
        <span className="text-base text-gray-800">User Input Node</span>
      </div>

      <div
        className="flex items-center gap-3 bg-white rounded-xl border border-gray-400 px-4 py-3 w-full mb-3"
        onDragStart={(event) => onDragStart(event, "knowledgeBaseNode")}
        draggable
      >
        <img
          src={KnowledgeBaseIcon}
          alt="Knowledge Base"
          className="w-5 h-5 object-cover"
        />
        <span className="text-base text-gray-800">Knowledge Base</span>
      </div>

      <div
        className="flex items-center gap-3 bg-white rounded-xl border border-gray-400 px-4 py-3 w-full mb-3"
        onDragStart={(event) => onDragStart(event, "llmNode")}
        draggable
      >
        <img src={LLMPng} alt="LLM" className="w-5 h-5 object-cover" />
        <span className="text-base text-gray-800">LLM (Gemini)</span>
      </div>

      <div
        className="flex items-center gap-3 bg-white rounded-xl border border-gray-400 px-4 py-3 w-full"
        onDragStart={(event) => onDragStart(event, "outputNode")}
        draggable
      >
        <img src={OutputPng} alt="Output" className="w-5 h-5 object-cover" />
        <span className="text-base text-gray-800">Output</span>
      </div>
    </aside>
  );
};

export default Sidebar;
