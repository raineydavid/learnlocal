import * as Speech from 'expo-speech';

export interface AudioOptions {
  language?: string;
  pitch?: number;
  rate?: number;
}

export class AudioService {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  async speakText(text: string, options: AudioOptions = {}): Promise<void> {
    try {
      const speechOptions: Speech.SpeechOptions = {
        language: options.language || 'en-US',
        pitch: options.pitch || 1.0,
        rate: options.rate || 1.0,
      };

      await Speech.speak(text, speechOptions);
    } catch (error) {
      console.error('Speech error:', error);
    }
  }

  async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Stop speech error:', error);
    }
  }

  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch (error) {
      console.error('Check speaking error:', error);
      return false;
    }
  }

  // Generate audio using local TTS model
  async generateAudio(text: string, language: string = 'en'): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseURL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          text,
          language,
          model: 'local-tts',
        }),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }

      const data = await response.json();
      return data.audioUrl;
    } catch (error) {
      console.error('TTS generation error:', error);
      return null;
    }
  }
}

export const audioService = new AudioService();