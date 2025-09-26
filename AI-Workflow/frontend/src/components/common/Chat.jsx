import React, { useEffect, useState, useRef } from "react";

import LLMPng from "../../assets/llm.png";
import ChatImg from "../../assets/Chat.svg";
import Doodle from "../../assets/doodle.png";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatWithAI({ open, setOpen, setModelData, apiEndpoint, params }) {
  // const [open, setOpen] = useState(false);
  const modelData = params;
  const [messages, setMessages] = useState([]); // {sender: 'user'|'ai', text: string}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userNode = modelData.find((n) => n.type === "userInputNode");
    const query = userNode?.data?.query || "";
    setInput(query);
  }, [modelData]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);
    setLoading(true);

    console.log(modelData);

    try {
      // Extract needed fields from modelData
      const llmNode = modelData.find((n) => n.type === "llmNode");
      const kbNode = modelData.find((n) => n.type === "knowledgeBaseNode");

      const query = input.trim();
      console.log(query);

      if (!query) {
        throw new Error("Query is required.");
      }

      const payload = {
        query,
      };

      if (llmNode?.data?.prompt) {
        payload.prompt = llmNode.data.prompt;
      }
      if (llmNode?.data?.webSearchEnabled) {
        payload.websearch = llmNode.data.webSearchEnabled;
      }
      if (kbNode?.data?.doc_id) {
        payload.doc_ids = [kbNode.data.doc_id];
      }

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log(data);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Error: " + data.error },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.answer,
            webResults: data.web_results || [],
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error: Failed to get response." },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <>
      {/* Collapsed Bar */}
      {!open && (
        <div
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#44924C] border-l border-gray-300 shadow-lg rounded-l-xl px-3 py-2 cursor-pointer z-50 flex items-center"
          onClick={() => {
            setOpen(true);
            setModelData([]);
          }}
        >
          <img src={ChatImg} alt="chat" className="w-8 h-8" />
        </div>
      )}

      {/* Expanded Chat Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-white shadow-xl border-l border-gray-300 transition-all duration-300 ease-in-out ${
          open ? "w-2/5 min-w-[320px]" : "w-0 overflow-hidden"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <span className="font-semibold text-lg">Chat with AI</span>
          <button
            className="text-gray-600 text-lg hover:text-gray-800"
            onClick={() => {
              setOpen(false);
              setModelData([]);
            }}
          >
            ✕
          </button>
        </div>
        {/* Message List with doodle background */}
        <div
          className="flex-1 overflow-y-auto px-4 py-2 space-y-2 relative  "
        
        >
          {messages.length === 0 && (
            <div className="absolute inset-0 flex gap-2 items-center justify-center pointer-events-none">
              <img src={LLMPng} alt="Welcome" className="w-8 h-8 opacity-60" />
              <span className="text-xl font-semibold opacity-50">
                Start your chat with AI !
              </span>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-2 relative z-10">
              <div
                className={`w-[68%] min-w-[250px] ${
                  msg.sender === "user"
                    ? "ml-auto bg-green-200 text-black mt-14 mb-4 w-fit"
                    : "mr-auto bg-gray-100 text-black"
                } rounded-lg px-4 py-3 text-lg shadow markdown border border-gray-300`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
              {/* If AI message has web results */}{" "}
              {msg.sender === "ai" &&
                msg.webResults &&
                msg.webResults.length > 0 && (
                  <div className="mr-auto bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-sm space-y-1 w-[68%] min-w-[250px]">
                    {" "}
                    <span className="font-semibold block mb-1">
                      {" "}
                      🔎 Top Web Results:{" "}
                    </span>{" "}
                    <ul className="list-disc list-inside space-y-1">
                      {" "}
                      {msg.webResults.map((res, i) => (
                        <li key={i}>
                          {" "}
                          <a
                            href={res.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {" "}
                            {res.title}{" "}
                          </a>{" "}
                          <p className="text-gray-600 text-xs">{res.snippet}</p>{" "}
                        </li>
                      ))}{" "}
                    </ul>{" "}
                  </div>
                )}
            </div>
          ))}

          {loading && (
            <div className="mr-auto bg-gray-100 text-gray-500 rounded-lg px-3 py-2 shadow inline-block">
              Typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-5 border-t border-gray-200 flex gap-2">
          <input
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-[#44924C]"
            type="text"
            value={input}
            placeholder="Type your question..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            className="bg-[#44924C] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#346b39] transition disabled:bg-[#44924C]"
            onClick={sendMessage}
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatWithAI;
