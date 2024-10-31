import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

// Simple JSON validation function
const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
import { AppProfile, AppAction } from "../../../interfaces/PopupInterface";

interface ProfileEdit {
  editingProfile: AppProfile;
  setEditingProfile: (profile: AppProfile | null) => void;
  updateAction: (index: number, updatedAction: Partial<AppAction>) => void;
  deleteAction: (index: number) => void;
  updateHeaderOrData: (
    index: number,
    type: "headers" | "data",
    oldKey: string,
    newKey: string,
    value: string
  ) => void;
  addHeaderOrData: (index: number, type: "headers" | "data") => void;
  removeHeaderOrData: (
    index: number,
    type: "headers" | "data",
    key: string
  ) => void;
  jsonErrors: Record<number, string>;
  setJsonErrors: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  saveError: string | null;
  addAction: () => void;
  saveEditingProfile: () => void;
}

const ProfileEdit: React.FC<ProfileEdit> = ({
  editingProfile,
  setEditingProfile,
  updateAction,
  deleteAction,
  updateHeaderOrData,
  addHeaderOrData,
  removeHeaderOrData,
  jsonErrors,
  setJsonErrors,
  saveError,
  addAction,
  saveEditingProfile,
}) => {
  const [localData, setLocalData] = useState<string[]>(
    editingProfile.actions
      ? editingProfile.actions.map((action) =>
          JSON.stringify(action.data || {}, null, 2)
        )
      : []
  );

  useEffect(() => {
    if (editingProfile.actions) {
      setLocalData(
        editingProfile.actions.map((action) =>
          JSON.stringify(action.data || {}, null, 2)
        )
      );
    }
  }, [editingProfile]);

  const handleDataChange = (index: number, value: string) => {
    const updatedLocalData = [...localData];
    updatedLocalData[index] = value;
    setLocalData(updatedLocalData);

    if (isValidJSON(value)) {
      setJsonErrors(
        Object.fromEntries(
          Object.entries(jsonErrors).filter(([key]) => Number(key) !== index)
        )
      );

      // Update the editingProfile state immediately
      const updatedActions = [...editingProfile.actions];
      updatedActions[index] = {
        ...updatedActions[index],
        data: JSON.parse(value),
      };
      setEditingProfile({
        ...editingProfile,
        actions: updatedActions,
      });
      // Call updateAction to ensure the parent component is updated
      updateAction(index, { data: JSON.parse(value) });
    } else {
      setJsonErrors({ ...jsonErrors, [index]: "Invalid JSON format" });
    }
  };

  const handleSaveProfile = () => {
    // No need to update actions here, as we're updating them in handleDataChange
    saveEditingProfile();
  };

  const handleHeaderKeyChange = (
    index: number,
    oldKey: string,
    newKey: string,
    value: string
  ) => {
    updateHeaderOrData(index, "headers", oldKey, newKey, value);
    // Set focus back to the input field after the state update
    setTimeout(() => {
      const inputElement = document.getElementById(
        `header-key-${index}-${newKey}`
      );
      if (inputElement) {
        inputElement.focus();
      }
    }, 0);
  };

  return (
    <div id="ProfileEdit">
      <div className=" bg-gray-100 flex  justify-center bg-gray-100 font-sans overflow-hidden">
        <div className="min-w-80 lg:w-5/6">
          <div
            id="ProfileName"
            className="bg-white shadow-md rounded my-6 justify-normal px-8 pt-6 pb-8 mb-4 flex flex-col my-2"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="relative">
                <input
                  id="edit_profile_name"
                  type="text"
                  className="block px-2.5 pb-2.5 pt-4 min-w-96 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={editingProfile.name}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      name: e.target.value,
                    })
                  }
                />
                <label
                  htmlFor="edit_profile_name"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Profile Name
                </label>
              </div>

              <div className="flex space-x-2">
                <button
                  className={`${
                    Object.keys(jsonErrors).length > 0
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-500"
                  } text-white px-4 py-2 rounded`}
                  onClick={handleSaveProfile}
                  disabled={Object.keys(jsonErrors).length > 0}
                >
                  Save Profile
                </button>
                <button
                  id="CloseEditProfileForm"
                  className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  onClick={() => setEditingProfile(null)}
                >
                  X
                </button>
              </div>
              {saveError && (
                <p className="text-red-500 text-sm mt-2">{saveError}</p>
              )}
            </div>

            <h3 className="text-lg font-bold mb-2">Actions</h3>
            {editingProfile.actions &&
              editingProfile.actions.map((action, index) => (
                <div key={index} className="mb-4 p-2 border rounded">
                  <div className="mb-4 flex justify-between items-center">
                    <div className="relative">
                      <input
                        id={`edit_action_name_${index}`}
                        type="text"
                        className="block px-2.5 pb-2.5 pt-4 min-w-96 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={action.name || ""}
                        onChange={(e) =>
                          updateAction(index, { name: e.target.value })
                        }
                      />
                      <label
                        htmlFor={`edit_action_name_${index}`}
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                      >
                        Action Name
                      </label>
                    </div>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => deleteAction(index)}
                    >
                      Delete Action
                    </button>
                  </div>
                  <div className="flex items-center mb-2">
                    <select
                      className="px-2.5 pb-2.5 pt-4 text-sm min-w-28 text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600"
                      value={action.method || "GET"}
                      onChange={(e) =>
                        updateAction(index, {
                          method: e.target.value as AppAction["method"],
                        })
                      }
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                    </select>
                    <div className="relative flex-grow ml-2">
                      <input
                        id={`edit_action_url_${index}`}
                        type="text"
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        value={action.url || ""}
                        onChange={(e) =>
                          updateAction(index, { url: e.target.value })
                        }
                        placeholder=" "
                      />
                      <label
                        htmlFor={`edit_action_url_${index}`}
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                      >
                        URL
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <h4 className="font-bold pb-2.5 pt-4">Headers</h4>
                    {action.headers &&
                      Object.entries(action.headers).map(([key, value]) => (
                        <div key={key} className="flex mb-1 pb-1">
                          <div className="relative w-1/3 mr-1">
                            <input
                              id={`header-key-${index}-${key}`}
                              type="text"
                              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              value={key as string}
                              onChange={(e) =>
                                handleHeaderKeyChange(
                                  index,
                                  key,
                                  e.target.value,
                                  value
                                )
                              }
                              placeholder=" "
                            />
                            <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                              Key
                            </label>
                          </div>
                          <div className="relative w-2/3 mr-1">
                            <input
                              type="text"
                              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              value={value as string}
                              onChange={(e) =>
                                updateHeaderOrData(
                                  index,
                                  "headers",
                                  key,
                                  key,
                                  e.target.value
                                )
                              }
                              placeholder=" "
                            />
                            <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                              Value
                            </label>
                          </div>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() =>
                              removeHeaderOrData(index, "headers", key)
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mt-1"
                      onClick={() => addHeaderOrData(index, "headers")}
                    >
                      Add Header
                    </button>
                  </div>
                  <div className="mb-2">
                    <div className="font-bold pb-2.5 pt-4">
                      Data{" "}
                      <a
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="You can use variable like: $message, $url, $page_title"
                      >
                        <div className="relative group ml-1 text-gray-400 cursor-pointer inline-block">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4 inline-block"
                            data-tip
                            data-for={`tooltip-data-${index}`}
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 16v-4m0-4h.01"
                            />
                          </svg>
                        </div>
                      </a>
                      <Tooltip id="my-tooltip" />
                    </div>
                    <div className="relative">
                      <textarea
                        id={`edit_action_data_${index}`}
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer h-32"
                        value={localData[index] || ""}
                        onChange={(e) =>
                          handleDataChange(index, e.target.value)
                        }
                        placeholder=" "
                      />
                      <label
                        htmlFor={`edit_action_data_${index}`}
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                      >
                        Data (JSON)
                      </label>
                    </div>
                    {jsonErrors[index] && (
                      <p className="text-red-500 text-sm mt-1">
                        {jsonErrors[index]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

            <div className="flex justify-between">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded mt-1"
                onClick={addAction}
              >
                Add Action
              </button>

              <button
                className={`${
                  Object.keys(jsonErrors).length > 0
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-500"
                } text-white px-2 py-1 rounded mt-1`}
                onClick={handleSaveProfile}
                disabled={Object.keys(jsonErrors).length > 0}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
