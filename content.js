function createFloatingButton() {
  const btn = document.getElementById("analyzer-btn") ||
              document.createElement("button");
  btn.id = "analyzer-btn";
  btn.textContent = "Analyze with OpenAI";
  btn.style.position = "absolute";
  btn.style.zIndex = 9999;
  btn.style.display = "none";
  document.body.appendChild(btn);

  btn.onclick = () => {
    const sel = window.getSelection().toString();
    chrome.runtime.sendMessage({ type: "analyze", text: sel });
  };

  return btn;
}

const button = createFloatingButton();

document.addEventListener("selectionchange", () => {
  const sel = window.getSelection().toString();
  if (sel.length) {
    const range = window.getSelection().getRangeAt(0).getBoundingClientRect();
    button.style.left = `${range.right + 8 + window.scrollX}px`;
    button.style.top  = `${range.top  + window.scrollY}px`;
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "openai-result") {
    alert(msg.data.choices[0].message.content);
  }
});
