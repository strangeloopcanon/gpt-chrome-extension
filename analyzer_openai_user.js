// ==UserScript==
// @name         Website Analyzer
// @namespace    http --- xxxx
// @version      0.2
// @description  Analyze selected text using OpenAI GPT-4o API
// @author       Rohit Krishnan
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

export async function getApiKey() {
  return new Promise((resolve, reject) => {
    if (!chrome.storage) {
      reject('chrome.storage unavailable');
      return;
    }
    chrome.storage.local.get('googleApiKey', (result) => {
      if (result.googleApiKey) {
        resolve(result.googleApiKey);
      } else {
        // prompt() is not available in Service Workers.
        // Reject if the key is not found. An options page is the proper long-term solution.
        reject('Google API key not set. Please open the extension options and set your API key.');
      }
    });
  });
}

export async function analyzeText(text) {
  const apiKey = await getApiKey();
  // Using gemini-1.5-flash-latest as a robust choice. We can also try specific versions like "gemini-2.0-flash" if needed.
  const modelName = 'gemini-2.0-flash'; 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const systemPrompt = 'You are a versatile intellect and expert teacher with comprehensive mastery across all present-day domains of human wisdom, notably in economics, finance, technology, history, literature, and philosophy. You have an ability to discern relationships among concepts and fields that elude others. With that in mind, please explain and analyze the given text.';

  const requestBody = {
    contents: [
      {
        parts: [
          { text: text }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      // maxOutputTokens: 8192, // Optional: Adjust if needed
    },
    // system_instruction is available for newer models, check compatibility if issues arise.
    // For gemini-1.5-flash, system instructions are supported.
    system_instruction: {
        parts: [ { text: systemPrompt } ]
    }
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
    return data.candidates[0].content.parts[0].text.trim();
  } else if (data.promptFeedback && data.promptFeedback.blockReason) {
    console.error("Analysis blocked by API:", data.promptFeedback);
    throw new Error(`Analysis blocked: ${data.promptFeedback.blockReason}${data.promptFeedback.blockReasonMessage ? ' - ' + data.promptFeedback.blockReasonMessage : ''}. Check safety settings if applicable.`);
  } else {
    console.error("Unexpected API response structure:", data);
    throw new Error('Unable to analyze the selected text due to unexpected API response.');
  }
}
