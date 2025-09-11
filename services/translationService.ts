export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export class TranslationService {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/translate`, {
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
        throw new Error(`Translation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback - return original text
      return {
        translatedText: request.text,
        sourceLanguage: request.sourceLanguage || 'en',
        targetLanguage: request.targetLanguage,
      };
    }
  }

  getSupportedLanguages(): { code: string; name: string }[] {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
    ];
  }
}

export const translationService = new TranslationService();