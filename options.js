// Saves options to chrome.storage
function save_options() {
  const apiKey = document.getElementById('apiKey').value;
  chrome.storage.local.set({
    googleApiKey: apiKey
  }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'API Key saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores API key state using the preferences stored in chrome.storage.
function restore_options() {
  chrome.storage.local.get('googleApiKey', function(items) {
    if (items.googleApiKey) {
      document.getElementById('apiKey').value = items.googleApiKey;
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options); 