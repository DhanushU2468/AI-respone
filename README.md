<<<<<<< HEAD
# AI Student Assistant Chrome Extension

A Chrome extension that helps students in online classes by automatically transcribing teacher questions and generating appropriate answers using AI.

## Features

- 🎤 Real-time audio capture from Google Meet and Zoom calls
- 🤖 Speech-to-text conversion using Google Cloud Speech-to-Text
- 💡 AI-powered answer generation using OpenAI
- ⚡ Instant display of questions and answers
- 🔄 Auto-start option for meetings

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   npm run generate-icons
   ```

2. **Get Required API Keys**
   - OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
   - Google Cloud API key with Speech-to-Text enabled from [Google Cloud Console](https://console.cloud.google.com/)

3. **Load the Extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select this directory

4. **Configure API Keys**
   - Right-click the extension icon and select "Options"
   - Enter your OpenAI and Google Cloud API keys
   - Click "Save Settings"

## Usage

1. Join a Google Meet or Zoom call
2. Click the extension icon in your Chrome toolbar
3. Click "Start Listening" or enable auto-start
4. A floating window will appear showing:
   - Current status
   - Detected questions
   - AI-generated answers

## Troubleshooting

1. **No Audio Capture**
   - Ensure you've granted microphone permissions
   - Check if you're on a supported meeting platform

2. **Transcription Issues**
   - Ensure your Google Cloud API key is valid
   - Check if Speech-to-Text API is enabled in your Google Cloud Console

3. **No AI Responses**
   - Verify your OpenAI API key
   - Check your internet connection

## Privacy & Security

- API keys are stored locally in your browser
- Audio is processed in real-time and not stored
- All data processing happens on your device

## Support

For issues or feature requests, please contact support at [your-email] 
=======
# AI-respone
>>>>>>> 83c4b60460c9dd14b916cd4f47008ab83f4e02aa
