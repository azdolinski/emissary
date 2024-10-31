import React, { useState, useEffect } from "react";
import { AppProfile } from "../../../interfaces/PopupInterface";

const DumpPage: React.FC = () => {
  const [jsonConfig, setJsonConfig] = useState("");

  useEffect(() => {
    console.log('DumpPage mounted, loading configuration...');
    loadConfiguration();
  }, []);

  const loadConfiguration = () => {
    console.log('loadConfiguration called');
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get("appProfiles", (result) => {
        if (chrome.runtime.lastError) {
          console.error('Error loading configuration:', chrome.runtime.lastError);
          setJsonConfig(JSON.stringify({ error: 'Failed to load configuration', details: chrome.runtime.lastError.message }, null, 2));
          return;
        }
        console.log('Loaded configuration:', result);
        if (!result.appProfiles || result.appProfiles.length === 0) {
          console.log('No profiles found in storage');
          setJsonConfig(JSON.stringify({ message: 'No profiles found' }, null, 2));
        } else {
          console.log('Profiles found:', result.appProfiles);
          setJsonConfig(JSON.stringify(result.appProfiles, null, 2));
        }
      });
    } else {
      console.error('Chrome storage API is not available');
      setJsonConfig(JSON.stringify({ error: 'Chrome storage API is not available' }, null, 2));
    }
  };

  const handleJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonConfig(event.target.value);
  };

  const saveConfiguration = () => {
    console.log('saveConfiguration called');
    try {
      const config = JSON.parse(jsonConfig) as AppProfile[];
      console.log('Parsed configuration:', config);
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ appProfiles: config }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error saving configuration:', chrome.runtime.lastError);
            alert(`Error saving configuration: ${chrome.runtime.lastError.message}`);
          } else {
            console.log('Configuration saved successfully');
            alert('Configuration saved successfully!');
            loadConfiguration(); // Reload the configuration after saving
          }
        });
      } else {
        console.error('Chrome storage API is not available');
        alert('Error: Chrome storage API is not available');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert(`Invalid JSON format. Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Dump Configuration</h1>
      <textarea
        value={jsonConfig}
        onChange={handleJsonChange}
        className="flex-grow w-full h-full border rounded p-2 mb-4 font-mono text-sm resize-none"
        placeholder="Loading configuration..."
      />
      <div className="flex space-x-4">
        <button
          onClick={saveConfiguration}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Save Configuration
        </button>
        <button
          onClick={loadConfiguration}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Reload Configuration
        </button>
      </div>
    </div>
  );
};

export default DumpPage;
