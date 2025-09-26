import { Link } from "react-router-dom";
import LinkPng from "../../assets/Link.png"

export function EditStackLink({ to }) {
  return (
    <Link
      to={"/workspace"}
      className="flex items-center border border-gray-300 rounded-sm px-4 py-2 bg-white hover:bg-gray-50 text-[#161c24] font-medium text-sm gap-2"
      style={{
        boxShadow: "0px 0px 0px 1px #E5E7EB inset",
      }}
    >
      Edit Stack
      <div className="w-4 h-4">
        <img src={LinkPng} alt="Go to Edit"/>
      </div>
    </Link>
  );
}
