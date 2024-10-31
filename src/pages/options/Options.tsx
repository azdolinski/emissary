import React, { useState, useEffect } from "react";
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import ProfilePage from "./profiles/ProfilePage";
import ProfileEdit from "./profiles/ProfileEdit";
import ProfilesButton from "../../components/options/ProfilesButton";
import DumpButton from "../../components/options/DumpButton";
import TagsButton from "../../components/options/TagsButton";
import VersionButton from "../../components/options/VersionButton";
import CloseButton from "../../components/options/CloseButton";
import BuyMeACoffeeButton from "../../components/options/BuyMeACoffeeButton";
import DumpPage from "./dump/DumpPage";
import TagsPage from "./tags/TagsPage";

import { AppProfile, AppAction } from "../../interfaces/PopupInterface";

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};


const Options: React.FC = () => {
  const [profiles, setProfiles] = useState<AppProfile[]>(() => []);
  const [newProfileName, setNewProfileName] = useState("");
  const [editingProfile, setEditingProfile] = useState<AppProfile | null>(null);
  const [jsonErrors, setJsonErrors] = useState<Record<number, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.get("appProfiles", (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        if (result.appProfiles) {
          setProfiles(result.appProfiles);
        }
        console.log("Profiles loaded successfully:", result.appProfiles);
      });
    } else {
      console.error("Chrome storage API is not available");
    }
  };

  const saveProfiles = (updatedProfiles: AppProfile[]) => {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.set({ appProfiles: updatedProfiles }, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        console.log("Profiles saved successfully:", updatedProfiles);
        setProfiles(updatedProfiles);
      });
    } else {
      console.error("Chrome storage API is not available");
      // Fallback: update state directly
      setProfiles(updatedProfiles);
    }
  };

  const addProfile = () => {
    if (newProfileName.trim()) {
      const newProfile: AppProfile = {
        id: generateId(),
        name: newProfileName.trim(),
        actions: [],
        status: true,
        lastRun: null, // or a default value if needed
      };
      saveProfiles([...profiles, newProfile]);
      setNewProfileName("");
      setEditingProfile(newProfile);
    }
  };

  const toggleProfileStatus = (id: string) => {
    const updatedProfiles = profiles.map((profile) =>
      profile.id === id ? { ...profile, status: !profile.status } : profile
    );
    saveProfiles(updatedProfiles);
  };
  const deleteProfile = (id: string) => {
    const updatedProfiles = profiles.filter((profile) => profile.id !== id);
    saveProfiles(updatedProfiles);
  };

  const startEditing = (profile: AppProfile) => {
    setEditingProfile({ ...profile });
    setJsonErrors({});
    setSaveError(null);
  };

  const saveEditingProfile = () => {
    if (editingProfile) {
      if (Object.keys(jsonErrors).length > 0) {
        setSaveError("Cannot save profile with invalid JSON data.");
        return;
      }
      const updatedProfiles = profiles.map((profile) =>
        profile.id === editingProfile.id ? editingProfile : profile
      );
      saveProfiles(updatedProfiles);
      setEditingProfile(null);
      setSaveError(null);
    }
  };

  const addAction = () => {
    if (editingProfile) {
      const newAction: AppAction = {
        name: "",
        method: "GET",
        url: "",
        headers: {},
        data: {},
      };
      setEditingProfile({
        ...editingProfile,
        actions: [...editingProfile.actions, newAction],
      });
    }
  };

  const updateAction = (index: number, updatedAction: Partial<AppAction>) => {
    if (editingProfile) {
      const updatedActions = editingProfile.actions.map((action, i) =>
        i === index ? { ...action, ...updatedAction } : action
      );
      setEditingProfile({ ...editingProfile, actions: updatedActions });
    }
  };

  const deleteAction = (index: number) => {
    if (editingProfile) {
      const updatedActions = editingProfile.actions.filter(
        (_, i) => i !== index
      );
      setEditingProfile({ ...editingProfile, actions: updatedActions });
      const { [index]: _, ...restErrors } = jsonErrors;
      setJsonErrors(restErrors);
    }
  };

  const updateHeaderOrData = (
    index: number,
    type: "headers" | "data",
    oldKey: string,
    newKey: string,
    value: string
  ) => {
    if (editingProfile) {
      const updatedAction = { ...editingProfile.actions[index] };
      if (type === "headers") {
        const updatedHeaders = { ...updatedAction.headers };
        delete updatedHeaders[oldKey];
        updatedHeaders[newKey] = value;
        updatedAction.headers = updatedHeaders;
      } else if (type === "data") {
        try {
          updatedAction.data = JSON.parse(value);
          const { [index]: _, ...restErrors } = jsonErrors;
          setJsonErrors(restErrors);
        } catch (error) {
          setJsonErrors({ ...jsonErrors, [index]: "Invalid JSON format" });
        }
      }
      updateAction(index, updatedAction);
    }
  };

  const addHeaderOrData = (index: number, type: "headers" | "data") => {
    if (editingProfile && type === "headers") {
      const updatedAction = { ...editingProfile.actions[index] };
      const newKey = `new-header-${
        Object.keys(updatedAction.headers).length + 1
      }`;
      updatedAction.headers = { ...updatedAction.headers, [newKey]: "" };
      updateAction(index, updatedAction);
    }
  };

  const removeHeaderOrData = (
    index: number,
    type: "headers" | "data",
    key: string
  ) => {
    if (editingProfile && type === "headers") {
      const updatedAction = { ...editingProfile.actions[index] };
      const { [key]: _, ...rest } = updatedAction.headers;
      updatedAction.headers = rest;
      updateAction(index, updatedAction);
    }
  };

  return (
    <HashRouter>
      <div className="flex bg-gray-100 text-gray-900">
        <aside className="flex h-screen w-20 flex-col items-center border-r border-gray-200 bg-white">
          <div className="flex h-[4.5rem] w-full items-center justify-center border-b border-gray-200 p-2">
            <img src="/icon_64x64.png" />
          </div>
          <nav className="flex flex-1 flex-col gap-y-4 pt-10">
            <ProfilesButton />
            <DumpButton />
            <TagsButton />
          </nav>

        <div className="flex flex-col items-center gap-y-4 py-10">
          <VersionButton />
          <BuyMeACoffeeButton />

          <div className="flex flex-col items-center gap-y-4 py-10">
            <CloseButton />
          </div>
        </div>
        </aside>
        <Routes>
          <Route path="/" element={<Navigate to="/profiles" replace />} />
          <Route path="/profiles" element={
            <ProfilePage
              profiles={profiles}
              newProfileName={newProfileName}
              setNewProfileName={setNewProfileName}
              addProfile={addProfile}
              editingProfile={editingProfile}
              setEditingProfile={setEditingProfile}
              deleteProfile={deleteProfile}
              startEditing={startEditing}
              saveEditingProfile={saveEditingProfile}
              toggleProfileStatus={toggleProfileStatus}
              addAction={addAction}
              updateAction={updateAction}
              deleteAction={deleteAction}
              updateHeaderOrData={updateHeaderOrData}
              addHeaderOrData={addHeaderOrData}
              removeHeaderOrData={removeHeaderOrData}
              jsonErrors={jsonErrors}
              setJsonErrors={setJsonErrors}
              saveError={saveError}
            />
          } />
          <Route path="/dump" element={<DumpPage />} />
          <Route path="/tags" element={<TagsPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default Options;
