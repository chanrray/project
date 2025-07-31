document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const statusText = document.getElementById('statusText');
    
    // Load saved state from storage
    chrome.storage.local.get(['extensionEnabled'], function(result) {
        // Default to disabled if no saved state
        const isEnabled = result.extensionEnabled !== undefined ? 
                         result.extensionEnabled : false;
        
        // Update UI to match state
        toggleSwitch.checked = isEnabled;
        updateStatusText(isEnabled);
        
        // Send state to current tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "toggleExtension",
                    enabled: isEnabled
                });
            }
        });
    });
    
    // Handle toggle switch changes
    toggleSwitch.addEventListener('change', function() {
        const isEnabled = this.checked;
        // Save new state to storage
        chrome.storage.local.set({extensionEnabled: isEnabled});
        updateStatusText(isEnabled);
        
        // Send state to all tabs
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    action: "toggleExtension",
                    enabled: isEnabled
                });
            });
        });
    });
    
    // Update status text display
    function updateStatusText(isEnabled) {
        if (isEnabled) {
            statusText.textContent = "Image Preview Enabled";
            statusText.className = "status-text enabled";
        } else {
            statusText.textContent = "Image Preview Disabled";
            statusText.className = "status-text disabled";
        }
    }
});