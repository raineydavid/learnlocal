export interface HuggingFaceModel {
  id: string;
  name: string;
  description: string;
  downloads: number;
  likes: number;
  tags: string[];
  pipeline_tag: string;
  library_name: string;
  modelType: 'text-generation' | 'text2text-generation' | 'translation' | 'text-to-speech';
}

export interface HuggingFaceConfig {
  apiKey?: string;
  baseUrl: string;
  timeout: number;
}

export interface GenerationOptions {
  max_length?: number;
  temperature?: number;
  top_p?: number;
  do_sample?: boolean;
  num_return_sequences?: number;
  pad_token_id?: number;
}

export class HuggingFaceService {
  private config: HuggingFaceConfig;
  private selectedModel: string = 'microsoft/DialoGPT-medium';

  constructor(config: Partial<HuggingFaceConfig> = {}) {
    this.config = {
      baseUrl: 'https://api-inference.huggingface.co',
      timeout: 30000,
      ...config
    };
  }

  async searchModels(query: string, filter?: {
    task?: string;
    library?: string;
    language?: string;
    sort?: 'downloads' | 'likes' | 'updated';
    limit?: number;
  }): Promise<HuggingFaceModel[]> {
    try {
      const params = new URLSearchParams();
      params.append('search', query);
      
      if (filter?.task) params.append('filter', `task:${filter.task}`);
      if (filter?.library) params.append('filter', `library:${filter.library}`);
      if (filter?.language) params.append('filter', `language:${filter.language}`);
      if (filter?.sort) params.append('sort', filter.sort);
      if (filter?.limit) params.append('limit', filter.limit.toString());

      const response = await fetch(`${this.config.baseUrl}/api/models?${params}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Model search failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Hugging Face model search error:', error);
      return this.getFallbackModels();
    }
  }

  async generateText(prompt: string, options: GenerationOptions = {}): Promise<string> {
    try {
      const payload = {
        inputs: prompt,
        parameters: {
          max_length: options.max_length || 150,
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 0.9,
          do_sample: options.do_sample !== false,
          num_return_sequences: options.num_return_sequences || 1,
          ...options
        }
      };

      const response = await fetch(`${this.config.baseUrl}/models/${this.selectedModel}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Text generation failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle different response formats
      if (Array.isArray(result) && result.length > 0) {
        return result[0].generated_text || result[0].text || '';
      }
      
      return result.generated_text || result.text || '';
    } catch (error) {
      console.error('Hugging Face text generation error:', error);
      throw error;
    }
  }

  async generateLesson(topic: string, difficulty: string, category: string): Promise<any> {
    const prompt = this.createLessonPrompt(topic, difficulty, category);
    
    try {
      const generatedText = await this.generateText(prompt, {
        max_length: 1000,
        temperature: 0.8,
        top_p: 0.9
      });

      return this.parseLessonResponse(generatedText, topic, difficulty, category);
    } catch (error) {
      console.error('Lesson generation error:', error);
      return this.createFallbackLesson(topic, difficulty, category);
    }
  }

  async chatCompletion(message: string, context: string[] = []): Promise<string> {
    const conversationHistory = context.join('\n');
    const prompt = conversationHistory ? `${conversationHistory}\nHuman: ${message}\nAssistant:` : `Human: ${message}\nAssistant:`;

    try {
      const response = await this.generateText(prompt, {
        max_length: 200,
        temperature: 0.7,
        top_p: 0.9
      });

      // Extract only the assistant's response
      const assistantResponse = response.split('Assistant:').pop()?.split('Human:')[0]?.trim() || response;
      return assistantResponse;
    } catch (error) {
      console.error('Chat completion error:', error);
      return "I'm having trouble connecting to the Hugging Face model. Please try again or check your connection.";
    }
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
    try {
      // Use a translation model
      const translationModel = this.getTranslationModel(sourceLanguage, targetLanguage);
      const originalModel = this.selectedModel;
      this.selectedModel = translationModel;

      const translatedText = await this.generateText(text, {
        max_length: Math.max(text.length * 2, 100),
        temperature: 0.3
      });

      this.selectedModel = originalModel;
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }

  setModel(modelId: string): void {
    this.selectedModel = modelId;
  }

  getSelectedModel(): string {
    return this.selectedModel;
  }

  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  private createLessonPrompt(topic: string, difficulty: string, category: string): string {
    return `Create an educational lesson about "${topic}" for ${difficulty} level students in the ${category} category.

Please provide:
1. A clear lesson title
2. Main content explaining the topic
3. 3-5 key learning points
4. 3-5 interactive activities
5. Estimated duration in minutes

Format the response as a structured lesson plan.

Topic: ${topic}
Difficulty: ${difficulty}
Category: ${category}

Lesson:`;
  }

  private parseLessonResponse(response: string, topic: string, difficulty: string, category: string): any {
    try {
      // Try to extract structured information from the response
      const lines = response.split('\n').filter(line => line.trim());
      
      let title = `${topic} - ${difficulty} Level`;
      let content = response;
      let keyPoints: string[] = [];
      let activities: string[] = [];

      // Extract title if present
      const titleMatch = response.match(/(?:Title|Lesson):\s*(.+)/i);
      if (titleMatch) {
        title = titleMatch[1].trim();
      }

      // Extract key points
      const keyPointsSection = response.match(/(?:Key Points?|Learning Points?):\s*((?:\n.*)*?)(?:\n\n|\nActivities?|$)/i);
      if (keyPointsSection) {
        keyPoints = keyPointsSection[1]
          .split('\n')
          .map(line => line.replace(/^[-*•]\s*/, '').trim())
          .filter(line => line.length > 0)
          .slice(0, 5);
      }

      // Extract activities
      const activitiesSection = response.match(/Activities?:\s*((?:\n.*)*?)(?:\n\n|$)/i);
      if (activitiesSection) {
        activities = activitiesSection[1]
          .split('\n')
          .map(line => line.replace(/^[-*•]\s*/, '').trim())
          .filter(line => line.length > 0)
          .slice(0, 5);
      }

      return {
        title,
        content,
        keyPoints: keyPoints.length > 0 ? keyPoints : [
          `Understanding the basics of ${topic}`,
          `Practical applications of ${topic}`,
          `Real-world examples of ${topic}`
        ],
        activities: activities.length > 0 ? activities : [
          `Research more about ${topic}`,
          `Create examples related to ${topic}`,
          `Discuss ${topic} with others`
        ],
        estimatedDuration: 15
      };
    } catch (error) {
      console.error('Error parsing lesson response:', error);
      return this.createFallbackLesson(topic, difficulty, category);
    }
  }

  private createFallbackLesson(topic: string, difficulty: string, category: string): any {
    return {
      title: `${topic} - ${difficulty} Level`,
      content: `# ${topic}\n\nThis lesson covers the fundamentals of ${topic} at a ${difficulty} level. The content explores key concepts, practical applications, and real-world examples to help you understand this important topic.\n\n## Overview\n\n${topic} is an important subject that helps us understand various aspects of our world. Through this lesson, you'll gain valuable insights and practical knowledge.\n\n## Key Concepts\n\nWe'll explore the main ideas and principles that form the foundation of ${topic}, making sure to present them in a way that's appropriate for ${difficulty} level learners.`,
      keyPoints: [
        `Understanding the fundamental concepts of ${topic}`,
        `Recognizing practical applications of ${topic}`,
        `Connecting ${topic} to real-world situations`,
        `Building a foundation for further learning about ${topic}`
      ],
      activities: [
        `Research additional information about ${topic}`,
        `Create your own examples related to ${topic}`,
        `Discuss what you've learned with others`,
        `Apply ${topic} concepts to a real-world scenario`
      ],
      estimatedDuration: 15
    };
  }

  private getTranslationModel(sourceLanguage?: string, targetLanguage?: string): string {
    // Return appropriate translation model based on language pair
    if (targetLanguage === 'es' || sourceLanguage === 'es') {
      return 'Helsinki-NLP/opus-mt-en-es';
    } else if (targetLanguage === 'fr' || sourceLanguage === 'fr') {
      return 'Helsinki-NLP/opus-mt-en-fr';
    } else if (targetLanguage === 'de' || sourceLanguage === 'de') {
      return 'Helsinki-NLP/opus-mt-en-de';
    }
    
    return 'facebook/mbart-large-50-many-to-many-mmt';
  }

  private getFallbackModels(): HuggingFaceModel[] {
    return [
      {
        id: 'microsoft/DialoGPT-medium',
        name: 'DialoGPT Medium',
        description: 'Conversational AI model for chat applications',
        downloads: 1000000,
        likes: 500,
        tags: ['conversational', 'text-generation'],
        pipeline_tag: 'text-generation',
        library_name: 'transformers',
        modelType: 'text-generation'
      },
      {
        id: 'facebook/blenderbot-400M-distill',
        name: 'BlenderBot 400M',
        description: 'Open-domain chatbot model',
        downloads: 500000,
        likes: 300,
        tags: ['conversational', 'chatbot'],
        pipeline_tag: 'text-generation',
        library_name: 'transformers',
        modelType: 'text-generation'
      },
      {
        id: 'google/flan-t5-base',
        name: 'FLAN-T5 Base',
        description: 'Instruction-tuned text-to-text model',
        downloads: 800000,
        likes: 400,
        tags: ['text2text-generation', 'instruction-following'],
        pipeline_tag: 'text2text-generation',
        library_name: 'transformers',
        modelType: 'text2text-generation'
      }
    ];
  }
}

export const huggingFaceService = new HuggingFaceService();