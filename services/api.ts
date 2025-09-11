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

export class LearnLocalAPI {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  updateBaseURL(newBaseURL: string) {
    this.baseURL = newBaseURL;
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(request),
        mode: 'cors',
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
        },
        mode: 'cors',
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
        },
        mode: 'cors',
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
        },
        body: JSON.stringify(request),
        mode: 'cors',
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
      const response = await fetch(`${this.baseURL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
          sourceLanguage,
        }),
        mode: 'cors',
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
      const response = await fetch(`${this.baseURL}/api/generate-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(request),
        mode: 'cors',
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
        },
        body: JSON.stringify(request),
        mode: 'cors',
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