import React, { useCallback } from "react";
import { AppProfile } from "../../../interfaces/PopupInterface";

interface ProfilesTableListProps {
  profiles: AppProfile[];
  startEditing: (profile: AppProfile) => void;
  deleteProfile: (id: string) => void;
  toggleProfileStatus: (id: string) => void;
  cloneProfile: (profile: AppProfile) => void;
}

const ProfilesTableList: React.FC<ProfilesTableListProps> = ({
  profiles,
  startEditing,
  deleteProfile,
  toggleProfileStatus,
  cloneProfile,
}) => {
  const handleToggleStatus = useCallback(
    (id: string) => {
      toggleProfileStatus(id);
    },
    [toggleProfileStatus]
  );
  const handleCloneProfile = useCallback(
    (profile: AppProfile) => {
      const clonedProfile = {
        ...profile,
        id: `${profile.id}-clone`,
        name: `${profile.name}-clone`,
      };
      cloneProfile(clonedProfile);
    },
    [cloneProfile]
  );
  return (
    <div className="ProfilesTableList">
      <div className=" bg-gray-100 flex  justify-center bg-gray-100 font-sans overflow-hidden">
        <div className="w-full lg:w-5/6">
          <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {profiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          className="font-medium cursor-pointer hover:underline focus:outline-none"
                          onClick={() => startEditing(profile)}
                        >
                          {profile.name}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <button
                          className="cursor-pointer hover:underline focus:outline-none"
                          onClick={() => startEditing(profile)}
                        >
                          {profile.id}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-6 text-center">
                      <button
                        id="ProfileStatus"
                        className={`py-1 px-3 rounded-full text-xs ${
                          profile.status
                            ? "bg-green-200 text-green-600"
                            : "bg-gray-800 text-gray-100"
                        }`}
                        onClick={() => handleToggleStatus(profile.id)}
                      >
                        {profile.status ? "Active" : "Disabled"}
                      </button>
                    </td>

                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            onClick={() => startEditing(profile)}
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </div>

                        <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this profile?"
                                )
                              ) {
                                deleteProfile(profile.id);
                              }
                            }}
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilesTableList;
