import { PromptHandler } from './prompts.js';

class AudioProcessor {
    constructor() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.transcriptionBuffer = '';
        this.setupUI();
        this.initializeAPI();
    }

    async initializeAPI() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['google_api_key'], (result) => {
                this.API_KEY = result.google_api_key || '';
                resolve();
            });
        });
    }

    setupUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

        this.answerDisplay = document.createElement('div');
        this.answerDisplay.style.cssText = `
            margin-bottom: 10px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
            max-width: 300px;
        `;
        this.answerDisplay.textContent = 'Waiting for teacher question...';

        const toggleButton = document.createElement('button');
        toggleButton.style.cssText = `
            padding: 8px 16px;
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        toggleButton.textContent = 'Start Listening';
        toggleButton.onclick = () => this.toggleRecording();

        container.appendChild(this.answerDisplay);
        container.appendChild(toggleButton);
        document.body.appendChild(container);
    }

    async toggleRecording() {
        if (!this.isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream, {
                    mimeType: 'audio/webm;codecs=opus'
                });
                
                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };

                this.mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                    this.audioChunks = [];
                    await this.processAudio(audioBlob);
                };

                this.mediaRecorder.start(1000); // Capture in 1-second intervals
                this.isRecording = true;
            } catch (error) {
                console.error('Error accessing microphone:', error);
                this.answerDisplay.textContent = 'Error: Could not access microphone';
            }
        } else {
            this.mediaRecorder.stop();
            this.isRecording = false;
        }
    }

    async processAudio(audioBlob) {
        try {
            const transcript = await this.transcribeAudio(audioBlob);
            
            if (transcript) {
                this.transcriptionBuffer += transcript + ' ';
                
                // Extract question from accumulated transcript
                const question = await PromptHandler.extractQuestion(this.transcriptionBuffer);
                
                if (question && question !== 'No question detected.') {
                    // Generate answer for the detected question
                    const answer = await PromptHandler.generateAnswer(question);
                    this.answerDisplay.textContent = `Q: ${question}\nA: ${answer}`;
                }
            }
        } catch (error) {
            console.error('Error processing audio:', error);
        }
    }

    async transcribeAudio(audioBlob) {
        if (!this.API_KEY) {
            await this.initializeAPI();
            if (!this.API_KEY) {
                throw new Error('Google Cloud API key not set');
            }
        }

        try {
            // Convert audio to base64
            const base64Audio = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Data = reader.result.split(',')[1];
                    resolve(base64Data);
                };
                reader.readAsDataURL(audioBlob);
            });

            // Call Google Cloud Speech-to-Text API
            const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${this.API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    config: {
                        encoding: 'WEBM_OPUS',
                        sampleRateHertz: 48000,
                        languageCode: 'en-US',
                        model: 'default',
                        useEnhanced: true,
                        enableAutomaticPunctuation: true
                    },
                    audio: {
                        content: base64Audio
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Speech-to-Text API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].alternatives[0].transcript;
            }
            return '';
        } catch (error) {
            console.error('Error transcribing audio:', error);
            throw error;
        }
    }
}

// Initialize the audio processor when the content script loads
const processor = new AudioProcessor(); 