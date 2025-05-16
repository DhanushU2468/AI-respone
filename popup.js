document.addEventListener('DOMContentLoaded', async () => {
    const toggleButton = document.getElementById('toggleButton');
    const statusDiv = document.getElementById('status');
    const autoStartCheckbox = document.getElementById('autoStart');

    // Load saved settings
    chrome.storage.sync.get(['autoStart', 'isRecording'], (result) => {
        autoStartCheckbox.checked = result.autoStart || false;
        updateUI(result.isRecording || false);
    });

    // Save auto-start setting
    autoStartCheckbox.addEventListener('change', (e) => {
        chrome.storage.sync.set({ autoStart: e.target.checked });
    });

    // Toggle recording
    toggleButton.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab.url.includes('meet.google.com') || tab.url.includes('zoom.us')) {
            chrome.tabs.sendMessage(tab.id, { action: 'toggleRecording' }, (response) => {
                if (response && response.isRecording !== undefined) {
                    updateUI(response.isRecording);
                    chrome.storage.sync.set({ isRecording: response.isRecording });
                }
            });
        } else {
            statusDiv.textContent = 'Error: Not in a supported meeting';
            statusDiv.style.color = 'red';
        }
    });

    function updateUI(isRecording) {
        toggleButton.textContent = isRecording ? 'Stop Listening' : 'Start Listening';
        statusDiv.textContent = isRecording ? 'Listening for questions...' : 'Not listening';
        statusDiv.style.color = isRecording ? '#4285f4' : 'black';
    }
}); 