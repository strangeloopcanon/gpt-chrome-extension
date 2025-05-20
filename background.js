import { analyzeText } from './analyzer_openai_user.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze-with-gemini",
    title: "Analyze with Gemini",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "analyze-with-gemini" || !info.selectionText) return;

  try {
    const analysisResult = await analyzeText(info.selectionText);
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: "gemini-result", data: analysisResult });
    } else {
      // Fallback if tab.id is somehow undefined, though unlikely here.
      console.error("Tab ID is missing, cannot send message.");
      alert("Analysis (no tab ID): " + analysisResult); // Fallback alert
    }
  } catch (error) {
    console.error("Error during analysis or sending message:", error);
    const errorMessage = error.message || "Failed to analyze text or send message.";
    if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: "gemini-error", data: errorMessage });
    } else {
        alert("Error (no tab ID): " + errorMessage); // Fallback alert
    }
  }
});
