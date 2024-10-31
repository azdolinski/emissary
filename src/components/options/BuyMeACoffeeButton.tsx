import React from "react";

const BuyMeACoffeeButton: React.FC = () => {
  return (
    <a
      href="https://buymeacoffee.com/azdolinski"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-xl p-2 text-gray-400 hover:bg-gray-100"
    >
      <svg
        width="24"
        height="24"
        className="h-6 w-6 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 22h10a1 1 0 00.99-.858L19.867 8H21V6h-1.382l-1.724-3.447A.998.998 0 0017 2H7c-.379 0-.725.214-.895.553L4.382 6H3v2h1.133L6.01 21.142A1 1 0 007 22zm10.418-11H6.582l-.429-3h11.693l-.428 3zm-9.551 9l-.429-3h9.123l-.429 3H7.867zM7.618 4h8.764l1 2H6.618l1-2z" />
      </svg>
      <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
        <div className="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
          <div className="absolute inset-0 -left-1 flex items-center">
            <div className="h-2 w-2 rotate-45 bg-white"></div>
          </div>
          Buy Me a Coffee
        </div>
      </div>
    </a>
  );
};

export default BuyMeACoffeeButton;
