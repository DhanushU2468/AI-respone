// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if we're on a supported meeting platform
    if (changeInfo.status === 'complete' && 
        (tab.url.includes('meet.google.com') || tab.url.includes('zoom.us'))) {
        
        // Check if auto-start is enabled
        chrome.storage.sync.get(['autoStart'], (result) => {
            if (result.autoStart) {
                chrome.tabs.sendMessage(tabId, { action: 'startRecording' });
            }
        });
    }
});

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    // Initialize default settings
    chrome.storage.sync.set({
        autoStart: false,
        isRecording: false
    });
}); 