import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import { fetchStacks } from "../api/FetchStacks";
import { createStack } from "../api/CreateStack";
import { EditStackLink } from "../components/common/EditStackLink";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [stacks, setStacks] = useState([]);
  const [error, setError] = useState(null);

  const [stackName, setStackname] = useState("");
  const [description, setDescription] = useState("");

  function formatReadableDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  async function loadStacks() {
    const result = await fetchStacks();

    if (result.success) {
      setStacks(result.data);
      // setStacks([]);
    } else {
      setError(result.error);
    }
  }

  const handleCreateStack = async () => {
    if (stackName === "" || description === "") return;

    const result = await createStack({ name: stackName, description });

    if (!result.success) {
      setError(result.error);
      return;
    }

    loadStacks();
    setShowModal(false);
    setError(null);
  };

  useEffect(() => {
    loadStacks();
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="font-sans">
      <Navbar />

      {/* Header Section */}
      <div className="px-10 pt-5">
        <div className="flex justify-between py-5 border-gray-300 border-b w-full h-fit">
          <div className="font-semibold text-2xl">My Stack</div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#44924C] flex gap-2 text-[14px] h-fit rounded-[9px] text-white py-2 px-4"
          >
            <div>+</div>
            <div>New Stack</div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`h-[70vh]  p-6 flex justify-center items-center ${
          showModal ? "blur-sm" : ""
        }`}
      >
        {stacks.length === 0 ? (
          <div className="p-6 max-w-sm bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Create New Stack</h2>
            <p className="text-gray-500 text-sm mb-4">
              Start building your generative AI apps with our essential tools
              and frameworks
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#44924C] flex gap-2 text-[14px] h-fit rounded-[9px] text-white py-2 px-4"
            >
              <div>+</div>
              <div>New Stack</div>
            </button>
          </div>
        ) : (
          <div className="w-full h-full">
            <ul className="flex flex-wrap gap-[1%]">
              {stacks.map((stack) => (
                <li
                  key={"my-stack-" + stack.id}
                  className="shadow-xs h-fit bg-white w-[24%] px-5 pt-5 pb-3 my-3 rounded"
                >
                  <div className="font-semibold font-sans mb-2">
                    {stack.name}
                  </div>
                  <pre className="text-sm text-gray-600 font-sans line-clamp-3 whitespace-pre-line min-h-[64px]">
                    {stack.description}
                  </pre>
                  <div className="text-xs text-gray-500 flex justify-between items-end  mt-2">
                    <div className="text-xs">
                      - {formatReadableDate(stack.created_at)}{" "}
                    </div>
                    <div>
                      <EditStackLink />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div className="absolute inset-0  backdrop-blur-xs"></div>
          <div className="absolute inset-0  bg-black opacity-20"></div>

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="relative border border-gray-200 bg-white rounded-lg p-7 w-[500px] shadow-xl">
              <div className="flex justify-between items-center pb-4 mb-5 border-b border-gray-200">
                <h2 className="text-2xl font-semibold">Create New Stack</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setStackname("");
                    setDescription("");
                  }}
                  aria-label="Close"
                  className="text-2xl text-gray-700 hover:text-black"
                  style={{ lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateStack();
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={stackName}
                    onChange={(e) => setStackname(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#44924C] transition mb-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    placeholder=""
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#44924C] transition"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setStackname("");
                      setDescription("");
                    }}
                    className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!stackName || !description}
                    className={`px-5 py-2 rounded-md text-[#98a89f] font-semibold transition ${
                      stackName && description
                        ? "bg-[#44924C] text-white hover:bg-[#35793C]"
                        : "cursor-not-allowed"
                    }`}
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
