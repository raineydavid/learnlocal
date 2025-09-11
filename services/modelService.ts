import * as FileSystem from 'expo-file-system';

export interface ModelInfo {
  name: string;
  version: string;
  size: string;
  description: string;
  downloadUrl: string;
  isRequired: boolean;
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
        },
        {
          name: 'Translation Model',
          version: '1.0.0',
          size: '1.8 GB',
          description: 'Multi-language translation support',
          downloadUrl: 'https://example.com/translation-model.bin',
          isRequired: false,
        },
        {
          name: 'TTS Model',
          version: '1.0.0',
          size: '800 MB',
          description: 'Text-to-speech generation',
          downloadUrl: 'https://example.com/tts-model.bin',
          isRequired: false,
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
      // In a real implementation, this would download the model file
      // For now, we'll simulate the download and notify the backend
      
      const response = await fetch(`${this.baseURL}/api/models/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
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
}

export const modelService = new ModelService();