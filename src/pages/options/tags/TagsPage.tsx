import React, { useState } from "react";

const TagsPage: React.FC = () => {
  const [newTag, setNewTag] = React.useState<string>("");
  const [tagsConfig, setTagsConfig] = React.useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  React.useEffect(() => {
    setValidationError(null); // Clear validation error on load
    loadTags();
  }, []);

  const loadTags = () => {
    chrome.storage.local.get("appSettings", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error loading tags:", chrome.runtime.lastError);
        setTagsConfig(JSON.stringify({ error: "Failed to load tags" }, null, 2));
        return;
      }
      const tags = result.appSettings?.tags || [];
      setTagsConfig(JSON.stringify(tags, null, 2));
      setValidationError(null); 
    });
  };

  const validateTagsConfig = (config: string) => {
    try {
      const tags = JSON.parse(config);
      if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
        setValidationError("Tags must be an array of strings.");
        return false;
      }
      setValidationError(null);
      return true;
    } catch (error) {
      setValidationError("Invalid JSON format.");
      return false;
    }
  };

  const saveTags = () => {
    if (!validateTagsConfig(tagsConfig)) {
      return;
    }
    try {
      const tags = JSON.parse(tagsConfig);
      if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
        setValidationError("Tags must be an array of strings.");
        return;
      }

      setValidationError(null); // Clear any previous validation error

      chrome.storage.local.set({ appSettings: { tags } }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error saving tags:", chrome.runtime.lastError);
          alert(`Error saving tags: ${chrome.runtime.lastError.message}`);
        } else {
          console.log("Tags saved successfully");
          alert("Tags saved successfully!");
        }
        loadTags();
      });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert(`Invalid JSON format. Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleTagsConfigChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newConfig = e.target.value;
    setTagsConfig(newConfig);
    validateTagsConfig(newConfig);
  };

  const addTag = () => {
    if (newTag.trim() === "") return;

    chrome.storage.local.get("appSettings", (result) => {
      const currentTags = result.appSettings?.tags || [];
      const updatedTags = [...currentTags, newTag.trim()];

      chrome.storage.local.set({ appSettings: { tags: updatedTags } }, () => {
        console.log("Tag added:", newTag);
        setNewTag("");
        loadTags();
        setValidationError(null); 
      });
    });
  };

  return (
    <div id="Tags" className="flex flex-col h-screen w-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Tag Booster</h1>
      <div className="mb-4 flex items-center">
        <div className="relative flex-grow flex">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="block px-2.5 pb-2.5 pt-4 min-w-96 text-sm text-gray-900 bg-transparent rounded-l-lg border border-gray-300 bg-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="newTag"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-2 scale-75 top-2 z-10 origin-[0] bg-transparent px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-2 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            New Tag
          </label>
          <button
            onClick={addTag}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg"
          >
            Add Tag
          </button>
        </div>

      </div>
      <textarea
        value={tagsConfig}
        onChange={handleTagsConfigChange}
        className="flex-grow w-full h-full border rounded p-2 mb-4 font-mono text-sm resize-none"
        placeholder="Loading tags..."
      />
      <div className="flex space-x-4 items-center">
        <button
          onClick={saveTags}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${validationError ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!!validationError}
        >
          Save Tags
        </button>
        <button
          onClick={loadTags}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Reload Tags
        </button>
        {validationError && (
          <span className="text-red-500 text-sm">{validationError}</span>
        )}
      </div>
    </div>
  );
};

export default TagsPage;
