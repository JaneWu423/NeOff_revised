// For bookmarks creation
chrome.bookmarks.onCreated.addListener((id, bookmarkNode) => {
  
  promptUserForPreference(bookmarkNode.url);
});
chrome.tabs.onCreated.addListener((tab) => {
  promptUserForPreference(tab.url);
  // You can add additional logic here
});
  function showNotification(title, message) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'https://icon.horse/icon/youtube.com',  // Path to your extension's icon or any other asset
      title: title,
      message: message
    });
  }

  function promptUserForPreference(url) {
    chrome.notifications.create ({
        type: "basic",
        title: "URL Preference",
        message: `Do you like the website: ${url}?`,
        iconUrl: 'https://icon.horse/icon/youtube.com',
        buttons: [
            { title: "Good" },
            { title: "Bad" }
        ]
    });
  }
