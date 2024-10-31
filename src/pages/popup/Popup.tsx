import React, { useState, useEffect, useRef } from "react";

import {
  AppProfile,
  AppAction,
  AppSettings,
} from "../../interfaces/PopupInterface";
import InsertPageLinkButton from "../../components/popup/InsertPageLinkButton";
import OptionsButton from "../../components/popup/OptionsButton";
import ToggleDarkModeButton from "../../components/popup/ToggleDarkModeButton";

const Popup: React.FC = () => {
  const [profiles, setProfiles] = useState<AppProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [paramInput, setParamInput] = useState<string>("");
  const [textBoxMessage, setTextBoxMessage] = useState<string>("");
  const [appSettings, setAppSettings] = useState<AppSettings>({
    isDarkMode: false,
    tags: [],
  });
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [selectedTagIndex, setSelectedTagIndex] = useState<number>(-1);
  const tagListRef = useRef<HTMLDivElement>(null);
  const [executionStatus, setExecutionStatus] = useState<string>("");
  const [pageName, setPageName] = useState<string>("Loading...");
  const [pageContent, setPageContent] = useState<string>("Loading...");
  const [pageUrl, setPageUrl] = useState<string>("Loading...");

  useEffect(() => {
    console.log("Popup component mounted");

    // Clear the message textbox
    setTextBoxMessage("");

    // Load profiles, user input, and dark mode setting from storage
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.get(
        ["appProfiles", "userInput", "appSettings"],
        (result) => {
          if (chrome.runtime.lastError) {
            console.error("Error loading data:", chrome.runtime.lastError);
            return;
          }
          if (result.appProfiles) {
            console.log("Loaded profiles:", result.appProfiles);
            setProfiles(result.appProfiles);
            // If there are profiles and no profile is selected, select the first one
            if (
              result.appProfiles.length > 0 &&
              !result.userInput?.selectedProfileId
            ) {
              setSelectedProfileId(result.appProfiles[0].id);
            }
          }
          if (result.userInput) {
            console.log("Loaded user input:", result.userInput);
            if (result.userInput.selectedProfileId) {
              setSelectedProfileId(result.userInput.selectedProfileId);
            }
            setParamInput(result.userInput.paramInput || "");
            setTextBoxMessage(result.userInput.textBoxMessage || "");
          }
          if (result.appSettings) {
            setAppSettings(result.appSettings);
            applyTheme(result.appSettings.isDarkMode);
          }
        }
      );
    } else {
      console.error("Chrome storage API is not available");
    }

    // Get page info directly from the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setPageName(tabs[0].title || "Untitled");
        setPageUrl(tabs[0].url || "Unknown URL");

        // Use XMLHttpRequest to get the page content
        const tabId = tabs[0].id;
        if (tabId !== undefined) {
          if (chrome.scripting?.executeScript) {
            chrome.scripting.executeScript(
              {
                target: { tabId: tabId },
                func: () => {
                  return new Promise((resolve) => {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", window.location.href, true);
                    xhr.onreadystatechange = function() {
                      if (xhr.readyState == 4) {
                        resolve(xhr.responseText);
                      }
                    };
                    xhr.send();
                  });
                },
              },
              (results) => {
                if (results && results[0] && results[0].result) {
                  setPageContent(results[0].result);
                } else {
                  setPageContent("Error: Unable to fetch page content");
                }
              }
            );
          } else {
            setPageContent("Error: chrome.scripting API is not available");
          }
        } else {
          setPageContent("Error: No valid tab ID");
        }
      } else {
        setPageName("Error: No active tab");
        setPageUrl("Error: No active tab");
      }
    });
  }, []);

  useEffect(() => {
    console.log("selectedProfileId changed:", selectedProfileId);
    setTextBoxMessage("");
    saveUserInput();
  }, [selectedProfileId]);

  const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newProfileId = event.target.value;
    console.log("Selected profile changed to:", newProfileId);
    setSelectedProfileId(newProfileId);
  };

  const handleTextBoxChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setTextBoxMessage(value);
    saveUserInput();

    // Automatically adjust textarea height
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;

    // Check if the user is typing a tag
    const words = value.split(/[\s\n]+/);
    const lastWord = words[words.length - 1];
    if (lastWord && lastWord.startsWith("#")) {
      const tagQuery = lastWord.slice(1).toLowerCase();
      setFilteredTags(
        appSettings.tags.filter((tag) => tag.toLowerCase().includes(tagQuery))
      );
    } else {
      setFilteredTags([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (filteredTags.length > 0) {
      if (event.key === 'Tab') {
        event.preventDefault();
        setSelectedTagIndex((prevIndex) => 
          prevIndex === -1 ? 0 : (prevIndex + 1) % filteredTags.length
        );
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSelectedTagIndex((prevIndex) => 
          prevIndex < filteredTags.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSelectedTagIndex((prevIndex) => 
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (event.key === 'Enter' && selectedTagIndex !== -1) {
        event.preventDefault();
        insertSelectedTag(filteredTags[selectedTagIndex]);
      }
    }
  };

  const insertSelectedTag = (tag: string) => {
    const textarea = document.getElementById('textBoxMessage') as HTMLTextAreaElement;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const textAfterCursor = textarea.value.substring(cursorPosition);
    const lines = textBeforeCursor.split('\n');
    const lastLine = lines[lines.length - 1];
    const words = lastLine.split(/\s/);
    const lastWord = words[words.length - 1];
    if (lastWord && lastWord.startsWith("#")) {
      words[words.length - 1] = `#${tag}`;
      lines[lines.length - 1] = words.join(' ');
      const newTextBeforeCursor = lines.join('\n');
      const newMessage = newTextBeforeCursor + ' ' + textAfterCursor;
      setTextBoxMessage(newMessage);
      setFilteredTags([]);
      setSelectedTagIndex(-1);
      // Set cursor position after the completed tag
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = newTextBeforeCursor.length + 1;
      }, 0);
    }
  };

  // Function to adjust textarea height on component mount and window resize
  const adjustTextareaHeight = () => {
    const textarea = document.getElementById('textBoxMessage') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
    window.addEventListener('resize', adjustTextareaHeight);
    return () => {
      window.removeEventListener('resize', adjustTextareaHeight);
    };
  }, [textBoxMessage]);

  const openOptionsPage = () => {
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.openOptionsPage
    ) {
      chrome.runtime.openOptionsPage();
    } else {
      console.error("Unable to open options page");
    }
  };

  const saveUserInput = () => {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      const userInput = {
        selectedProfileId,
        paramInput,
        textBoxMessage,
      };
      chrome.storage.local.set({ userInput }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error saving user input:", chrome.runtime.lastError);
        } else {
          console.log("User input saved successfully:", userInput);
        }
      });
    }
  };
  const normalizeHashtags = (text: string): string => {
    return text.replace(/#+(\w+)/g, '#$1');
  };

  const executeAppActions = async () => {
    console.log("executeAppActions called");
    if (!selectedProfileId) {
      console.error("No profile selected");
      alert("Please select a emissary profile");
      return;
    }

    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (!profile) {
      console.error("Selected profile not found");
      alert("Selected profile not found");
      return;
    }

    console.log("Executing profile:", profile);
    const params = parseParams(paramInput);
    params["text_box"] = normalizeHashtags(textBoxMessage);
    params["page_name"] = pageName;
    params["page_url"] = pageUrl;
    params["page_content"] = pageContent;
    console.log("Parsed params with content:", params);

    // Detect and add new tags before executing actions
    detectAndAddNewTags(params["text_box"]);

    const results = [];
    const now = new Date();
    for (const action of profile.actions) {
      console.log("Executing action:", action);
      try {
        const result = await executeAction(action, params);
        results.push(`✅ ${action.name}: Success (Status: ${result.status})`);
      } catch (error) {
        console.error("Error executing action:", error);
        if (error instanceof Error) {
          results.push(`❌ ${action.name}: ${error.message}`);
        } else {
          results.push(`❌ ${action.name}: Unknown error`);
        }
      }
    }

    const successCount = results.filter((r) => r.startsWith("✅")).length;
    const failureCount = results.filter((r) => r.startsWith("❌")).length;

    console.log("Execution results:", results);
    setExecutionStatus(
      `<b>Execution complete:</b><br>${successCount} actions succeeded<br>${failureCount} actions failed<br><br><b>Details:</b><br>${results.join(
        "<br>"
      )}`
    );

    if (successCount === profile.actions.length) {
      profile.lastRun = now;
      //saveProfiles(profiles);
      setTextBoxMessage("");
      setParamInput("");
      saveUserInput();
    }
  };

  const executeAction = async (
    action: AppAction,
    params: Record<string, string>
  ) => {
    console.log("executeAction called with:", { action, params });
    let url = replaceParams(action.url, params);
    const headers = new Headers(replaceParamsInObject(action.headers, params));
    const body = replaceParamsInObject(action.data, params);

    headers.delete("cookie");
    console.log("Headers before processing:", headers);

    const fetchOptions: RequestInit = {
      method: action.method,
      headers: headers,
    };

    if (action.method === "GET") {
      const queryParams = new URLSearchParams(body);
      url = `${url}${url.includes("?") ? "&" : "?"}${queryParams}`;
    } else {
      headers.set("Content-Type", "application/json");
      fetchOptions.body = JSON.stringify(body);
    }

    console.log("Headers after processing:", headers);

    try {
      console.log(`Executing action: ${action.name}`);
      console.log(`URL: ${url}`);
      console.log(`Method: ${action.method}`);
      console.log(`Headers:`, Object.fromEntries(headers.entries()));
      if (fetchOptions.body) {
        console.log(`Body:`, fetchOptions.body);
      }

      const response = await fetch(url, fetchOptions);

      console.log(`Response status:`, response.status);
      console.log(
        `Response headers:`,
        Object.fromEntries(response.headers.entries())
      );

      const contentType = response.headers.get("content-type");
      console.log(`Response content type:`, contentType);

      let responseData: Record<string, unknown> | string;

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
        console.log(`Response data (JSON):`, responseData);
      } else {
        responseData = await response.text();
        console.log(`Response text (non-JSON):`, responseData);
      }

      if (!response.ok) {
        throw new Error(
          `Action "${action.name}" failed with status ${response.status}: ${responseData}`
        );
      }

      return {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
      };
    } catch (error) {
      console.error(`Error executing action "${action.name}":`, error);
      throw error;
    }
  };

  const replaceParams = (str: string, params: Record<string, string>) => {
    return str.replace(/%([^%]+)%/g, (match, param) => params[param] || match);
  };

  const replaceParamsInObject = (
    obj: Record<string, string>,
    params: Record<string, string>
  ) => {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceParams(value, params)
        .replace("$message", textBoxMessage)
        .replace("$url", pageUrl)
        .replace("$page_title", pageName)
        .replace("$page_content", pageContent);
    }
    return result;
  };

  const parseParams = (paramInput: string) => {
    const params: Record<string, string> = {};
    paramInput.split(",").forEach((param) => {
      const [key, value] = param.split("=").map((s) => s.trim());
      if (key && value) {
        params[key] = value;
      }
    });
    return params;
  };

  const detectAndAddNewTags = (message: string) => {
    const words = message.split(/\s+/);
    const newTags = words
      .filter((word) => word.startsWith("#") && word.length > 1)
      .map((tag) => tag.replace(/^#+/, '').toLowerCase()) // Remove all leading '#' characters
      .filter((tag) => tag.length > 0 && !appSettings.tags.includes(tag));

    if (newTags.length > 0) {
      const updatedTags = [...new Set([...appSettings.tags, ...newTags])]; // Use Set to remove duplicates
      const newAppSettings = { ...appSettings, tags: updatedTags };
      setAppSettings(newAppSettings);
      saveAppSettings(newAppSettings);
    }
  };

  const saveAppSettings = (newSettings: AppSettings) => {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.set({ appSettings: newSettings }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error saving app settings:", chrome.runtime.lastError);
        } else {
          console.log("App settings saved successfully:", newSettings);
        }
      });
    }
  };

  const applyTheme = (darkMode: boolean) => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !appSettings.isDarkMode;
    const newSettings = { ...appSettings, isDarkMode: newDarkMode };
    setAppSettings(newSettings);
    applyTheme(newSettings.isDarkMode);
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.set({ appSettings: newSettings }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error saving dark mode setting:",
            chrome.runtime.lastError
          );
        } else {
          console.log("Dark mode setting saved successfully:", newDarkMode);
        }
      });
    }
  };

  return (
    <div className="popup-wrapper bg-white dark:bg-gray-800 text-black dark:text-white">
      <div className="popup-container">
        {/* -------------------------------------------------------------------------------------------------- */}
        <div className="flex items-start justify-between w-full mb-2">
          <div id="title_and_url" className="flex-grow overflow-hidden mr-2">
            <div className="mb-2">
              <p className="truncate">
                <strong>Title:</strong> {pageName}
              </p>
              <p className="truncate">
                <strong>URL:</strong> {pageUrl}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8 cursor-pointer"
              src="/icon_32x32.png"
              alt="Emissary Sender"
            />
          </div>
        </div>
        {/* -------------------------------------------------------------------------------------------------- */}
        <select
          className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white mb-2 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer appearance-none"
          value={selectedProfileId}
          onChange={handleProfileChange}
          id="selectProfile"
        >
          <option value="">Select Profile</option>
          {profiles
            .filter((profile) => profile.status)
            .map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
        </select>
        {/* -------------------------------------------------------------------------------------------------- */}
        <div className="mb-4">
          <div className="relative">
            <textarea
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer resize-none overflow-hidden"
              value={textBoxMessage}
              onChange={handleTextBoxChange}
              onKeyDown={handleKeyDown}
              id="textBoxMessage"
              placeholder=" "
              style={{ minHeight: '100px' }}
            ></textarea>
            <label
              htmlFor="textBoxMessage"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-2 scale-75 top-2 z-10 origin-[0] bg-transparent px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-2 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Message
            </label>
          </div>
          <div className="tag-list" id="taglist" ref={tagListRef}>
            {filteredTags.length > 0 ? (
              <div className="flex flex-wrap mt-2">
                {filteredTags.slice(0, 10).map((tag, index) => (
                  <div
                    key={index}
                    className={`bg-gray-200 dark:bg-gray-600 text-black dark:text-white p-2 m-1 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 ${
                      index === selectedTagIndex ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => insertSelectedTag(tag)}
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        {/* -------------------------------------------------------------------------------------------------- */}
        <div className="flex justify-between items-center">
          <div className="flex items-left">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={executeAppActions}
            >
              ✈️ Execute
            </button>
            <InsertPageLinkButton
              pageName={pageName}
              pageUrl={pageUrl}
              setTextBoxMessage={setTextBoxMessage}
            />
          </div>

          <div className="flex items-right">
            <OptionsButton openOptionsPage={openOptionsPage} />
            &nbsp;
            <ToggleDarkModeButton
              isDarkMode={appSettings.isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>
        </div>
        {/* -------------------------------------------------------------------------------------------------- */}
        <div
          id="ExecuteStausMessage"
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: executionStatus }}
        ></div>
      </div>
    </div>
  );
};

export default Popup;
