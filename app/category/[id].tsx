import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();

  const categories = {
    'stem': {
      title: 'STEM',
      description: 'Science, Technology, Engineering, and Mathematics',
      color: '#4F46E5',
      lessons: [
        { id: 'water-purification', title: 'Water Purification', subject: 'Science' },
        { id: 'coding-basics', title: 'Coding Basics', subject: 'Technology' },
        { id: 'bridge-building', title: 'Bridge Building', subject: 'Engineering' },
        { id: 'geometry', title: 'Geometry', subject: 'Mathematics' },
      ],
    },
    'creative-arts': {
      title: 'Creative Arts',
      description: 'Explore creativity through various art forms',
      color: '#7C3AED',
      lessons: [
        { id: 'art-activities', title: 'Art Activities', subject: 'Visual Arts' },
        { id: 'music-theory', title: 'Music Theory', subject: 'Music' },
        { id: 'creative-writing', title: 'Creative Writing', subject: 'Literature' },
        { id: 'drama', title: 'Drama & Theater', subject: 'Performing Arts' },
      ],
    },
    'our-world': {
      title: 'Our World',
      description: 'Learn about our planet and society',
      color: '#059669',
      lessons: [
        { id: 'good-news', title: 'Good News', subject: 'Social Studies' },
        { id: 'geography', title: 'World Geography', subject: 'Geography' },
        { id: 'history', title: 'World History', subject: 'History' },
        { id: 'environment', title: 'Environmental Science', subject: 'Science' },
      ],
    },
  };

  const category = categories[id as keyof typeof categories];

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Category not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
          </View>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>

        <View style={styles.lessonsContainer}>
          <Text style={styles.sectionTitle}>Available Lessons</Text>
          {category.lessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => router.push(`/lesson/${lesson.id}`)}
            >
              <View style={styles.lessonContent}>
                <Text style={styles.lessonSubject}>{lesson.subject}</Text>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
              </View>
              <View style={styles.lessonArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  categoryHeader: {
    padding: 20,
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryDescription: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  lessonsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  lessonCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lessonContent: {
    flex: 1,
  },
  lessonSubject: {
    fontSize: 12,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lessonArrow: {
    marginLeft: 16,
  },
  arrowText: {
    fontSize: 18,
    color: '#94A3B8',
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
  backButtonText: {
    fontSize: 16,
    color: '#4F46E5',
  },
});