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
    chrome.storage.local.get('openaiApiKey', (result) => {
      if (result.openaiApiKey) {
        resolve(result.openaiApiKey);
      } else {
        const key = prompt('Enter your OpenAI API key:');
        if (key) {
          chrome.storage.local.set({ openaiApiKey: key }, () => resolve(key));
        } else {
          reject('API key not provided');
        }
      }
    });
  });
}

export async function analyzeText(text) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const key = await getApiKey();
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are ScholarGPT, a versatile intellect and expert teacher with comprehensive mastery across all present-day domains of human wisdom, notably in economics, finance, technology, history, literature, and philosophy. You have an ability to discern relationships among concepts and fields that elude others. With that in mind, please explain and analyze the given text.',
        },
        { role: 'user', content: text },
      ],
      temperature: 0.1,
    }),
  });
  const data = await response.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content.trim();
  } else {
    throw new Error('Unable to analyze the selected text.');
  }
}

  
  function createFloatingButton() {
    const button = document.createElement('button');
    button.id = 'analyzer-floating-button';
    button.innerText = 'Analyze with OpenAI';
    button.style.display = 'none';
    button.style.position = 'absolute';
    button.style.zIndex = '9999';
    button.style.backgroundColor = 'rgba(100, 100, 255, 0.8)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.padding = '5px 10px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        analyzeText(selectedText);
      }
    });
  
    document.body.appendChild(button);
  
    document.addEventListener('mouseup', () => {
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        const range = window.getSelection().getRangeAt(0);
        const rect = range.getBoundingClientRect();
        button.style.display = 'block';
        button.style.left = `${rect.left + window.scrollX}px`;
        button.style.top = `${rect.top + rect.height + window.scrollY}px`;
      } else {
        button.style.display = 'none';
      }
    });
  
    document.addEventListener('mousedown', (event) => {
      if (event.target !== button) {
        button.style.display = 'none';
      }
    });
  }
  
  createFloatingButton();
  
