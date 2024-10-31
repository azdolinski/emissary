import React from "react";
import ProfilePage from "./ProfilePage";

const ProfilePanel: React.FC = () => {
  return (
    <div className="profile-panel">
      <ProfilePage
        profiles={[]}
        newProfileName=""
        setNewProfileName={() => {}}
        addProfile={() => {}}
        editingProfile={null}
        setEditingProfile={() => {}}
        deleteProfile={() => {}}
        toggleProfileStatus={() => {}}
        startEditing={() => {}}
        saveEditingProfile={() => {}}
        addAction={() => {}}
        updateAction={() => {}}
        deleteAction={() => {}}
        updateHeaderOrData={() => {}}
        addHeaderOrData={() => {}}
        removeHeaderOrData={() => {}}
        jsonErrors={{}}
        setJsonErrors={() => {}}
        saveError={null}
      />
    </div>
  );
};

export default ProfilePanel;
