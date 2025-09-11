import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Sparkles, BookOpen, Clock, Target } from 'lucide-react-native';
import { router } from 'expo-router';
import { harmonyLessonService, LessonRequest, GeneratedLesson } from '@/services/harmonyService';

export default function GenerateTab() {
  const [topic, setTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'stem' | 'creative-arts' | 'our-world'>('stem');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [duration, setDuration] = useState('15');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { id: 'stem' as const, title: 'STEM', color: '#4F46E5' },
    { id: 'creative-arts' as const, title: 'Creative Arts', color: '#7C3AED' },
    { id: 'our-world' as const, title: 'Our World', color: '#059669' },
  ];

  const difficulties = [
    { id: 'beginner' as const, title: 'Beginner', description: 'Ages 8-12, Simple concepts' },
    { id: 'intermediate' as const, title: 'Intermediate', description: 'Ages 13-16, Moderate complexity' },
    { id: 'advanced' as const, title: 'Advanced', description: 'Ages 17+, Complex concepts' },
  ];

  const generateLesson = async () => {
    if (!topic.trim()) {
      Alert.alert('Missing Topic', 'Please enter a topic for your lesson.');
      return;
    }

    setIsGenerating(true);

    try {
      const request: LessonRequest = {
        topic: topic.trim(),
        category: selectedCategory,
        difficulty: selectedDifficulty,
        duration: parseInt(duration) || 15,
        language: 'English',
      };

      const generatedLesson = await harmonyLessonService.generateLesson(request);
      
      // Navigate to the generated lesson
      router.push({
        pathname: '/generated-lesson/[id]',
        params: { 
          id: generatedLesson.id,
          lessonData: JSON.stringify(generatedLesson)
        }
      });
    } catch (error) {
      Alert.alert('Generation Failed', 'Unable to generate lesson. Please check your connection and try again.');
      console.error('Lesson generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Sparkles size={32} color="#4F46E5" />
          </View>
          <Text style={styles.title}>Generate Lesson</Text>
          <Text style={styles.subtitle}>Create personalized lessons with AI</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputSection}>
            <Text style={styles.label}>What would you like to learn about?</Text>
            <TextInput
              style={styles.topicInput}
              value={topic}
              onChangeText={setTopic}
              placeholder="e.g., Solar System, Watercolor Painting, Climate Change..."
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={200}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: selectedCategory === category.id ? category.color : '#334155' }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Difficulty Level</Text>
            <View style={styles.difficultyList}>
              {difficulties.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty.id}
                  style={[
                    styles.difficultyCard,
                    selectedDifficulty === difficulty.id && styles.selectedDifficulty
                  ]}
                  onPress={() => setSelectedDifficulty(difficulty.id)}
                >
                  <View style={styles.difficultyContent}>
                    <Text style={[
                      styles.difficultyTitle,
                      selectedDifficulty === difficulty.id && styles.selectedText
                    ]}>
                      {difficulty.title}
                    </Text>
                    <Text style={[
                      styles.difficultyDescription,
                      selectedDifficulty === difficulty.id && styles.selectedText
                    ]}>
                      {difficulty.description}
                    </Text>
                  </View>
                  {selectedDifficulty === difficulty.id && (
                    <Target size={20} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Duration (minutes)</Text>
            <View style={styles.durationContainer}>
              <Clock size={20} color="#94A3B8" />
              <TextInput
                style={styles.durationInput}
                value={duration}
                onChangeText={setDuration}
                placeholder="15"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={styles.durationLabel}>minutes</Text>
            </View>
          </View>
        </View>

        <View style={styles.generateSection}>
          <TouchableOpacity
            style={[
              styles.generateButton,
              (!topic.trim() || isGenerating) && styles.generateButtonDisabled
            ]}
            onPress={generateLesson}
            disabled={!topic.trim() || isGenerating}
          >
            <BookOpen size={20} color="#FFFFFF" />
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Generating Lesson...' : 'Generate Lesson'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.generateNote}>
            Your lesson will be created using the local GPT-OSS model
          </Text>
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
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  topicInput: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  difficultyList: {
    gap: 12,
  },
  difficultyCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedDifficulty: {
    backgroundColor: '#4F46E5',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  difficultyContent: {
    flex: 1,
  },
  difficultyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  difficultyDescription: {
    fontSize: 14,
    color: '#94A3B8',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  durationInput: {
    fontSize: 16,
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'center',
  },
  durationLabel: {
    fontSize: 16,
    color: '#94A3B8',
  },
  generateSection: {
    padding: 20,
    alignItems: 'center',
  },
  generateButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    gap: 12,
    width: '100%',
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  generateNote: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
});