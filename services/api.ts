export interface ChatRequest {
  message: string;
  model: string;
}

export interface ChatResponse {
  response: string;
  model: string;
  timestamp: string;
}

export interface TTSRequest {
  text: string;
  language: string;
  model: string;
}

export interface TTSResponse {
  audioUrl: string;
  duration: number;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface HarmonyRequest {
  conversation: any;
  model: string;
  maxTokens?: number;
}

export interface HarmonyResponse {
  content: string;
  tokens: number;
  model: string;
}

export interface ModelProvider {
  id: 'gpt-oss' | 'huggingface';
  name: string;
  description: string;
  available: boolean;
}

export class LearnLocalAPI {
  private baseURL: string;
  private selectedProvider: 'gpt-oss' | 'huggingface' = 'gpt-oss';

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  updateBaseURL(newBaseURL: string) {
    this.baseURL = newBaseURL;
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  setProvider(provider: 'gpt-oss' | 'huggingface') {
    this.selectedProvider = provider;
  }

  getProvider(): 'gpt-oss' | 'huggingface' {
    return this.selectedProvider;
  }

  async getAvailableProviders(): Promise<ModelProvider[]> {
    return [
      {
        id: 'gpt-oss',
        name: 'GPT-OSS Local',
        description: 'Local GPT-OSS 20B model running on your FastAPI server',
        available: true
      },
      {
        id: 'huggingface',
        name: 'Hugging Face',
        description: 'Cloud-based models from Hugging Face Hub',
        available: true
      }
    ];
  }

  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Route to appropriate provider
      if (this.selectedProvider === 'huggingface') {
        const { huggingFaceService } = await import('./huggingFaceService');
        const response = await huggingFaceService.chatCompletion(request.message);
        return {
          response,
          model: 'huggingface',
          timestamp: new Date().toISOString()
        };
      }

      // Default to GPT-OSS
      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        },
        body: JSON.stringify(request),
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }

  async getLearningModules(): Promise<LearningModule[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/modules`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        },
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Modules API error:', error);
      throw error;
    }
  }

  async checkServerStatus(): Promise<{ status: string; model: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        },
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  async generateSpeech(request: TTSRequest): Promise<TTSResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        },
        body: JSON.stringify(request),
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('TTS API error:', error);
      throw error;
    }
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage?: string) {
    try {
      // Route to appropriate provider
      if (this.selectedProvider === 'huggingface') {
        const { huggingFaceService } = await import('./huggingFaceService');
        const translatedText = await huggingFaceService.translateText(text, targetLanguage, sourceLanguage);
        return {
          translatedText,
          sourceLanguage: sourceLanguage || 'auto',
          targetLanguage
        };
      }

      // Default to GPT-OSS
      const response = await fetch(`${this.baseURL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
          sourceLanguage,
        }),
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`Translation request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Translation API error:', error);
      throw error;
    }
  }

  async generateLesson(request: HarmonyRequest): Promise<HarmonyResponse> {
    try {
      // Route to appropriate provider
      if (this.selectedProvider === 'huggingface') {
        const { huggingFaceService } = await import('./huggingFaceService');
        
        // Extract lesson parameters from messages
        const userMessage = request.conversation.messages.find(m => m.role === 'user')?.content || '';
        const developerMessage = request.conversation.messages.find(m => m.role === 'developer')?.content || '';
        
        const topicMatch = userMessage.match(/about ["']([^"']+)["']/i) || developerMessage.match(/Topic: ([^,\n]+)/i);
        const difficultyMatch = userMessage.match(/(beginner|intermediate|advanced)/i) || developerMessage.match(/Difficulty: ([^,\n]+)/i);
        const categoryMatch = developerMessage.match(/Category: ([^,\n]+)/i);
        
        const topic = topicMatch?.[1] || 'General Learning';
        const difficulty = difficultyMatch?.[1]?.toLowerCase() || 'beginner';
        const category = categoryMatch?.[1]?.toLowerCase().replace(/\s+/g, '-') || 'general';
        
        const lesson = await huggingFaceService.generateLesson(topic, difficulty, category);
        
        return {
          content: JSON.stringify(lesson),
          tokens: 0,
          model: 'huggingface'
        };
      }

      // Default to GPT-OSS
      const response = await fetch(`${this.baseURL}/api/generate-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        },
        body: JSON.stringify(request),
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`Lesson generation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lesson generation error:', error);
      throw error;
    }
  }

  async generateQuiz(request: HarmonyRequest & { lessonId: string }): Promise<HarmonyResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        },
        body: JSON.stringify(request),
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`Quiz generation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Quiz generation error:', error);
      throw error;
    }
  }
}

export const api = new LearnLocalAPI();