// Set default state on installation
chrome.runtime.onInstalled.addListener(() => {
    // Default to disabled
    chrome.storage.local.set({extensionEnabled: false});
});

// Send current state to new tabs when they finish loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // Get current state
        chrome.storage.local.get(['extensionEnabled'], (result) => {
            // Default to disabled if no saved state
            const isEnabled = result.extensionEnabled !== undefined ? 
                           result.extensionEnabled : false;
            
            // Send state to the new tab
            chrome.tabs.sendMessage(tabId, {
                action: "toggleExtension",
                enabled: isEnabled
            });
        });
    }
});