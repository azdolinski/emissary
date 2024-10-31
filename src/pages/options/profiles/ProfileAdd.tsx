import React from "react";

interface ProfilePanelProps {
  newProfileName: string;
  setNewProfileName: (name: string) => void;
  addProfile: () => void;
  onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ProfileAdd: React.FC<ProfilePanelProps> = ({
  newProfileName,
  setNewProfileName,
  addProfile,
  onEnterKeyPress,
}) => {
  const handleAddProfile = () => {
    console.log("Add Profile button clicked");
    addProfile();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("Key pressed:", event.key);
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log("Enter key pressed, calling addProfile");
      addProfile();
    }
    onEnterKeyPress(event);
  };
  return (
    <div id="ProfilePanel" className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Profiles</h1>
      <div className="flex items-center">
        <div className="relative flex-grow flex">
          <input
            type="text"
            className="block px-2 pb-1.5 pt-1.5 min-w-96 text-sm text-gray-900 bg-transparent rounded-l-lg border border-gray-300 bg-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="New Profile Name"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-r-lg"
            onClick={handleAddProfile}
          >
            Add Profile
          </button>
        </div>&nbsp;
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded mr-2"
          onClick={() => window.close()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProfileAdd;
