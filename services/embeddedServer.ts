import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Platform } from 'react-native';

export interface EmbeddedServerConfig {
  port: number;
  host: string;
  enableCors: boolean;
}

export class EmbeddedAPIServer {
  private app: express.Application;
  private server: any;
  private config: EmbeddedServerConfig;
  private isRunning: boolean = false;

  constructor(config: EmbeddedServerConfig = {
    port: 8080,
    host: '127.0.0.1',
    enableCors: true
  }) {
    this.config = config;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    // Enable CORS for React Native
    if (this.config.enableCors) {
      this.app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true
      }));
    }

    // Body parsing middleware
    this.app.use(bodyParser.json({ limit: '10mb' }));
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`[Embedded API] ${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes() {
    // Health check endpoint
    this.app.get('/api/health', (req, res) => {
      res.json({
        status: 'healthy',
        model: 'embedded-gpt',
        timestamp: new Date().toISOString(),
        platform: Platform.OS
      });
    });

    // Chat endpoint with local AI processing
    this.app.post('/api/chat', async (req, res) => {
      try {
        const { message, model } = req.body;
        
        // Simulate AI processing (replace with actual local AI model)
        const response = await this.processChat(message);
        
        res.json({
          response,
          model: 'embedded-gpt',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Chat processing failed' });
      }
    });

    // Lesson generation endpoint
    this.app.post('/api/generate-lesson', async (req, res) => {
      try {
        const { messages, model, maxTokens } = req.body;
        
        // Extract lesson requirements from messages
        const lessonRequest = this.parseLessonRequest(messages);
        const generatedLesson = await this.generateLesson(lessonRequest);
        
        res.json({
          response: JSON.stringify(generatedLesson),
          model: 'embedded-gpt',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Lesson generation error:', error);
        res.status(500).json({ error: 'Lesson generation failed' });
      }
    });

    // Translation endpoint
    this.app.post('/api/translate', async (req, res) => {
      try {
        const { text, targetLanguage, sourceLanguage } = req.body;
        
        // Use embedded translation logic
        const translatedText = await this.translateText(text, targetLanguage, sourceLanguage);
        
        res.json({
          translatedText,
          sourceLanguage: sourceLanguage || 'auto',
          targetLanguage
        });
      } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed' });
      }
    });

    // Text-to-Speech endpoint
    this.app.post('/api/tts', async (req, res) => {
      try {
        const { text, language, model } = req.body;
        
        // Generate audio URL (placeholder - implement with actual TTS)
        const audioUrl = await this.generateSpeech(text, language);
        
        res.json({
          audioUrl,
          duration: Math.ceil(text.length / 10) // Rough estimate
        });
      } catch (error) {
        console.error('TTS error:', error);
        res.status(500).json({ error: 'TTS generation failed' });
      }
    });

    // Model management endpoints
    this.app.get('/api/models/available', (req, res) => {
      res.json([
        {
          name: 'Embedded GPT',
          version: '1.0.0',
          size: '2.1 GB',
          description: 'Lightweight embedded language model',
          downloadUrl: 'embedded://model',
          isRequired: true
        }
      ]);
    });

    this.app.get('/api/models/status', (req, res) => {
      res.json({
        'Embedded GPT': true
      });
    });

    // Catch-all error handler
    this.app.use((error: any, req: any, res: any, next: any) => {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  private async processChat(message: string): Promise<string> {
    // Implement local AI chat processing
    // This could use a lightweight model like TinyLlama or similar
    
    // For now, return intelligent responses based on keywords
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm your offline learning assistant. How can I help you learn today?";
    }
    
    if (lowerMessage.includes('math') || lowerMessage.includes('mathematics')) {
      return "I'd be happy to help with mathematics! What specific topic would you like to explore? I can help with arithmetic, geometry, algebra, and more.";
    }
    
    if (lowerMessage.includes('science')) {
      return "Science is fascinating! Are you interested in biology, chemistry, physics, or earth science? I can create lessons on any of these topics.";
    }
    
    if (lowerMessage.includes('history')) {
      return "History helps us understand our world! What time period or historical topic interests you? I can create engaging lessons about different civilizations, events, and people.";
    }
    
    // Default educational response
    return `That's an interesting question about "${message}". I can help you learn more about this topic. Would you like me to create a lesson, or do you have specific questions I can answer?`;
  }

  private parseLessonRequest(messages: any[]): any {
    // Parse the lesson generation request from conversation messages
    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    const developerMessage = messages.find(m => m.role === 'developer')?.content || '';
    
    // Extract topic, difficulty, and category from messages
    const topicMatch = userMessage.match(/about ["']([^"']+)["']/i);
    const difficultyMatch = userMessage.match(/(beginner|intermediate|advanced)/i);
    const categoryMatch = developerMessage.match(/Category: ([^,]+)/i);
    
    return {
      topic: topicMatch?.[1] || 'General Learning',
      difficulty: difficultyMatch?.[1]?.toLowerCase() || 'beginner',
      category: categoryMatch?.[1]?.toLowerCase().replace(/\s+/g, '-') || 'general',
      duration: 15
    };
  }

  private async generateLesson(request: any): Promise<any> {
    // Generate lesson content based on request
    const { topic, difficulty, category, duration } = request;
    
    // Create structured lesson content
    const lesson = {
      title: `Learning About ${topic}`,
      content: this.generateLessonContent(topic, difficulty),
      activities: this.generateActivities(topic, difficulty),
      keyPoints: this.generateKeyPoints(topic),
      estimatedDuration: duration || 15
    };
    
    return lesson;
  }

  private generateLessonContent(topic: string, difficulty: string): string {
    const difficultyLevel = difficulty === 'beginner' ? 'simple' : 
                           difficulty === 'intermediate' ? 'moderate' : 'advanced';
    
    return `# ${topic}

This lesson will help you understand ${topic} at a ${difficultyLevel} level.

## Introduction

${topic} is an important subject that helps us understand the world around us. In this lesson, we'll explore the key concepts and learn through interactive activities.

## Main Content

Let's dive into the fascinating world of ${topic}. We'll start with the basics and build up your understanding step by step.

### Key Concepts

Understanding ${topic} involves several important ideas that work together to give us a complete picture.

### Real-World Applications

${topic} isn't just theoretical - it has many practical applications in our daily lives and in various fields of study and work.

## Summary

By the end of this lesson, you'll have a solid understanding of ${topic} and be able to apply this knowledge in practical situations.`;
  }

  private generateActivities(topic: string, difficulty: string): string[] {
    const baseActivities = [
      `Create a mind map showing the main concepts of ${topic}`,
      `Write a short paragraph explaining ${topic} in your own words`,
      `Find three real-world examples of ${topic} in action`,
      `Discuss ${topic} with a friend or family member`,
      `Draw or create a visual representation of ${topic}`
    ];
    
    if (difficulty === 'advanced') {
      baseActivities.push(
        `Research current developments in ${topic}`,
        `Create a presentation about ${topic} for others`
      );
    }
    
    return baseActivities.slice(0, difficulty === 'beginner' ? 3 : 5);
  }

  private generateKeyPoints(topic: string): string[] {
    return [
      `Understanding the fundamental concepts of ${topic}`,
      `Recognizing how ${topic} applies to real-world situations`,
      `Being able to explain ${topic} to others`,
      `Connecting ${topic} to other areas of learning`
    ];
  }

  private async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
    // Implement basic translation logic
    // In a real implementation, this could use an embedded translation model
    
    // For demo purposes, return a placeholder
    if (targetLanguage === 'es') {
      return `[Spanish translation of: ${text}]`;
    } else if (targetLanguage === 'fr') {
      return `[French translation of: ${text}]`;
    }
    
    return text; // Return original if no translation available
  }

  private async generateSpeech(text: string, language: string): Promise<string> {
    // Generate speech audio
    // In a real implementation, this would use an embedded TTS model
    
    // Return a placeholder URL
    return `data:audio/wav;base64,${Buffer.from(text).toString('base64')}`;
  }

  public async start(): Promise<boolean> {
    if (this.isRunning) {
      console.log('Embedded server already running');
      return true;
    }

    try {
      return new Promise((resolve, reject) => {
        this.server = this.app.listen(this.config.port, this.config.host, () => {
          this.isRunning = true;
          console.log(`Embedded API server running on http://${this.config.host}:${this.config.port}`);
          resolve(true);
        });

        this.server.on('error', (error: any) => {
          console.error('Embedded server error:', error);
          reject(error);
        });
      });
    } catch (error) {
      console.error('Failed to start embedded server:', error);
      return false;
    }
  }

  public async stop(): Promise<void> {
    if (!this.isRunning || !this.server) {
      return;
    }

    return new Promise((resolve) => {
      this.server.close(() => {
        this.isRunning = false;
        console.log('Embedded API server stopped');
        resolve();
      });
    });
  }

  public isServerRunning(): boolean {
    return this.isRunning;
  }

  public getServerUrl(): string {
    return `http://${this.config.host}:${this.config.port}`;
  }
}

export const embeddedServer = new EmbeddedAPIServer();