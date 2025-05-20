chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "gemini-result") {
    alert("Gemini Analysis:\n\n" + message.data);
  } else if (message.type === "gemini-error") {
    alert("Gemini Error:\n\n" + message.data);
  }
  // return true; // Optional: To indicate async response, not strictly needed here.
});
