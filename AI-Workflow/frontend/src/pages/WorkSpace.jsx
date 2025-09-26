import Navbar from "../components/common/Navbar";

import {
  ReactFlow,
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useState, useCallback, useRef } from "react";

import Sidebar from "../components/common/SideBar/SideBar";
import UserInputNode from "../components/common/Nodes/UserInputNode";
import KnowledgeBaseNode from "../components/common/Nodes/KnowledgeBaseNode";
import LLMNode from "../components/common/Nodes/LLMNode";
import OutputNode from "../components/common/Nodes/OutputNode";
import ChatWithAI from "../components/common/Chat";

const nodeTypes = {
  userInputNode: UserInputNode,
  knowledgeBaseNode: KnowledgeBaseNode,
  llmNode: LLMNode,
  outputNode: OutputNode,
};

function WorkSpace() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [chatOpen, setChatOpen] = useState(true);
  const [modelData, setModelData] = useState([]);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) =>
      setEdges((edgesSnapshot) =>
        addEdge({ ...params, type: "default" }, edgesSnapshot)
      ),
    []
  );
  const handleTextChange = useCallback(
    (id) => (event) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                query: event.target.value,
                onChange: handleTextChange(id),
              },
            };
          }
          return node;
        })
      );
    },
    []
  );
  const handleChatClick = (outputNodeId) => {
  const connectedNodes = [];
  const visited = new Set();
  let isValid = true;
  let errorMsg = "";

  const traverse = (nodeId) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    // find incoming edges
    const incomingEdges = edges.filter((e) => e.target === nodeId);
    incomingEdges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (sourceNode) {
        connectedNodes.push(sourceNode);
        traverse(sourceNode.id);
      }
    });
  };

  // start traversal from output
  traverse(outputNodeId);

  // validation (reverse execution order: input → KB → LLM → output)
  for (const node of connectedNodes) {
    if (node.type === "userInputNode") {
      if (!node.data.query || node.data.query.trim() === "") {
        isValid = false;
        errorMsg = "User Input requires a query";
        break;
      }
    }

    if (node.type === "knowledgeBaseNode") {
      if (!node.data.doc_id || node.data.doc_id.trim() === "") {
        isValid = false;
        errorMsg = "Knowledge Base requires a doc_id";
        break;
      }
    }

    if (node.type === "llmNode") {
      if (!node.data.prompt || node.data.prompt.trim() === "") {
        isValid = false;
        errorMsg = "LLM requires a prompt";
        break;
      }
    }
  }

  if (!isValid) {
    console.error("Validation failed:", errorMsg);
    setModelData([]);
    setChatOpen(false);
    return;
  }

  const collected = connectedNodes.map((n) => ({
    id: n.id,
    type: n.type,
    data: n.data,
  }));

  setModelData(collected);
  setChatOpen(true);
};

  const handleModelChange = (id) => (e) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, model: e.target.value } }
          : node
      )
    );
  };

  const handlePromptChange = (id) => (e) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, prompt: e.target.value } }
          : node
      )
    );
  };

  const handleTemperatureChange = (id) => (e) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...node.data, temperature: parseFloat(e.target.value) },
            }
          : node
      )
    );
  };

  const handleWebSearchToggle = (id) => (e) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...node.data, webSearchEnabled: e.target.checked },
            }
          : node
      )
    );
  };

  const handleFileUpload = (id) => ([fileName, doc_id]) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                fileName,
                doc_id,
              },
            }
          : node
      )
    );
  };

  const handleFileRemove = (id) => () => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, fileName: "", docId: "" } }
          : node
      )
    );
  };

  const nodesWithHandlers = nodes.map((node) => {
    if (node.type === "userInputNode") {
      return {
        ...node,
        data: {
          ...node.data,
          onChange: handleTextChange(node.id),
        },
      };
    }

    if (node.type === "outputNode") {
      return {
        ...node,
        data: {
          ...node.data,
          onChat: () => handleChatClick(node.id),
        },
      };
    }

    return node;
  });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      let newNode = {
        id: `${+new Date()}`,
        type,
        position,
        data: { label: `${type} node` },
      };
      // Initialize data for userInputNode properly
      if (type === "userInputNode") {
        newNode.data = {
          query: "",
          onChange: handleTextChange(newNode.id),
        };
      }
      if (type === "knowledgeBaseNode") {
        newNode.data = {
          value: "",
        };
      }
      if (type === "llmNode") {
        newNode.data = {
          model: "Gemini",
          prompt: "",
          temperature: 1,
          webSearchEnabled: false,
          onModelChange: handleModelChange(newNode.id),
          onPromptChange: handlePromptChange(newNode.id),
          onTemperatureChange: handleTemperatureChange(newNode.id),
          onWebSearchToggle: handleWebSearchToggle(newNode.id),
        };
      }
      if (type === "knowledgeBaseNode") {
        newNode.data = {
          doc_id: "",
          fileName: "",
          onFileUpload: handleFileUpload(newNode.id),
          onFileRemove: handleFileRemove(newNode.id),
        };
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [handleTextChange]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // validate all connections globally
  const validateConnection = (connection, nodes, edges) => {
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    if (!sourceNode || !targetNode) return false;

    // --- UserInputNode rules ---
    if (sourceNode.type === "userInputNode") {
      // Only allow → KnowledgeBase OR LLM
      if (
        !(
          targetNode.type === "knowledgeBaseNode" ||
          targetNode.type === "llmNode"
        )
      ) {
        return false;
      }
      // Block if UserInput already has one outgoing edge
      const alreadyConnected = edges.some((e) => e.source === sourceNode.id);
      if (alreadyConnected) return false;

      // Block if target already has an incoming edge (so no multiple for KB or LLM)
      const targetHasEdge = edges.some((e) => e.target === targetNode.id);
      if (targetHasEdge) return false;

      return true;
    }

    // --- KnowledgeBaseNode rules ---
    if (sourceNode.type === "knowledgeBaseNode") {
      // Only connect → LLM
      if (targetNode.type !== "llmNode") return false;

      // Block if KB already has an outgoing edge
      const alreadyConnected = edges.some((e) => e.source === sourceNode.id);
      if (alreadyConnected) return false;

      // Block if LLM already has an incoming edge
      const llmAlreadyConnected = edges.some((e) => e.target === targetNode.id);
      if (llmAlreadyConnected) return false;

      return true;
    }

    // --- LLMNode rules ---
    if (sourceNode.type === "llmNode") {
      // Only connect → Output
      if (targetNode.type !== "outputNode") return false;

      // Block if LLM already has an outgoing edge
      const alreadyConnected = edges.some((e) => e.source === sourceNode.id);
      if (alreadyConnected) return false;

      // Block if Output already has an incoming edge
      const outputAlreadyConnected = edges.some(
        (e) => e.target === targetNode.id
      );
      if (outputAlreadyConnected) return false;

      return true;
    }

    // --- OutputNode rules ---
    if (sourceNode.type === "outputNode") {
      // Output cannot connect further
      return false;
    }

    return false;
  };

  return (
    <div className="w-screen h-screen">
      <Navbar />
      <div className="flex h-[93vh]">
        <Sidebar />
        <div
          className="w-full h-full"
          ref={reactFlowWrapper}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodesWithHandlers}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            isValidConnection={(conn) => validateConnection(conn, nodes, edges)}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div>
          <ChatWithAI
        open={chatOpen}
        setOpen={setChatOpen}
        setModelData={setModelData}
        apiEndpoint={`${import.meta.env.VITE_SERVER_URL}/chat/ask`}
        params={modelData}
      />
        </div>
      </div>
    </div>
  );
}

export default WorkSpace;
