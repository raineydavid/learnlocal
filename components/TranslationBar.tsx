import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { Languages, Volume2, X } from 'lucide-react-native';
import { translationService } from '@/services/translationService';
import { audioService } from '@/services/audioService';

interface TranslationBarProps {
  text: string;
  onTranslate?: (translatedText: string, language: string) => void;
}

export default function TranslationBar({ text, onTranslate }: TranslationBarProps) {
  const [showLanguages, setShowLanguages] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const languages = translationService.getSupportedLanguages();

  const handleTranslate = async (targetLanguage: string) => {
    if (targetLanguage === currentLanguage) {
      setShowLanguages(false);
      return;
    }

    setIsTranslating(true);
    setShowLanguages(false);

    try {
      const result = await translationService.translateText({
        text,
        targetLanguage,
        sourceLanguage: currentLanguage,
      });

      setCurrentLanguage(targetLanguage);
      onTranslate?.(result.translatedText, targetLanguage);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      await audioService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      await audioService.speakText(text, { language: currentLanguage });
      setIsSpeaking(false);
    }
  };

  const renderLanguageItem = ({ item }: { item: { code: string; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        item.code === currentLanguage && styles.selectedLanguage,
      ]}
      onPress={() => handleTranslate(item.code)}
    >
      <Text style={[
        styles.languageText,
        item.code === currentLanguage && styles.selectedLanguageText,
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowLanguages(true)}
          disabled={isTranslating}
        >
          <Languages size={20} color="#4F46E5" />
          <Text style={styles.buttonText}>
            {isTranslating ? 'Translating...' : 'Translate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSpeak}
        >
          <Volume2 size={20} color={isSpeaking ? "#EF4444" : "#4F46E5"} />
          <Text style={styles.buttonText}>
            {isSpeaking ? 'Stop' : 'Listen'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showLanguages}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguages(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity
                onPress={() => setShowLanguages(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              style={styles.languageList}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#475569',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    padding: 20,
  },
  languageItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#334155',
  },
  selectedLanguage: {
    backgroundColor: '#4F46E5',
  },
  languageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  selectedLanguageText: {
    fontWeight: 'bold',
  },
});