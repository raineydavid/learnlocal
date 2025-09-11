import { offlineService, CachedLesson } from './offlineService';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export interface LessonRequest {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'stem' | 'creative-arts' | 'our-world';
  language?: string;
  duration?: number; // minutes
}

export interface GeneratedLesson {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  content: string;
  activities: string[];
  keyPoints: string[];
  estimatedDuration: number;
  createdAt: Date;
}

export interface HarmonyMessage {
  role: 'system' | 'developer' | 'user' | 'assistant';
  content: string;
}

export interface HarmonyConversation {
  messages: HarmonyMessage[];
}

export class HarmonyLessonService {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  private createLessonPrompt(request: LessonRequest): HarmonyConversation {
    const categoryDescriptions = {
      'stem': 'Science, Technology, Engineering, and Mathematics',
      'creative-arts': 'Creative Arts including visual arts, music, writing, and performing arts',
      'our-world': 'Social Studies, Geography, History, and Current Events'
    };

    const difficultyInstructions = {
      'beginner': 'Use simple language, basic concepts, and include lots of examples. Suitable for ages 8-12.',
      'intermediate': 'Use moderate complexity, introduce some technical terms with explanations. Suitable for ages 13-16.',
      'advanced': 'Use sophisticated language and complex concepts. Suitable for ages 17+.'
    };

    return {
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content creator specializing in creating engaging, interactive lessons for learners of all ages.'
        },
        {
          role: 'developer',
          content: `Create an educational lesson with the following requirements:
- Topic: ${request.topic}
- Category: ${categoryDescriptions[request.category]}
- Difficulty: ${request.difficulty} (${difficultyInstructions[request.difficulty]})
- Duration: Approximately ${request.duration || 15} minutes
- Language: ${request.language || 'English'}

Format the response as a JSON object with these fields:
- title: Engaging lesson title
- content: Main lesson content (markdown formatted)
- activities: Array of 3-5 interactive activities
- keyPoints: Array of 3-5 key learning points
- estimatedDuration: Duration in minutes

Make the lesson engaging, interactive, and age-appropriate. Include real-world examples and practical applications.`
        },
        {
          role: 'user',
          content: `Please generate a ${request.difficulty} level lesson about "${request.topic}" in the ${request.category} category.`
        }
      ]
    };
  }

  async generateLesson(request: LessonRequest): Promise<GeneratedLesson> {
    // First check if we have a cached lesson for this topic
    const cachedLessons = await offlineService.getCachedLessons();
    const existingLesson = cachedLessons.find(lesson => 
      lesson.title.toLowerCase().includes(request.topic.toLowerCase()) &&
      lesson.category === request.category &&
      lesson.difficulty === request.difficulty
    );

    if (existingLesson) {
      console.log('Using cached lesson for:', request.topic);
      return {
        id: existingLesson.id,
        title: existingLesson.title,
        category: existingLesson.category,
        difficulty: existingLesson.difficulty,
        content: existingLesson.content,
        activities: existingLesson.activities,
        keyPoints: existingLesson.keyPoints,
        estimatedDuration: existingLesson.estimatedDuration,
        createdAt: existingLesson.createdAt,
      };
    }

    try {
      const conversation = this.createLessonPrompt(request);
      
      const response = await fetch(`${this.baseURL}/api/generate-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          messages: conversation.messages,
          model: 'gpt-oss',
          maxTokens: 2000,
        }),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Lesson generation failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the generated lesson content
      let lessonData;
      try {
        // Handle different response formats
        const content = data.response || data.content || data.message || '';
        
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          lessonData = JSON.parse(jsonMatch[0]);
        } else {
          lessonData = JSON.parse(content);
        }
      } catch (parseError) {
        // Fallback if the model doesn't return valid JSON
        const content = data.response || data.content || data.message || 'Generated lesson content';
        lessonData = {
          title: `${request.topic} Lesson`,
          content: content,
          activities: [
            'Discuss the main concepts with a partner',
            'Create a mind map of key ideas',
            'Apply the concepts to a real-world scenario'
          ],
          keyPoints: [
            'Understanding the fundamentals',
            'Practical applications',
            'Real-world relevance'
          ],
          estimatedDuration: request.duration || 15
        };
      }

      const generatedLesson = {
        id: `generated-${Date.now()}`,
        title: lessonData.title,
        category: request.category,
        difficulty: request.difficulty,
        content: lessonData.content,
        activities: lessonData.activities || [],
        keyPoints: lessonData.keyPoints || [],
        estimatedDuration: lessonData.estimatedDuration || request.duration || 15,
        createdAt: new Date(),
      };

      // Cache the generated lesson for offline use
      const cachedLesson: CachedLesson = {
        ...generatedLesson,
        cachedAt: new Date(),
      };
      await offlineService.cacheLessons([cachedLesson]);

      return generatedLesson;
    } catch (error) {
      console.error('Lesson generation error:', error);
      
      // Fallback lesson
      const fallbackLesson = {
        id: `fallback-${Date.now()}`,
        title: `${request.topic} - ${request.difficulty} Level`,
        category: request.category,
        difficulty: request.difficulty,
        content: `# ${request.topic}\n\nThis lesson covers the fundamentals of ${request.topic}. The content would be generated by your local GPT-OSS model when the server is available.\n\n## Key Concepts\n\n- Understanding the basics\n- Practical applications\n- Real-world examples\n\n## Activities\n\n1. Research and discuss\n2. Create examples\n3. Apply knowledge`,
        activities: [
          'Research the topic online',
          'Discuss with classmates',
          'Create practical examples'
        ],
        keyPoints: [
          'Basic understanding',
          'Practical application',
          'Real-world relevance'
        ],
        estimatedDuration: request.duration || 15,
        createdAt: new Date(),
      };

      // Cache the fallback lesson too
      const cachedFallback: CachedLesson = {
        ...fallbackLesson,
        cachedAt: new Date(),
      };
      await offlineService.cacheLessons([cachedFallback]);

      return fallbackLesson;
    }
  }

  async generateQuiz(lessonId: string, numQuestions: number = 5): Promise<any> {
    try {
      const conversation = {
        messages: [
          {
            role: 'system',
            content: 'You are an expert quiz creator. Generate engaging, educational quiz questions.'
          },
          {
            role: 'developer',
            content: `Create a quiz with ${numQuestions} multiple choice questions based on the lesson content. Format as JSON with questions array containing: question, options (array of 4), correctAnswer (index), explanation.`
          },
          {
            role: 'user',
            content: `Generate a ${numQuestions}-question quiz for lesson ${lessonId}.`
          }
        ]
      };

      const response = await fetch(`${this.baseURL}/api/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          conversation,
          lessonId,
          model: 'gpt-oss',
        }),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Quiz generation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Quiz generation error:', error);
      return null;
    }
  }
}

export const harmonyLessonService = new HarmonyLessonService();