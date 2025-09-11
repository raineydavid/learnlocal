import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Clock, Target, BookOpen, CircleCheck as CheckCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { GeneratedLesson } from '@/services/harmonyService';
import TranslationBar from '@/components/TranslationBar';
import LessonPlayer from '@/components/LessonPlayer';
import LessonContentRenderer from '@/components/LessonContentRenderer';

export default function GeneratedLessonScreen() {
  const { id, lessonData } = useLocalSearchParams();
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  let lesson: GeneratedLesson;
  try {
    lesson = JSON.parse(lessonData as string);
  } catch (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lesson not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'stem': return '#4F46E5';
      case 'creative-arts': return '#7C3AED';
      case 'our-world': return '#059669';
      default: return '#4F46E5';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#10B981';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generated Lesson</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.lessonHeader}>
          <View style={styles.badgeContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(lesson.category) }]}>
              <Text style={styles.badgeText}>{lesson.category.toUpperCase().replace('-', ' ')}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(lesson.difficulty) }]}>
              <Text style={styles.badgeText}>{lesson.difficulty.toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Clock size={16} color="#94A3B8" />
              <Text style={styles.metaText}>{lesson.estimatedDuration} minutes</Text>
            </View>
            <View style={styles.metaItem}>
              <Target size={16} color="#94A3B8" />
              <Text style={styles.metaText}>{lesson.difficulty} level</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <TranslationBar
            text={lesson.content}
            onTranslate={(translatedText, language) => {
              setTranslatedContent(translatedText);
              setCurrentLanguage(language);
            }}
          />
          
          <LessonPlayer 
            text={translatedContent || lesson.content}
            title={lesson.title}
          />
          
          <LessonContentRenderer 
            jsonContent={translatedContent || lesson.content}
            fallbackContent={lesson.content}
          />

          {lesson.keyPoints.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Learning Points</Text>
              {lesson.keyPoints.map((point, index) => (
                <View key={index} style={styles.keyPointItem}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={styles.keyPointText}>{point}</Text>
                </View>
              ))}
            </View>
          )}

          {lesson.activities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activities</Text>
              {lesson.activities.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityNumber}>
                    <Text style={styles.activityNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.activityText}>{activity}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.startButton}>
              <BookOpen size={20} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start Learning</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save for Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 60,
  },
  lessonHeader: {
    padding: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lessonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 36,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  contentText: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  keyPointText: {
    fontSize: 16,
    color: '#94A3B8',
    flex: 1,
    lineHeight: 22,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  activityNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  activityNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activityText: {
    fontSize: 16,
    color: '#94A3B8',
    flex: 1,
    lineHeight: 22,
  },
  actionButtons: {
    gap: 12,
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#4F46E5',
  },
});