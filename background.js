chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze-selection",
    title: "Analyze with OpenAI",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "analyze-selection") return;
  const prompt = info.selectionText;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  }).then(r => r.json());

  chrome.tabs.sendMessage(tab.id, { type: "openai-result", data: resp });
});
