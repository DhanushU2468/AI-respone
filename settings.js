document.addEventListener('DOMContentLoaded', () => {
    const openaiKeyInput = document.getElementById('openai_key');
    const googleKeyInput = document.getElementById('google_key');
    const saveButton = document.getElementById('save');
    const statusDiv = document.getElementById('status');

    // Load existing keys
    chrome.storage.local.get(['openai_api_key', 'google_api_key'], (result) => {
        if (result.openai_api_key) {
            openaiKeyInput.value = result.openai_api_key;
        }
        if (result.google_api_key) {
            googleKeyInput.value = result.google_api_key;
        }
    });

    // Save keys
    saveButton.addEventListener('click', () => {
        const openaiKey = openaiKeyInput.value.trim();
        const googleKey = googleKeyInput.value.trim();

        if (!openaiKey || !googleKey) {
            showStatus('Please enter both API keys', false);
            return;
        }

        chrome.storage.local.set({
            openai_api_key: openaiKey,
            google_api_key: googleKey
        }, () => {
            showStatus('Settings saved successfully!', true);
        });
    });

    function showStatus(message, isSuccess) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${isSuccess ? 'success' : 'error'}`;
        statusDiv.style.display = 'block';
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
}); 