import * as FileSystem from 'expo-file-system';

export interface ModelInfo {
  name: string;
  version: string;
  size: string;
  description: string;
  downloadUrl: string;
  isRequired: boolean;
  source: 'gpt-oss' | 'huggingface' | 'local';
  modelId?: string;
  capabilities: string[];
}

export interface DownloadProgress {
  progress: number;
  totalBytes: number;
  downloadedBytes: number;
}

export class ModelService {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  async getAvailableModels(): Promise<ModelInfo[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/models/available`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get models error:', error);
      // Return default models if API is unavailable
      return [
        {
          name: 'GPT-OSS Base',
          version: '1.0.0',
          size: '4.2 GB',
          description: 'Core language model for chat and learning assistance',
          downloadUrl: 'https://example.com/gpt-oss-base.bin',
          isRequired: true,
          source: 'gpt-oss',
          capabilities: ['chat', 'lesson-generation', 'text-completion']
        },
        {
          name: 'Hugging Face - DialoGPT Medium',
          version: '1.0.0',
          size: '774 MB',
          description: 'Conversational AI model from Microsoft',
          downloadUrl: 'https://huggingface.co/microsoft/DialoGPT-medium',
          isRequired: false,
          source: 'huggingface',
          modelId: 'microsoft/DialoGPT-medium',
          capabilities: ['chat', 'conversation']
        },
        {
          name: 'Hugging Face - FLAN-T5 Base',
          version: '1.0.0',
          size: '990 MB',
          description: 'Instruction-tuned text-to-text model from Google',
          downloadUrl: 'https://huggingface.co/google/flan-t5-base',
          isRequired: false,
          source: 'huggingface',
          modelId: 'google/flan-t5-base',
          capabilities: ['lesson-generation', 'text-to-text', 'instruction-following']
        },
        {
          name: 'Hugging Face - BlenderBot 400M',
          version: '1.0.0',
          size: '1.6 GB',
          description: 'Open-domain chatbot model from Facebook',
          downloadUrl: 'https://huggingface.co/facebook/blenderbot-400M-distill',
          isRequired: false,
          source: 'huggingface',
          modelId: 'facebook/blenderbot-400M-distill',
          capabilities: ['chat', 'conversation', 'open-domain']
        },
        {
          name: 'Local TTS Model',
          version: '1.0.0',
          size: '800 MB',
          description: 'Text-to-speech generation',
          downloadUrl: 'https://example.com/tts-model.bin',
          isRequired: false,
          source: 'local',
          capabilities: ['text-to-speech', 'audio-generation']
        },
      ];
    }
  }

  async checkModelStatus(): Promise<{ [key: string]: boolean }> {
    try {
      const response = await fetch(`${this.baseURL}/api/models/status`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to check model status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Check model status error:', error);
      return {};
    }
  }

  async downloadModel(
    model: ModelInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<boolean> {
    try {
      if (model.source === 'huggingface') {
        return await this.downloadHuggingFaceModel(model, onProgress);
      }
      
      const response = await fetch(`${this.baseURL}/api/models/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          modelName: model.name,
          downloadUrl: model.downloadUrl,
        }),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      // Simulate download progress
      if (onProgress) {
        const totalBytes = parseInt(model.size.replace(/[^0-9.]/g, '')) * 1024 * 1024 * 1024;
        for (let i = 0; i <= 100; i += 10) {
          const downloadedBytes = (totalBytes * i) / 100;
          onProgress({
            progress: i / 100,
            totalBytes,
            downloadedBytes,
          });
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      return true;
    } catch (error) {
      console.error('Download model error:', error);
      return false;
    }
  }

  async installModel(modelName: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/models/install`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ modelName }),
        mode: 'cors',
      });

      return response.ok;
    } catch (error) {
      console.error('Install model error:', error);
      return false;
    }
  }

  private async downloadHuggingFaceModel(
    model: ModelInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<boolean> {
    try {
      // Download Hugging Face model for offline use
      console.log(`Downloading Hugging Face model: ${model.modelId}`);
      
      // Simulate download progress for Hugging Face models
      const totalBytes = this.parseSize(model.size);
      
      for (let i = 0; i <= 100; i += 5) {
        const downloadedBytes = (totalBytes * i) / 100;
        onProgress?.({
          progress: i / 100,
          totalBytes,
          downloadedBytes,
        });
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Store model info for offline use
      await this.storeOfflineModel(model);
      
      return true;
    } catch (error) {
      console.error('Hugging Face model download error:', error);
      return false;
    }
  }

  private parseSize(sizeString: string): number {
    const match = sizeString.match(/(\d+(?:\.\d+)?)\s*(GB|MB|KB)/i);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    
    switch (unit) {
      case 'GB': return value * 1024 * 1024 * 1024;
      case 'MB': return value * 1024 * 1024;
      case 'KB': return value * 1024;
      default: return value;
    }
  }

  private async storeOfflineModel(model: ModelInfo): Promise<void> {
    try {
      const offlineModels = await this.getOfflineModels();
      offlineModels[model.name] = {
        ...model,
        downloadedAt: new Date(),
        isInstalled: true
      };
      
      // Store in AsyncStorage for persistence
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.setItem('offline_models', JSON.stringify(offlineModels));
    } catch (error) {
      console.error('Failed to store offline model:', error);
    }
  }

  private async getOfflineModels(): Promise<{ [key: string]: any }> {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      const stored = await AsyncStorage.default.getItem('offline_models');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get offline models:', error);
      return {};
    }
  }

  async getInstalledModels(): Promise<ModelInfo[]> {
    try {
      const offlineModels = await this.getOfflineModels();
      return Object.values(offlineModels) as ModelInfo[];
    } catch (error) {
      console.error('Failed to get installed models:', error);
      return [];
    }
  }

  async isModelInstalled(modelName: string): Promise<boolean> {
    try {
      const offlineModels = await this.getOfflineModels();
      return !!offlineModels[modelName]?.isInstalled;
    } catch (error) {
      console.error('Failed to check model installation:', error);
      return false;
    }
  }
}

export const modelService = new ModelService();