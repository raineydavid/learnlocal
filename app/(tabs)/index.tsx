import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeTab() {
  const categories = [
    {
      id: 'stem',
      title: 'STEM',
      color: '#4F46E5',
    },
    {
      id: 'creative-arts',
      title: 'Creative Arts',
      color: '#7C3AED',
    },
    {
      id: 'our-world',
      title: 'Our World',
      color: '#059669',
    },
  ];

  const featuredLessons = [
    {
      id: 'water-purification',
      category: 'SCIENCE',
      title: 'Water Purification',
      description: 'Access to clean water is critical. There are various methods to purify water to make it safe for drinking',
      image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=800',
      categoryColor: '#4F46E5',
    },
    {
      id: 'good-news',
      category: 'SOCIAL STUDIES',
      title: 'Good News',
      description: 'Read about positive and inspiring events happening all around the world.',
      image: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
      categoryColor: '#059669',
    },
    {
      id: 'art-activities',
      category: 'ARTS',
      title: 'Art Activities',
      description: 'Explore creative expression through various art forms and techniques.',
      image: 'https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=800',
      categoryColor: '#7C3AED',
    },
  ];

  const navigateToCategory = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  const navigateToLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>LearnLocal</Text>
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              onPress={() => navigateToCategory(category.id)}
            >
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Lessons</Text>
          {featuredLessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => navigateToLesson(lesson.id)}
            >
              <Image source={{ uri: lesson.image }} style={styles.lessonImage} />
              <View style={styles.lessonContent}>
                <View style={[styles.categoryBadge, { backgroundColor: lesson.categoryColor }]}>
                  <Text style={styles.categoryBadgeText}>{lesson.category}</Text>
                </View>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDescription}>{lesson.description}</Text>
                <View style={styles.startLessonButton}>
                  <Text style={styles.startLessonText}>Start Lesson</Text>
                </View>
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
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  categoryCard: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  featuredSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  lessonCard: {
    backgroundColor: '#334155',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lessonImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  lessonContent: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
    marginBottom: 20,
  },
  startLessonButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  startLessonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});