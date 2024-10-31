import React from "react";
import ProfileAdd from "./ProfileAdd";
import ProfilesTableList from "./ProfilesTableList";
import ProfileEdit from "./ProfileEdit";
import { AppProfile, AppAction } from "../../../interfaces/PopupInterface";

interface ProfilePageProps {
  profiles: AppProfile[];
  newProfileName: string;
  setNewProfileName: (name: string) => void;
  addProfile: () => void;
  editingProfile: AppProfile | null;
  setEditingProfile: (profile: AppProfile | null) => void;
  deleteProfile: (id: string) => void;
  toggleProfileStatus: (id: string) => void;
  startEditing: (profile: AppProfile) => void;
  saveEditingProfile: () => void;
  addAction: () => void;
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
  saveError: string | null;
  jsonErrors: Record<number, string>;
  setJsonErrors: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  profiles,
  newProfileName,
  setNewProfileName,
  addProfile,
  editingProfile,
  setEditingProfile,
  deleteProfile,
  startEditing,
  toggleProfileStatus,
  saveEditingProfile,
  addAction,
  updateAction,
  deleteAction,
  updateHeaderOrData,
  addHeaderOrData,
  removeHeaderOrData,
  jsonErrors,
  setJsonErrors,
  saveError,
}) => {
  return (
    <div id="Profiles" className="flex flex-col h-screen w-screen p-4">
      <>
        <ProfileAdd
          newProfileName={newProfileName}
          setNewProfileName={setNewProfileName}
          addProfile={addProfile}
        />
        <ProfilesTableList
          profiles={profiles}
          startEditing={startEditing}
          deleteProfile={deleteProfile}
          toggleProfileStatus={toggleProfileStatus}
        />
        {editingProfile && (
          <ProfileEdit
            editingProfile={editingProfile}
            setEditingProfile={setEditingProfile}
            updateAction={updateAction}
            deleteAction={deleteAction}
            updateHeaderOrData={updateHeaderOrData}
            addHeaderOrData={addHeaderOrData}
            removeHeaderOrData={removeHeaderOrData}
            jsonErrors={jsonErrors}
            setJsonErrors={setJsonErrors}
            saveError={saveError}
            addAction={addAction}
            saveEditingProfile={saveEditingProfile}
          />
        )}
      </>
    </div>
  );
};

export default ProfilePage;
