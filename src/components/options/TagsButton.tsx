import React from "react";
import { Link } from "react-router-dom";

const TagsButton: React.FC = () => {
  return (
    <Link to="/tags" className="group relative rounded-xl bg-gray-100 p-2 text-blue-600 hover:bg-gray-50" replace>
      <svg
        width="24"
        height="24"
        className="h-6 w-6 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.59 13.41L11.17 4H4v7.17l9.41 9.41c.39.39 1.02.39 1.41 0l5.76-5.76c.39-.39.39-1.02 0-1.41zM7 9c-.83 0-1.5-.67-1.5-1.5S6.17 6 7 6s1.5.67 1.5 1.5S7.83 9 7 9z"
          fill="currentColor"
        />
      </svg>
      <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
        <div className="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
          <div className="absolute inset-0 -left-1 flex items-center">
            <div className="h-2 w-2 rotate-45 bg-white"></div>
          </div>
          Tags
        </div>
      </div>
    </Link>
  );
};

export default TagsButton;
