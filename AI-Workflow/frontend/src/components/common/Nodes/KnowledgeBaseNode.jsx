import { memo, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import KnowledgeBaseIcon from "../../../assets/KnowledgeBaseIcon.png";
import SettingSvg from "../../../assets/setting.svg";
import DustbinSvg from "../../../assets/dustbin.svg";
import PlusSvg from "../../../assets/plus.svg";

function KnowledgeBaseNode({ data }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [localFileName, setLocalFileName] = useState(null);
  const [docId, setDocId] = useState("");

  // Button trigger for file input
  const handleAddFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // File change event
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://127.0.0.1:8000/documents/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();

        console.log(result);

        setLocalFileName(file.name);
        setDocId(result.doc_id);

        // save doc_id + fileName to node data
        data.onFileUpload && data.onFileUpload([file.name, result.doc_id]);
      } catch (err) {
        console.error("Upload error:", err);
        alert("File upload failed. Please try again.");
      } finally {
        setLoading(false);
        e.target.value = null; // reset input
      }
    }
  };

  const handleRemove = () => {
    setLocalFileName(null);
    data.onFileRemove && data.onFileRemove();
  };

  return (
    <div className="bg-white flex flex-col gap-y-3 h-fit rounded-xl shadow-sm min-w-[320px] font-sans border border-gray-100 hover:shadow-gray-200">
      <div className="flex items-center pt-3 px-3">
        <div className="flex items-center gap-2">
          <img
            src={KnowledgeBaseIcon}
            alt="Knowledge Base"
            className="w-5 h-5"
          />
          <span className="font-semibold text-base">Knowledge Base</span>
        </div>
        <button className="w-fit h-fit ml-auto">
          <img src={SettingSvg} alt="setting" className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center px-4 py-2 bg-green-100 rounded mb-2 text-gray-900 text-sm">
        Let LLM search info in your file
      </div>
      {/* File Upload Row */}
      <div className="px-4 mb-2">
        <label className="text-gray-800 text-sm">File for Knowledge Base</label>
        <div
          className="flex items-center mt-2 py-4 px-5 rounded-xl min-h-[44px] border border-dashed border-green-400"
          style={{ background: "#fff" }}
        >
          {localFileName || data.fileName ? (
            <>
              <span className="font-semibold text-green-700">
                {localFileName || data.fileName}
              </span>
              <button
                className="ml-auto text-gray-700 hover:text-red-600 px-2"
                onClick={handleRemove}
                aria-label="Remove file"
                style={{ display: "flex", alignItems: "center" }}
              >
                <img src={DustbinSvg} alt="delete" className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-400">No file selected</span>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                disabled={loading}
                onClick={handleAddFileClick}
                className="ml-auto text-green-600 hover:bg-green-50 rounded-full w-7 h-7 flex items-center justify-center"
                aria-label="Add file"
              >
                <img src={PlusSvg} alt="add file" className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
      {/* Embedding Model select */}
      <div className="px-4">
        <label className="text-gray-800 text-sm ">Embedding Model</label>
        <select
          className="border border-gray-300 rounded-md w-full p-2 text-sm outline-0 mt-2"
          value={data.embeddingModel}
          onChange={data.onEmbeddingChange}
        >
          <option value="text-embedding-3-large">Gemini-flash-2.5</option>
        </select>
      </div>

      <div className="text-right  text-sm bg-white text-gray-800 px-3 rounded hover:bg-gray-50 border-none mb-4 ">
        <span>Context</span>
      </div>
      {/* Target Handle (only accept one, only from userInputNode) */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="!bg-green-500"
      />

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!bg-orange-500"
      />
    </div>
  );
}

export default memo(KnowledgeBaseNode);
