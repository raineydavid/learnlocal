import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CachedLesson {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  content: string;
  activities: string[];
  keyPoints: string[];
  estimatedDuration: number;
  createdAt: Date;
  cachedAt: Date;
}

export interface CachedChat {
  id: string;
  messages: Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>;
  lastUpdated: Date;
}

export interface OfflineSettings {
  maxCachedLessons: number;
  maxCachedChats: number;
  cacheExpiryDays: number;
  autoDownloadLessons: boolean;
}

export class OfflineService {
  private static instance: OfflineService;
  private readonly LESSONS_KEY = 'cached_lessons';
  private readonly CHATS_KEY = 'cached_chats';
  private readonly SETTINGS_KEY = 'offline_settings';
  private readonly USER_PROGRESS_KEY = 'user_progress';

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  // Lesson Caching
  async cacheLessons(lessons: CachedLesson[]): Promise<void> {
    try {
      const existingLessons = await this.getCachedLessons();
      const mergedLessons = this.mergeLessons(existingLessons, lessons);
      await AsyncStorage.setItem(this.LESSONS_KEY, JSON.stringify(mergedLessons));
    } catch (error) {
      console.error('Failed to cache lessons:', error);
    }
  }

  async getCachedLessons(): Promise<CachedLesson[]> {
    try {
      const cached = await AsyncStorage.getItem(this.LESSONS_KEY);
      if (!cached) return [];
      
      const lessons: CachedLesson[] = JSON.parse(cached);
      return lessons.filter(lesson => !this.isExpired(lesson.cachedAt));
    } catch (error) {
      console.error('Failed to get cached lessons:', error);
      return [];
    }
  }

  async getCachedLessonById(id: string): Promise<CachedLesson | null> {
    const lessons = await this.getCachedLessons();
    return lessons.find(lesson => lesson.id === id) || null;
  }

  async removeCachedLesson(id: string): Promise<void> {
    try {
      const lessons = await this.getCachedLessons();
      const filtered = lessons.filter(lesson => lesson.id !== id);
      await AsyncStorage.setItem(this.LESSONS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove cached lesson:', error);
    }
  }

  // Chat Caching
  async cacheChat(chat: CachedChat): Promise<void> {
    try {
      const existingChats = await this.getCachedChats();
      const updatedChats = existingChats.filter(c => c.id !== chat.id);
      updatedChats.unshift(chat);
      
      // Limit number of cached chats
      const settings = await this.getOfflineSettings();
      const limitedChats = updatedChats.slice(0, settings.maxCachedChats);
      
      await AsyncStorage.setItem(this.CHATS_KEY, JSON.stringify(limitedChats));
    } catch (error) {
      console.error('Failed to cache chat:', error);
    }
  }

  async getCachedChats(): Promise<CachedChat[]> {
    try {
      const cached = await AsyncStorage.getItem(this.CHATS_KEY);
      if (!cached) return [];
      
      const chats: CachedChat[] = JSON.parse(cached);
      return chats.filter(chat => !this.isExpired(chat.lastUpdated));
    } catch (error) {
      console.error('Failed to get cached chats:', error);
      return [];
    }
  }

  // User Progress
  async saveUserProgress(lessonId: string, progress: {
    completed: boolean;
    timeSpent: number;
    score?: number;
    completedAt?: Date;
  }): Promise<void> {
    try {
      const existingProgress = await this.getUserProgress();
      existingProgress[lessonId] = {
        ...progress,
        lastUpdated: new Date(),
      };
      await AsyncStorage.setItem(this.USER_PROGRESS_KEY, JSON.stringify(existingProgress));
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  }

  async getUserProgress(): Promise<{ [lessonId: string]: any }> {
    try {
      const cached = await AsyncStorage.getItem(this.USER_PROGRESS_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.error('Failed to get user progress:', error);
      return {};
    }
  }

  // Offline Settings
  async getOfflineSettings(): Promise<OfflineSettings> {
    try {
      const cached = await AsyncStorage.getItem(this.SETTINGS_KEY);
      const defaultSettings: OfflineSettings = {
        maxCachedLessons: 50,
        maxCachedChats: 10,
        cacheExpiryDays: 30,
        autoDownloadLessons: true,
      };
      
      return cached ? { ...defaultSettings, ...JSON.parse(cached) } : defaultSettings;
    } catch (error) {
      console.error('Failed to get offline settings:', error);
      return {
        maxCachedLessons: 50,
        maxCachedChats: 10,
        cacheExpiryDays: 30,
        autoDownloadLessons: true,
      };
    }
  }

  async updateOfflineSettings(settings: Partial<OfflineSettings>): Promise<void> {
    try {
      const currentSettings = await this.getOfflineSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to update offline settings:', error);
    }
  }

  // Utility Methods
  private mergeLessons(existing: CachedLesson[], newLessons: CachedLesson[]): CachedLesson[] {
    const merged = [...existing];
    
    newLessons.forEach(newLesson => {
      const existingIndex = merged.findIndex(lesson => lesson.id === newLesson.id);
      if (existingIndex >= 0) {
        merged[existingIndex] = newLesson;
      } else {
        merged.push(newLesson);
      }
    });
    
    return merged;
  }

  private isExpired(date: Date): boolean {
    const settings = this.getOfflineSettings();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - (settings as any).cacheExpiryDays || 30);
    return new Date(date) < expiryDate;
  }

  // Cache Management
  async clearExpiredCache(): Promise<void> {
    try {
      const lessons = await this.getCachedLessons();
      const chats = await this.getCachedChats();
      
      await AsyncStorage.setItem(this.LESSONS_KEY, JSON.stringify(lessons));
      await AsyncStorage.setItem(this.CHATS_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
    }
  }

  async getCacheSize(): Promise<{ lessons: number; chats: number; totalMB: number }> {
    try {
      const lessons = await AsyncStorage.getItem(this.LESSONS_KEY);
      const chats = await AsyncStorage.getItem(this.CHATS_KEY);
      
      const lessonsSize = lessons ? new Blob([lessons]).size : 0;
      const chatsSize = chats ? new Blob([chats]).size : 0;
      const totalBytes = lessonsSize + chatsSize;
      
      return {
        lessons: lessonsSize,
        chats: chatsSize,
        totalMB: totalBytes / (1024 * 1024),
      };
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return { lessons: 0, chats: 0, totalMB: 0 };
    }
  }

  async clearAllCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.LESSONS_KEY,
        this.CHATS_KEY,
      ]);
    } catch (error) {
      console.error('Failed to clear all cache:', error);
    }
  }
}

export const offlineService = OfflineService.getInstance();