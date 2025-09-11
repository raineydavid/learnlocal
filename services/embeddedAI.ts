import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AIModelConfig {
  name: string;
  size: number;
  isLoaded: boolean;
  capabilities: string[];
}

export interface ChatContext {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }>;
  topic?: string;
  difficulty?: string;
}

export class EmbeddedAI {
  private static instance: EmbeddedAI;
  private models: Map<string, AIModelConfig> = new Map();
  private chatContext: ChatContext = { messages: [] };
  private knowledgeBase: Map<string, any> = new Map();

  static getInstance(): EmbeddedAI {
    if (!EmbeddedAI.instance) {
      EmbeddedAI.instance = new EmbeddedAI();
    }
    return EmbeddedAI.instance;
  }

  constructor() {
    this.initializeKnowledgeBase();
    this.loadModels();
  }

  private initializeKnowledgeBase() {
    // Initialize with educational content
    this.knowledgeBase.set('mathematics', {
      topics: ['arithmetic', 'algebra', 'geometry', 'calculus'],
      concepts: {
        arithmetic: ['addition', 'subtraction', 'multiplication', 'division'],
        algebra: ['variables', 'equations', 'functions', 'polynomials'],
        geometry: ['shapes', 'angles', 'area', 'volume'],
        calculus: ['derivatives', 'integrals', 'limits']
      },
      examples: {
        arithmetic: '2 + 2 = 4',
        algebra: 'x + 5 = 10, so x = 5',
        geometry: 'Area of rectangle = length × width'
      }
    });

    this.knowledgeBase.set('science', {
      topics: ['biology', 'chemistry', 'physics', 'earth-science'],
      concepts: {
        biology: ['cells', 'genetics', 'evolution', 'ecosystems'],
        chemistry: ['atoms', 'molecules', 'reactions', 'periodic-table'],
        physics: ['motion', 'energy', 'waves', 'electricity'],
        'earth-science': ['geology', 'weather', 'climate', 'space']
      }
    });

    this.knowledgeBase.set('history', {
      topics: ['ancient', 'medieval', 'modern', 'contemporary'],
      concepts: {
        ancient: ['civilizations', 'empires', 'cultures'],
        medieval: ['feudalism', 'crusades', 'renaissance'],
        modern: ['industrial-revolution', 'world-wars', 'colonialism'],
        contemporary: ['cold-war', 'globalization', 'technology']
      }
    });

    this.knowledgeBase.set('language-arts', {
      topics: ['reading', 'writing', 'grammar', 'literature'],
      concepts: {
        reading: ['comprehension', 'vocabulary', 'fluency'],
        writing: ['essays', 'creative-writing', 'research'],
        grammar: ['parts-of-speech', 'sentence-structure', 'punctuation'],
        literature: ['poetry', 'novels', 'drama', 'analysis']
      }
    });
  }

  private async loadModels() {
    // Simulate loading embedded AI models
    this.models.set('chat-model', {
      name: 'Embedded Chat Model',
      size: 500, // MB
      isLoaded: true,
      capabilities: ['conversation', 'question-answering', 'explanation']
    });

    this.models.set('lesson-generator', {
      name: 'Lesson Generation Model',
      size: 800, // MB
      isLoaded: true,
      capabilities: ['lesson-creation', 'content-structuring', 'activity-generation']
    });

    this.models.set('translation-model', {
      name: 'Translation Model',
      size: 300, // MB
      isLoaded: false,
      capabilities: ['text-translation', 'language-detection']
    });
  }

  public async processChat(message: string, context?: any): Promise<string> {
    // Add user message to context
    this.chatContext.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Generate response based on message content and knowledge base
    const response = await this.generateChatResponse(message);

    // Add assistant response to context
    this.chatContext.messages.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    return response;
  }

  private async generateChatResponse(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    // Educational topic detection
    if (this.containsEducationalTopic(lowerMessage)) {
      return this.generateEducationalResponse(lowerMessage);
    }

    // Question answering
    if (lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('why')) {
      return this.generateExplanationResponse(lowerMessage);
    }

    // Lesson request
    if (lowerMessage.includes('lesson') || lowerMessage.includes('teach') || lowerMessage.includes('learn')) {
      return this.generateLessonSuggestion(lowerMessage);
    }

    // Greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm your offline learning assistant. I can help you with math, science, history, language arts, and more. What would you like to learn about today?";
    }

    // Default educational response
    return this.generateDefaultEducationalResponse(message);
  }

  private containsEducationalTopic(message: string): boolean {
    const topics = ['math', 'science', 'history', 'english', 'biology', 'chemistry', 'physics', 'algebra', 'geometry'];
    return topics.some(topic => message.includes(topic));
  }

  private generateEducationalResponse(message: string): string {
    // Detect subject
    let subject = 'general';
    if (message.includes('math') || message.includes('algebra') || message.includes('geometry')) {
      subject = 'mathematics';
    } else if (message.includes('science') || message.includes('biology') || message.includes('chemistry') || message.includes('physics')) {
      subject = 'science';
    } else if (message.includes('history')) {
      subject = 'history';
    } else if (message.includes('english') || message.includes('writing') || message.includes('reading')) {
      subject = 'language-arts';
    }

    const knowledge = this.knowledgeBase.get(subject);
    if (knowledge) {
      const topics = knowledge.topics.slice(0, 3).join(', ');
      return `Great! I can help you with ${subject}. Some key areas include: ${topics}. What specific topic would you like to explore? I can create a lesson or answer questions about any of these areas.`;
    }

    return `I'd be happy to help you learn about that topic! Could you be more specific about what aspect you'd like to explore?`;
  }

  private generateExplanationResponse(message: string): string {
    // Simple keyword-based explanations
    if (message.includes('photosynthesis')) {
      return "Photosynthesis is the process plants use to make food from sunlight, water, and carbon dioxide. The green chlorophyll in leaves captures sunlight energy, which combines water from the roots and CO2 from the air to create glucose (sugar) and oxygen. This is why plants are so important - they make the oxygen we breathe!";
    }

    if (message.includes('gravity')) {
      return "Gravity is the force that pulls objects toward each other. On Earth, gravity pulls everything toward the center of our planet, which is why things fall down instead of floating away. The bigger an object is, the stronger its gravitational pull. That's why the Moon orbits Earth, and Earth orbits the Sun!";
    }

    if (message.includes('democracy')) {
      return "Democracy is a system of government where people have the power to choose their leaders through voting. In a democracy, citizens elect representatives who make decisions on their behalf. Key principles include equal rights, free elections, and the rule of law. This gives people a voice in how their country is run.";
    }

    // Default explanation response
    return `That's a great question! While I don't have a specific explanation ready, I'd be happy to help you explore this topic. Would you like me to create a lesson about it, or do you have more specific questions I can help with?`;
  }

  private generateLessonSuggestion(message: string): string {
    return "I'd love to create a lesson for you! To make the best lesson possible, could you tell me:\n\n1. What topic you'd like to learn about\n2. Your current level (beginner, intermediate, or advanced)\n3. How much time you have (15, 30, or 45 minutes)\n\nI can create engaging lessons with activities and key points to help you learn effectively!";
  }

  private generateDefaultEducationalResponse(message: string): string {
    const responses = [
      "That's an interesting topic! I can help you learn more about it. Would you like me to create a lesson or answer specific questions?",
      "I'd be happy to help you explore that subject! What specific aspect would you like to focus on?",
      "Great question! Learning is all about curiosity. What would you like to understand better about this topic?",
      "I can help you dive deeper into that subject. Would you prefer a structured lesson or a more conversational exploration?"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  public async generateLesson(request: {
    topic: string;
    difficulty: string;
    category: string;
    duration: number;
  }): Promise<any> {
    const { topic, difficulty, category, duration } = request;

    // Generate lesson structure
    const lesson = {
      title: this.generateLessonTitle(topic, difficulty),
      content: this.generateLessonContent(topic, difficulty, category),
      activities: this.generateLessonActivities(topic, difficulty),
      keyPoints: this.generateKeyPoints(topic, category),
      estimatedDuration: duration
    };

    return lesson;
  }

  private generateLessonTitle(topic: string, difficulty: string): string {
    const levelText = difficulty === 'beginner' ? 'Introduction to' :
                     difficulty === 'intermediate' ? 'Understanding' :
                     'Advanced';
    
    return `${levelText} ${topic}`;
  }

  private generateLessonContent(topic: string, difficulty: string, category: string): string {
    const knowledge = this.knowledgeBase.get(category) || this.knowledgeBase.get('general');
    
    // Return structured JSON content for better parsing
    const lessonContent = {
      title: `${difficulty === 'beginner' ? 'Introduction to' : difficulty === 'intermediate' ? 'Understanding' : 'Advanced'} ${topic}`,
      content: this.generateMarkdownContent(topic, difficulty, category),
      keyPoints: this.generateKeyPoints(topic, category),
      activities: this.generateLessonActivities(topic, difficulty),
      estimatedDuration: 15,
      objectives: [
        `Understand the basic concepts of ${topic}`,
        `Apply ${topic} knowledge to real-world situations`,
        `Demonstrate comprehension through activities`
      ],
      summary: `This lesson provides a comprehensive ${difficulty}-level introduction to ${topic}, covering key concepts, practical applications, and engaging activities to reinforce learning.`
    };
    
    return JSON.stringify(lessonContent, null, 2);
  }

  private generateMarkdownContent(topic: string, difficulty: string, category: string): string {
    let content = `# ${topic}\n\n`;
    
    if (difficulty === 'beginner') {
      content += `Welcome to your introduction to ${topic}! This lesson is designed to give you a solid foundation in the basics.\n\n`;
    } else if (difficulty === 'intermediate') {
      content += `In this lesson, we'll build on your existing knowledge of ${topic} and explore more complex concepts.\n\n`;
    } else {
      content += `This advanced lesson on ${topic} will challenge you with sophisticated concepts and applications.\n\n`;
    }

    content += `## What is ${topic}?\n\n`;
    content += `${topic} is an important concept that helps us understand the world around us. `;
    
    if (category === 'mathematics') {
      content += `In mathematics, ${topic} involves logical thinking, problem-solving, and working with numbers and patterns.\n\n`;
    } else if (category === 'science') {
      content += `In science, ${topic} helps us understand natural phenomena through observation, experimentation, and analysis.\n\n`;
    } else if (category === 'history') {
      content += `In history, ${topic} helps us understand past events, their causes, and their impact on our world today.\n\n`;
    } else {
      content += `This subject area provides valuable knowledge and skills for understanding our world.\n\n`;
    }

    content += `## Key Concepts\n\n`;
    content += `Let's explore the main ideas that make up ${topic}:\n\n`;
    content += `- **Foundation**: Understanding the basic principles\n`;
    content += `- **Application**: How these principles work in practice\n`;
    content += `- **Connection**: How this relates to other areas of learning\n\n`;

    content += `## Real-World Examples\n\n`;
    content += `${topic} isn't just theoretical - it has many practical applications in our daily lives and in various fields.\n\n`;

    content += `## Summary\n\n`;
    content += `By understanding ${topic}, you gain valuable knowledge that can be applied in many different situations. `;
    content += `This foundation will help you in further learning and in understanding the world around you.`;

    return content;
  }

  private generateLessonActivities(topic: string, difficulty: string): string[] {
    const baseActivities = [
      `Create a concept map showing the main ideas of ${topic}`,
      `Write a short explanation of ${topic} in your own words`,
      `Find three real-world examples where ${topic} is important`,
      `Discuss what you've learned about ${topic} with someone else`
    ];

    if (difficulty === 'intermediate') {
      baseActivities.push(`Research one aspect of ${topic} in more detail`);
      baseActivities.push(`Create a presentation about ${topic} for others`);
    }

    if (difficulty === 'advanced') {
      baseActivities.push(`Analyze how ${topic} connects to other subjects`);
      baseActivities.push(`Develop your own questions about ${topic} for further exploration`);
    }

    return baseActivities.slice(0, difficulty === 'beginner' ? 4 : 6);
  }

  private generateKeyPoints(topic: string, category: string): string[] {
    const basePoints = [
      `Understanding the fundamental concepts of ${topic}`,
      `Recognizing how ${topic} applies to real situations`,
      `Being able to explain ${topic} to others`
    ];

    if (category === 'mathematics') {
      basePoints.push(`Solving problems related to ${topic}`);
    } else if (category === 'science') {
      basePoints.push(`Using scientific thinking to understand ${topic}`);
    } else if (category === 'history') {
      basePoints.push(`Understanding the historical significance of ${topic}`);
    }

    basePoints.push(`Connecting ${topic} to other areas of learning`);

    return basePoints;
  }

  public getAvailableModels(): AIModelConfig[] {
    return Array.from(this.models.values());
  }

  public async loadModel(modelName: string): Promise<boolean> {
    const model = this.models.get(modelName);
    if (model) {
      model.isLoaded = true;
      return true;
    }
    return false;
  }

  public clearChatContext(): void {
    this.chatContext = { messages: [] };
  }
}

export const embeddedAI = EmbeddedAI.getInstance();